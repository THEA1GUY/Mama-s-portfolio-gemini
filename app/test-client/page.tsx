"use client"

import { useEffect } from "react"

export default function TestClientPage() {
  useEffect(() => {
    console.log("TestClientPage: Client-side code executed!")
  }, [])

  return (
    <div className="flex items-center justify-center h-screen text-white bg-black">
      <h1>Test Client Page</h1>
      <p>Check your browser console for a log message.</p>
    </div>
  )
}
