export function useAuth() {
  const signUp = async (data: { email: string; password: string; name?: string }) => {
    console.log('Stub signUp called with', data)
    return { user: { user_id: '123', name: data.name || 'Test User', email: data.email } }
  }

  const signIn = async (data: { email: string; password: string }) => {
    console.log('Stub signIn called with', data)
    return { user: { user_id: '456', name: 'Existing User', email: data.email } }
  }

  const signOut = () => {
    console.log('Stub signOut called')
  }

  return {
    signUp,
    signIn,
    signOut,
    isLoading: false,
    error: null,
    clearError: () => {},
    user: null,
  }
}
