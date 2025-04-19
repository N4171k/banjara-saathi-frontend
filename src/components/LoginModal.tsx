'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { FaGoogle } from 'react-icons/fa'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal ({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center  px-4'>
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
        {/* Close “X” */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-black hover:text-gray-200'
        >
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

        {/* Action Buttons */}
        <div className='mt-6 space-y-4 sm:space-y-6'>
          {/* Email Login */}
          <button
            onClick={() => {
              console.log('Logging in with:', email, password)
              onClose()
            }}
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
            Login
          </button>

          {/* Google Login */}
          <button
            onClick={() => {
              console.log('Google login initiated')
              onClose()
            }}
            className='
              w-full flex items-center justify-center
              px-6 py-3 sm:py-4
              bg-white/80 text-gray-900 text-base sm:text-lg
              font-medium rounded-lg
              shadow-md
              hover:bg-white/90
              transition
            '
          >
            <FaGoogle className='w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500' />
            Continue with Google
          </button>

          {/* Guest Access */}
          <button
            onClick={() => {
              console.log('Continuing without login')
              onClose()
            }}
            className='
              w-full
              px-6 py-3 sm:py-4
              bg-gray-200 text-gray-800 text-base sm:text-lg
              font-medium rounded-lg
              shadow-sm
              hover:bg-gray-300
              transition
            '
          >
            Continue Without Login
          </button>
        </div>
      </div>
    </div>
  )
}
