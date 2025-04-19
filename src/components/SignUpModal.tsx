'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { signupUser } from '@/utils/authHelpers' // Import the signup helper function
import { X } from 'lucide-react'

interface SignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void // Optional prop to switch to login modal
}

export default function SignupModal ({ isOpen, onClose }: SignupModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match!")
      return
    }

    const { success, error: signupError } = await signupUser(email, password)

    if (success) {
      setIsSuccess(true) // Display success icon after successful account creation
    } else {
      setError(signupError)
    }
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
          Create Your Account
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
          <input
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
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

        {/* Error or Success Messages */}
        {error && <p className='text-red-500 text-center'>{error}</p>}
        {isSuccess && (
          <div className='text-center'>
            <CheckCircle className='w-8 h-8 mx-auto text-green-500' />
            <p className='text-green-500'>Account created successfully!</p>
            <p className='text-sm text-gray-600'>
              Please log in with your email and password.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {!isSuccess && (
          <div className='mt-6 space-y-4 sm:space-y-6'>
            <button
              onClick={handleSignup}
              className='
                w-full flex items-center justify-center
                px-6 py-3 sm:py-4
                bg-gradient-to-r from-blue-500 to-indigo-600
                text-white text-base sm:text-lg
                font-medium rounded-lg
                shadow-md
                hover:scale-105 hover:brightness-110
                active:scale-95
                transition-transform duration-200
              '
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Optional Redirect Link */}
        <p className='mt-6 text-center text-sm text-gray-700'>
          Already have an account?{' '}
          <button
            onClick={() => {
              console.log('Redirect to login page')
              onClose() // Close signup modal
              // Open login modal (example below)
              // setIsLoginModalOpen(true);
            }}
            className='text-indigo-600 hover:underline font-medium'
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  )
}
