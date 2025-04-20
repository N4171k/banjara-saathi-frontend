'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { loadItineraryById } from '@/utils/dbHelpers'
import ChatInterface from '@/components/chat'
import axios from 'axios'
import { backendUrl } from '@/env.exports'
import MapComponent from '@/components/MapComponent'

export default function PlanPage () {
  const { id } = useParams()
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [isLoading, setIsLoading] = useState(true)
  const [iterinary, setIterinary] = useState<any>(null)
  const [language, setLanguage] = useState<'English' | 'Hindi'>('English') // Default value set to 'English'
  const [locations, setLocations] = useState<any[]>([])

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const response: any = await loadItineraryById(id)
        if (!response || response.data.userId !== userId) {
          router.push('/')
          return
        }

        setIterinary(response.data.iterinary)
        setLanguage(response.data.language || 'English') // Fallback to 'English' if null or undefined
      } catch (error) {
        console.error('Error fetching itinerary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchPlan()
    }
  }, [id, userId])

  useEffect(() => {
    if (iterinary) {
      fetchLocations(iterinary)
    }
  }, [iterinary])

  async function fetchLocations (message: any) {
    try {
      const response = await axios.post(backendUrl + '/api/locations', {
        message: message
      })
      console.log('Response:', response.data)
      if (response.data && response.data.data) {
        setLocations(response.data?.data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  if (isLoading) {
    return <div className='text-center mt-10'>Loading itinerary...</div>
  }

  return (
    <div className='flex h-screen bg-gradient-to-br from-sky-400 via-rose-100 to-blue-20'>
      {/* Chatbot / Itinerary section */}
      <div className='md:w-[65%] w-screen h-full overflow-y-hidden'>
        <ChatInterface
          iterinaryId={String(id)}
          iterinary={iterinary}
          language={language}
          setIterinary={setIterinary}
          setIsLoading={setIsLoading}
          locations={locations}
          fetchLocations={fetchLocations}
        />
      </div>

      {/* Map Section (Always rendered, dummy map shown if no locations) */}
      <div className='md:w-[35%] h-full overflow-y-hidden'>
        <MapComponent locations={locations} />
      </div>
    </div>
  )
}
