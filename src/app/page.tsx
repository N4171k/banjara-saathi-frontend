'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import LoginModal from '@/components/LoginModal' // adjust path if needed

export default function HomePage () {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlanTrip = () => {
    setIsModalOpen(true)
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-sky-400 via-rose-100 to-blue-200 flex items-center justify-center p-6'>
      <div className='w-full max-w-md'>
        {/* Enhanced Card */}
        <div className='group bg-white/70 backdrop-blur-lg rounded-3xl border border-white/40 shadow-2xl p-8 transition-transform duration-300 ease-out hover:scale-105 hover:shadow-3xl'>
          {/* Icon */}
          <div className='flex justify-center mb-6'>
            <ArrowRight className='w-12 h-12 text-indigo-500 animate-pulse' />
          </div>

          {/* Title */}
          <h2 className='text-3xl font-bold text-center text-gray-800 mb-4'>
            Welcome to Banjara‑Saathi
          </h2>

          {/* Subtitle */}
          <p className='text-center text-gray-600 mb-6'>
            Ready to plan your next adventure? Let us guide you to your perfect
            journey.
          </p>

          {/* Features */}
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

          {/* Plan My Trip Button */}
          <button
            onClick={handlePlanTrip}
            className='flex items-center justify-center w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-medium transition-transform duration-200 shadow-lg hover:brightness-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-200'
          >
            Plan My Trip
            <ArrowRight className='w-5 h-5 ml-2' />
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  )
}
