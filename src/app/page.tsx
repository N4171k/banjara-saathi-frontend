'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/store/store'
import { account } from '@/lib/appwrite' // Adjust path as needed
import { setUserId } from '@/store/userSlice'
import { FaSignOutAlt } from 'react-icons/fa'
import LoginModal from '@/components/LoginModal'
import SignUpModal from '@/components/SignUpModal'

export default function HomePage () {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.user.userId)

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const user = await account.get()
        dispatch(setUserId(user.$id))
        console.log('Auto-login successful:', user.$id)
      } catch (err) {
        console.log('No active session found.')
      }
    }

    autoLogin()
  }, [dispatch])

  const handlePlanTrip = () => {
    if (!userId) {
      setIsLoginOpen(true)
    } else {
      console.log('User already logged in:', userId)
      // You can navigate to the dashboard or app page here
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
      await account.deleteSession('current') // This logs the user out
      dispatch(setUserId('')) // Clear the userId in Redux
      console.log('Logged out successfully')
    } catch (err) {
      console.log('Error logging out:', err)
    }
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-sky-400 via-rose-100 to-blue-200 flex items-center justify-center p-6 relative'>
      {/* Logout Button */}
      {userId && (
        <button
          onClick={handleLogout}
          className='absolute top-6 right-6 p-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white font-medium shadow-lg hover:brightness-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-200'
        >
          <FaSignOutAlt className='w-6 h-6' />
        </button>
      )}

      <div className='w-full max-w-md'>
        <div className='group bg-white/70 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl p-8 transition-transform duration-300 ease-out hover:scale-105 hover:shadow-3xl'>
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
            className='flex items-center justify-center w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium transition-transform duration-200 shadow-lg hover:brightness-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-200'
          >
            Plan My Trip
            <ArrowRight className='w-5 h-5 ml-2' />
          </button>
        </div>
      </div>

      {/* Modals only render when user is not logged in */}
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
