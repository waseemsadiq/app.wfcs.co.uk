"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { League } from "@/lib/types"

interface AdminLeagueListProps {
  onLeagueSelect: (league: League) => void
}

export function AdminLeagueList({ onLeagueSelect }: AdminLeagueListProps) {
  const { leagues, removeLeague } = useLeagueStore()

  const handleDeleteLeague = (e: React.MouseEvent, leagueId: string) => {
    e.stopPropagation()

    if (
      confirm(
        "Are you sure you want to delete this league? This will delete all seasons, fixtures, and data associated with this league.",
      )
    ) {
      removeLeague(leagueId)
    }
  }

  if (leagues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Leagues Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no leagues set up yet. Use the "Create New League" tab to create your first league.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {leagues.map((league) => (
        <Card
          key={league.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onLeagueSelect(league)}
        >
          <CardHeader>
            <CardTitle>{league.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {league.seasons.length} {league.seasons.length === 1 ? "season" : "seasons"} •
              {league.seasons.length > 0
                ? ` ${league.seasons.reduce((total, season) => total + season.teams.length, 0)} teams total`
                : " No teams yet"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onLeagueSelect(league)}>
              Manage
            </Button>
            <Button variant="destructive" size="sm" onClick={(e) => handleDeleteLeague(e, league.id)}>
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

