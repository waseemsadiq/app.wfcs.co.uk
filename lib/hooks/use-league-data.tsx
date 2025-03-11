"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { TeamStanding, Fixture, LeagueSettings } from "@/lib/types"

type LeagueDataContextType = {
  standings: TeamStanding[]
  fixtures: Fixture[]
  teams: string[]
  settings: LeagueSettings
  updateStandings: (standings: TeamStanding[]) => void
  updateFixtures: (fixtures: Fixture[]) => void
  updateSettings: (settings: LeagueSettings) => void
}

const LeagueDataContext = createContext<LeagueDataContextType | undefined>(undefined)

export function LeagueDataProvider({ children }: { children: ReactNode }) {
  const leagueStore = useLeagueStore()
  const [currentLeagueId, setCurrentLeagueId] = useState<string | null>(null)
  const [currentSeasonId, setCurrentSeasonId] = useState<string | null>(null)

  useEffect(() => {
    // Initialize with the first league and season if available
    if (leagueStore.leagues.length > 0) {
      const firstLeague = leagueStore.leagues[0]
      setCurrentLeagueId(firstLeague.id)
      if (firstLeague.seasons.length > 0) {
        setCurrentSeasonId(firstLeague.seasons[0].id)
      }
    }
  }, [leagueStore.leagues])

  const standings = currentLeagueId && currentSeasonId ? leagueStore.getStandings(currentLeagueId, currentSeasonId) : []

  const fixtures = currentLeagueId && currentSeasonId ? leagueStore.getFixtures(currentLeagueId, currentSeasonId) : []

  const teams =
    currentLeagueId && currentSeasonId
      ? leagueStore.getTeamsForSeason(currentLeagueId, currentSeasonId).map((team) => team.name)
      : []

  const settings = leagueStore.getSettings()

  const updateStandings = (newStandings: TeamStanding[]) => {
    if (currentLeagueId && currentSeasonId) {
      leagueStore.updateSeason(currentLeagueId, currentSeasonId, { standings: newStandings })
    }
  }

  const updateFixtures = (newFixtures: Fixture[]) => {
    if (currentLeagueId && currentSeasonId) {
      leagueStore.updateFixtures(currentLeagueId, currentSeasonId, newFixtures)
    }
  }

  const updateSettings = (newSettings: LeagueSettings) => {
    leagueStore.updateSettings(newSettings)
  }

  return (
    <LeagueDataContext.Provider
      value={{
        standings,
        fixtures,
        teams,
        settings,
        updateStandings,
        updateFixtures,
        updateSettings,
      }}
    >
      {children}
    </LeagueDataContext.Provider>
  )
}

export function useLeagueData() {
  const context = useContext(LeagueDataContext)
  if (context === undefined) {
    throw new Error("useLeagueData must be used within a LeagueDataProvider")
  }
  return context
}

