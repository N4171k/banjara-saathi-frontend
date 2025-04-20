'use client'

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { X } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'
import { loginUser } from '@/utils/authHelpers'
import { setUserId } from '@/store/userSlice'
import { loginWithGoogle } from '@/utils/authHelpers'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToSignup: () => void
}

export default function LoginModal ({
  isOpen,
  onClose,
  onSwitchToSignup
}: LoginModalProps) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const {
        success,
        session,
        error: loginError
      } = await loginUser(email, password)

      if (success && session) {
        dispatch(setUserId(session.userId))
        onClose()
        console.log('Login successful. User ID:', session.userId)
      } else {
        setError(loginError || 'Something went wrong during login')
      }
    } catch (err) {
      console.error('Unexpected login error:', err)
      setError('An unexpected error occurred. Please try again.')
    }

    setIsLoading(false)
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
      <div
        className='
          relative
          w-full
          max-w-full
          sm:max-w-md
          md:max-w-lg
          lg:max-w-xl
          xl:max-w-2xl
          mx-auto
          bg-white/20 backdrop-blur-xl border border-white/30
          rounded-3xl shadow-2xl
          p-6 sm:p-8 lg:p-12
          overflow-y-auto max-h-[90vh]
          transition-transform duration-300 ease-out
          scale-100
        '
      >
        {/* Close Button */}
        <button onClick={onClose} className='absolute top-4 right-4 text-black'>
          <X className='w-6 h-6 sm:w-8 sm:h-8' />
        </button>

        {/* Heading */}
        <h2 className='text-center text-2xl sm:text-3xl lg:text-4xl font-semibold text-black mb-6'>
          Welcome Back
        </h2>

        {/* Inputs */}
        <div className='space-y-4'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='
              w-full
              px-4 sm:px-6
              py-3 sm:py-4
              bg-white/60 backdrop-blur-sm
              border border-white/40
              rounded-lg
              placeholder-gray-600 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-300
              transition
            '
          />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='
              w-full
              px-4 sm:px-6
              py-3 sm:py-4
              bg-white/60 backdrop-blur-sm
              border border-white/40
              rounded-lg
              placeholder-gray-600 text-gray-900
              focus:outline-none focus:ring-2 focus:ring-indigo-300
              transition
            '
          />
        </div>

        {/* Error */}
        {error && (
          <p className='text-center text-sm text-red-600 mt-4'>{error}</p>
        )}

        {/* Action Buttons */}
        <div className='mt-6 space-y-4 sm:space-y-6'>
          {/* Email Login */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`
              w-full flex items-center justify-center
              px-6 py-3 sm:py-4
              ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600'
              }
              text-white text-base sm:text-lg
              font-medium rounded-lg
              shadow-md
              hover:scale-105 hover:brightness-110
              active:scale-95
              transition-transform duration-200
            `}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {/* Sign Up Link */}
        <p className='mt-6 text-center text-sm text-gray-700'>
          Don’t have an account?{' '}
          <button
            onClick={onSwitchToSignup}
            className='text-indigo-600 hover:underline font-medium'
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}
