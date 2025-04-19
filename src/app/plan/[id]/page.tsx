'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { loadItineraryById } from '@/utils/dbHelpers'
import MarkDownRenderer from '@/components/MarkdownRenderer'

export default function PlanPage () {
  const { id } = useParams()
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [isLoading, setIsLoading] = useState(true)
  const [iterinary, setIterinary] = useState<any>(null)
  const [messages, setMessages] = useState<any>(null)
  const [language, setLanguage] = useState(null)

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || typeof id !== 'string') return

      try {
        const response: any = await loadItineraryById(id)
        if (!response) {
          router.push('/') // or show error
          return
        }

        setIterinary(response.data.iterinary)
        setLanguage(response.data.language)
      } catch (error) {
        console.error('Error fetching itinerary:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlan()
  }, [id, userId])

  if (isLoading) {
    return <div className='text-center mt-10'>Loading itinerary...</div>
  }

  return (
    <div>
      <MarkDownRenderer message={iterinary} />
    </div>
  )
}
