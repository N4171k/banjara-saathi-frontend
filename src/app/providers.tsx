'use client'

import { Provider, useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@/store/store'
import { ReactNode, useEffect } from 'react'
import { account } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'
import { setUserId } from '@/store/userSlice'

export function Providers ({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInit>{children}</AuthInit>
    </Provider>
  )
}

// Runs once on initial render; checks for an existing Appwrite session
function AuthInit ({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.user.userId)
  const router = useRouter()
  useEffect(() => {
    const checkSession = async () => {
      if (!userId) {
        try {
          const user = await account.get() // Throws if no session
          dispatch(setUserId(user.$id)) // Save to Redux
          console.log('Auto-login:', user.$id)
        } catch {
          router.push('/')
          // no session, do nothing
        }
      }
    }
    checkSession()
  }, [dispatch, userId])

  return <>{children}</>
}
