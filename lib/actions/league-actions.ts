"use server"
import type { League, Season } from "@/lib/types"
import { useLeagueStore } from "@/lib/stores/league-store"

export async function getLeague(leagueId: string): Promise<League | null> {
  try {
    // Initialize the store
    const { initializeStore, getLeague } = useLeagueStore.getState()
    initializeStore()

    // Get the league from the store
    const league = getLeague(leagueId)

    if (!league) {
      console.log(`League with id ${leagueId} not found`)
      return null
    }

    return league
  } catch (error) {
    console.error("Error fetching league:", error)
    return null
  }
}

export async function getSeason(leagueId: string, seasonId: string): Promise<Season | null> {
  try {
    const league = await getLeague(leagueId)
    if (!league) {
      console.log(`League with id ${leagueId} not found`)
      return null
    }

    const season = league.seasons.find((s) => s.id === seasonId)

    if (!season) {
      console.log(`Season with id ${seasonId} not found in league ${leagueId}`)
    }

    return season || null
  } catch (error) {
    console.error("Error fetching season:", error)
    return null
  }
}

