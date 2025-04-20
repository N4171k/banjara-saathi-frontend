// pages/plan/[id]/download.tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { loadItineraryById } from '@/utils/dbHelpers'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useState } from 'react'
import MarkDownRenderer from '@/components/MarkdownRenderer'

function DownloadPage () {
  const { id } = useParams()
  const router = useRouter()
  const userId = useSelector((state: RootState) => state.user.userId)
  const [iterinary, setIterinary] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='bg-gray-100 w-full'>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className='flex justify-end mb-4'>
            <button
              onClick={handlePrint}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Print to PDF
            </button>
          </div>
          <div id='printable-content' className='bg-white p-6 w-full'>
            <MarkDownRenderer message={iterinary} />
            <p className='italic text-right'>- Aapka Apna Banjara Saathi</p>
          </div>
        </>
      )}
    </div>
  )
}

export default DownloadPage
