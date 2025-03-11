"use client"

import { useEffect } from "react"
import { useLeagueStore } from "./stores/league-store"

export function InitStore() {
  const initializeStore = useLeagueStore((state) => state.initializeStore)

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  return null
}

