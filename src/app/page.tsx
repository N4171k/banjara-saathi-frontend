'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle, MapPin } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { account } from '@/lib/appwrite'
import { setUserId } from '@/store/userSlice'
import { FaSignOutAlt } from 'react-icons/fa'
import LoginModal from '@/components/LoginModal'
import SignUpModal from '@/components/SignUpModal'
import { fetchUserTrips } from '@/utils/dbHelpers'
import { Models } from 'appwrite'

export default function HomePage () {
  const router = useRouter()
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.user.userId)

  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [userTrips, setUserTrips] = useState<Models.Document[]>([])

  const handlePlanTrip = () => {
    if (!userId) {
      setIsLoginOpen(true)
    } else {
      router.push('/plan')
    }
  }

  const switchToSignUp = () => {
    setIsLoginOpen(false)
    setIsSignUpOpen(true)
  }

  const switchToLogin = () => {
    setIsSignUpOpen(false)
    setIsLoginOpen(true)
  }

  const handleLogout = async () => {
    try {
      await account.deleteSession('current')
      dispatch(setUserId(''))
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const loadTrips = async () => {
      if (!userId) return
      try {
        const trips = await fetchUserTrips(userId)
        setUserTrips(trips)
      } catch (error) {
        console.error('Error loading user trips:', error)
      }
    }

    loadTrips()
  }, [userId])

  return (
    <main className='relative min-h-screen bg-gradient-to-br from-sky-400 via-rose-100 to-blue-200 flex flex-col items-center justify-start p-6'>
      {/* Logout */}
      {userId && (
        <button
          onClick={handleLogout}
          className='absolute top-6 right-6 p-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:brightness-110 active:scale-95'
        >
          <FaSignOutAlt className='w-6 h-6' />
        </button>
      )}

      {/* Hero Card */}
      <div className='w-full max-w-md mt-10 mb-8'>
        <div className='group bg-white/70 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl p-8 hover:scale-105 transition-all duration-300'>
          <div className='flex justify-center mb-6'>
            <ArrowRight className='w-12 h-12 text-indigo-500 animate-pulse' />
          </div>
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-4'>
            Welcome to Banjara‑Saathi
          </h2>
          <p className='text-center text-gray-600 mb-6'>
            Ready to plan your next adventure? Let us guide you to your perfect
            journey.
          </p>
          <ul className='mb-6 space-y-3'>
            {[
              'Personalized itineraries',
              'AI-driven recommendations',
              'Real-time travel updates'
            ].map(feature => (
              <li key={feature} className='flex items-center text-gray-700'>
                <CheckCircle className='w-5 h-5 text-green-500 mr-2' />
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handlePlanTrip}
            className='flex items-center justify-center w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium shadow-lg hover:brightness-110 active:scale-95'
          >
            Plan My Trip
            <ArrowRight className='w-5 h-5 ml-2' />
          </button>
        </div>
      </div>

      {/* Trip Cards */}
      {userId && userTrips.length > 0 && (
        <div className='w-full max-w-6xl'>
          <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
            Your Trips
          </h3>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {userTrips.map(trip => (
              <div
                key={trip.$id}
                className='flex flex-col justify-between p-5 bg-white shadow-xl rounded-2xl border hover:shadow-2xl hover:scale-[1.02] transition-transform cursor-pointer'
              >
                <h4 className='text-lg font-semibold text-blue-700 mb-1'>
                  {trip.departureCity} ➜ {trip.destinationCity}
                </h4>
                <p className='text-sm text-gray-600 mb-2'>
                  {trip.date
                    ? new Date(trip.date).toLocaleDateString()
                    : 'Date not set'}
                </p>
                <div className='flex items-center text-sm text-gray-500 mb-4'>
                  <MapPin className='w-4 h-4 mr-1' />
                  {trip.departureCity || 'Unknown'}
                </div>
                <button
                  onClick={() => router.push(`/plan/${trip.$id}`)}
                  className='mt-auto px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition'
                >
                  Load Trip
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      {!userId && (
        <>
          <LoginModal
            isOpen={isLoginOpen}
            onClose={() => setIsLoginOpen(false)}
            onSwitchToSignup={switchToSignUp}
          />
          <SignUpModal
            isOpen={isSignUpOpen}
            onClose={() => setIsSignUpOpen(false)}
            onSwitchToLogin={switchToLogin}
          />
        </>
      )}
    </main>
  )
}
