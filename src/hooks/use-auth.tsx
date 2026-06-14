import React, { createContext, useContext } from 'react'

const defaultContext = {
  user: { id: 'public-user' },
  isAuthenticated: true,
  loading: false,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: () => {},
}

const AuthContext = createContext(defaultContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <AuthContext.Provider value={defaultContext}>{children}</AuthContext.Provider>
}
