import { account } from '@/lib/appwrite'

// Helper function to create an account
export const signupUser = async (email: string, password: string) => {
  try {
    // Create the account using the Appwrite account service
    const response = await account.create('unique()', email, password);
    console.log('Account created:', response);
    return { success: true }
  } catch (err : any) {
    return { success: false, error: err.message || 'Something went wrong' }
  }
}

// Helper function to log in a user
export const loginUser = async (email: string, password: string) => {
  try {
    // Create the session (log the user in)
    const response = await account.createEmailPasswordSession(email, password);
    console.log('Logged in:', response);
    return { success: true, session: response };
  } catch (err : any) {
    console.error('Login error:', err);
    return { success: false, error: err.message || 'Invalid credentials' }

  }
}
