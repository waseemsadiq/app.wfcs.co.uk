"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useLeagueStore } from "@/lib/stores/league-store"

export function SeasonSelector({ leagueId }: { leagueId: string }) {
  const { leagues } = useLeagueStore()
  const router = useRouter()
  const pathname = usePathname()

  const league = leagues.find((l) => l.id === leagueId)
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>("")

  useEffect(() => {
    if (league && league.seasons.length > 0) {
      // Default to the latest season
      setSelectedSeasonId(league.seasons[league.seasons.length - 1].id)
    }
  }, [league])

  if (!league || league.seasons.length === 0) {
    return null
  }

  const handleSeasonChange = (seasonId: string) => {
    setSelectedSeasonId(seasonId)
    router.push(`/leagues/${leagueId}/seasons/${seasonId}`)
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center">
          <span className="mr-4 text-sm font-medium">Select Season:</span>
          <Select value={selectedSeasonId} onValueChange={handleSeasonChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a season" />
            </SelectTrigger>
            <SelectContent>
              {league.seasons.map((season) => (
                <SelectItem key={season.id} value={season.id}>
                  {season.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

