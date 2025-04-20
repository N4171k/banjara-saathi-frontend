'use client'

import { useRef, useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Send, Loader2, Volume2, Mic } from 'lucide-react'
import removeMarkdown from 'remove-markdown'
import axios from 'axios'
import { saveMessage, updateIterinary, getMessagesForItinerary, markItineraryAsCommunity } from '@/utils/dbHelpers'
import MarkDownRenderer from './MarkdownRenderer'
import { backendUrl } from '@/env.exports'
import { Models } from 'appwrite'
import Editor from './MarkDownEditor'
import { useRouter } from 'next/navigation'

type Message = {
  time: string
  sender: 'user' | 'bot'
  content: string
  iterinaryId: string
}

type Props = {
  iterinaryId: string
  iterinary: any
  setIterinary: (iterinary: any) => void
  language: 'English' | 'Hindi'
  locations: any[]
  setIsLoading: (loading: boolean) => void
  fetchLocations: (message: any) => void
}

export default function ChatInterface({
  iterinaryId,
  iterinary,
  setIterinary,
  setIsLoading,
  fetchLocations,
  language
}: Props) {
  const router = useRouter()
  const [isMapVisible, setMapVisible] = useState(true)
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      time: new Date().toISOString(),
      content: iterinary,
      sender: 'bot',
      iterinaryId
    }
  ])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speakingMessage, setSpeakingMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [isModifyIterinary, setIsModifyIterinary] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Scroll chat to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load saved messages
  useEffect(() => {
    async function loadMessagesForTrip() {
      if (!iterinaryId) return
      try {
        setLoading(true)
        const fetched = await getMessagesForItinerary(iterinaryId)
        const docs = fetched as Models.Document[]
        const sorted = docs
          .map(doc => ({
            time: doc.time,
            sender: doc.sender,
            content: doc.content,
            iterinaryId: doc.iterinaryId
          }))
          .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        setMessages(prev => [...prev, ...sorted])
      } catch (err) {
        console.error('Error loading messages:', err)
      } finally {
        setLoading(false)
      }
    }
    loadMessagesForTrip()
  }, [iterinaryId])

  // Speech recognition setup
  const getRecognition = () => {
    if (!recognitionRef.current) {
      const Rec =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
      recognitionRef.current = new Rec()
      Object.assign(recognitionRef.current, {
        continuous: false,
        interimResults: false,
        maxAlternatives: 1,
        lang: language === 'Hindi' ? 'hi-IN' : 'en-US'
      })
      recognitionRef.current.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript
        if (inputRef.current) inputRef.current.value = transcript
      }
      recognitionRef.current.onerror = (err: any) => {
        console.error('Speech recognition error', err)
      }
      recognitionRef.current.onend = () => setIsRecording(false)
    }
    return recognitionRef.current
  }

  const handleSpeechRecognition = () => {
    const rec = getRecognition()
    if (isRecording) {
      rec.stop()
    } else {
      rec.lang = language === 'Hindi' ? 'hi-IN' : 'en-US'
      setIsRecording(true)
      rec.start()
    }
  }

  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) return console.error('Speech synthesis not supported')
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      return setIsSpeaking(false)
    }
    setIsSpeaking(true)
    setSpeakingMessage(text)
    const utterance = new SpeechSynthesisUtterance(removeMarkdown(text))
    utterance.lang = language === 'Hindi' ? 'hi-IN' : 'en-US'
    utterance.rate = 1.2
    const voice = window.speechSynthesis
      .getVoices()
      .find(v => v.lang === utterance.lang)
    if (voice) utterance.voice = voice
    utterance.onend = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return
    const userMsg: Message = { iterinaryId, time: new Date().toISOString(), content: message, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    await saveMessage(userMsg)

    try {
      setLoading(true)
      const res = await axios.post(backendUrl + `/api/chat`, { question: message, iterinary, language, chatHistory: [...messages, userMsg] })
      const data = res.data.data
      setIsModifyIterinary(!!data.isModifyIterinary)
      const botMsg: Message = { iterinaryId, time: new Date().toISOString(), content: data.answer, sender: 'bot' }
      await saveMessage(botMsg)
      setMessages(prev => [...prev, botMsg])
      fetchLocations(data.answer)
    } catch (err) {
      console.error('Error generating response:', err)
      setMessages(prev => [...prev, { iterinaryId, time: new Date().toISOString(), content: '⚠️ Something went wrong. Please try again.', sender: 'bot' }])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const content = inputRef.current?.value || ''
    if (!content.trim()) return
    await sendMessage(content)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDownload = async () => {
    if (window.confirm('Do you want to contribute this itinerary to the community?')) {
      await markItineraryAsCommunity(iterinaryId)
    }
    router.push('/plan/' + iterinaryId + '/download')
  }

  const modifyIterinary = async () => {
    try {
      setLoading(true)
      const res = await axios.post(`/modify-iterinary`, { iterinary, answer: messages.at(-1)?.content, language })
      const updated = res.data.data
      const botMsg: Message = { iterinaryId, time: new Date().toISOString(), content: updated, sender: 'bot' }
      await saveMessage(botMsg)
      await updateIterinary(iterinaryId, updated)
      setIterinary(updated)
      setMessages(prev => [...prev, botMsg])
      setIsModifyIterinary(false)
    } catch (err) {
      console.error('Error generating response:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-h-screen flex items-center justify-center overflow-hidden'>
      <div className='w-full h-[100vh] backdrop-blur-md rounded-2xl shadow-2xl flex flex-col overflow-hidden'>
        <div className='flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar pl-6'>
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>                                                                                     
              <div className={`max-w-[75%] p-4 rounded-xl shadow-md ${msg.sender === 'bot' ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-900'}`}>
                <MarkDownRenderer message={msg.content} />
                {msg.sender === 'bot' && (
                  <button onClick={() => speakMessage(msg.content)} className='mt-2 flex items-center text-sm text-blue-600 hover:underline'>
                    <Volume2 className='w-4 h-4 mr-1' />
                    {speakingMessage === msg.content && isSpeaking ? 'Stop' : 'Speak'}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isModifyIterinary && (
            <div className='my-2 mx-auto text-center'>
              <p className='mb-2'>Do you wish to modify the itinerary?</p>
              <div className='flex justify-center space-x-4'>
                <button onClick={modifyIterinary} className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'>Yes</button>
                <button onClick={() => setIsModifyIterinary(false)} className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'>No</button>
              </div>
            </div>
          )}

          {loading && (
            <div className='text-center text-gray-600'>
              <Loader2 className='w-5 h-5 animate-spin inline-block' />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className='p-4 border-t bg-white/50 flex space-x-2 items-center'>
          <button type='button' onClick={handleSpeechRecognition} className={`p-2 rounded-full border ${isRecording ? 'bg-red-200' : 'bg-white'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'}>
            <Mic className='w-5 h-5' />
          </button>
          <input ref={inputRef} type='text' placeholder='Type a message...' className='flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400' disabled={loading} />
          <button type='submit' disabled={loading} className='flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg'>
            <Send className='w-4 h-4 mr-2' /> Send
          </button>
        </form>

        <div className='p-3 bg-white/40 flex justify-between space-x-2'>
          <button className='flex-1 p-2 bg-gray-200 rounded-lg hover:bg-gray-300' onClick={handleDownload}>Download</button>
          <button onClick={() => setIsEditorOpen(true)} className='flex-1 p-2 bg-gray-200 rounded-lg hover:bg-gray-300'>Edit</button>
        </div>
      </div>

      {isEditorOpen && (
        <Editor
          iterinary={iterinary}
          setEditorOpen={setIsEditorOpen}
          setIterinary={setIterinary}
          saveEditedIterinary={async editedIterinary => {
            if (!editedIterinary.trim() || editedIterinary.length > 10000) return
            await updateIterinary(iterinaryId, editedIterinary)
            setIterinary(editedIterinary)
            setIsEditorOpen(false)
          }}
          setMapVisible={setMapVisible}
        />
      )}
    </div>
  )
}
