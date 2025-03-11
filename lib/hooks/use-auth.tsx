"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"

type AuthContextType = {
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// For demo purposes, hardcoded credentials
const DEMO_USERNAME = "admin"
const DEMO_PASSWORD = "password"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useLocalStorage<string | null>("auth-token", null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if token exists and is valid
    setLoading(false)
  }, [])

  const login = async (username: string, password: string) => {
    // In a real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
          setToken("demo-token")
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

