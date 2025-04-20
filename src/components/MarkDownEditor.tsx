import React, { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

type EditorProps = {
  iterinary: string
  setEditorOpen: (open: boolean) => void
  setIterinary: (iterinary: string) => void
  saveEditedIterinary: (
    text: string,
    setIterinary: (text: string) => void
  ) => void
}

export default function Editor ({
  iterinary,
  setEditorOpen,
  setIterinary,
  saveEditedIterinary
}: EditorProps) {
  const [text, setText] = useState<string>(iterinary)

  return (
    <div className='w-screen h-screen fixed top-0 left-0 backdrop-blur-lg bg-white/30 border border-white/20 shadow-lg p-6 flex flex-col gap-5 z-50'>
      <MDEditor
        value={text}
        onChange={value => setText(value || '')}
        preview='live'
        className='w-full min-h-[90%]'
      />
      <div className='flex justify-center gap-4'>
        <button
          onClick={() => setEditorOpen(false)}
          className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'
        >
          Close Editor
        </button>
        <button
          onClick={() => saveEditedIterinary(text, setIterinary)}
          className='px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100'
        >
          Save Itinerary
        </button>
      </div>
    </div>
  )
}
