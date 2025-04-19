// components/Loader.tsx
import { Loader2 } from 'lucide-react'

export default function Loader () {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-xl shadow-xl flex items-center gap-4'>
        <Loader2 className='animate-spin h-6 w-6 text-indigo-600' />
      </div>
    </div>
  )
}
