// this file will be used for testing & Replacement for DataWrapper in future 
import type React from "react"
import { createContext, useContext, useRef, useMemo } from "react"

// Define the context type properly
interface TestWrapperContextType {
  jobIdRef: React.RefObject<string>
}

// Create context with proper typing and default value
const TestWrapperContext = createContext<TestWrapperContextType | undefined>(undefined)

export function useTestWrapper() {
  const context = useContext(TestWrapperContext)
  if (context === undefined) {
    throw new Error("useTestWrapper must be used within a TestWrapperProvider")
  }
  return context
}

interface TestWrapperProps {
  children: React.ReactNode
}

export default function TestWrapper({ children }: TestWrapperProps) {
  // Initialize ref with null, not a string
  const jobIdRef = useRef<string | null>(null)

  const contextValue = useMemo(
    () => ({
      jobIdRef,
    }),
    [],
  )

  return <TestWrapperContext.Provider value={contextValue}>{children}</TestWrapperContext.Provider>
}
