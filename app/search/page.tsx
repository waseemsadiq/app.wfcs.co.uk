"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLeagueData } from "@/lib/hooks/use-league-data"
import { SearchInput } from "@/components/search-input"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const { standings, fixtures } = useLeagueData()
  const [results, setResults] = useState({
    teams: [],
    fixtures: [],
  })

  useEffect(() => {
    if (!query) return

    const lowerQuery = query.toLowerCase()

    // Search teams
    const matchingTeams = standings.filter((team) => team.Team.toLowerCase().includes(lowerQuery))

    // Search fixtures
    const matchingFixtures = fixtures.filter(
      (fixture) =>
        fixture.homeTeam.toLowerCase().includes(lowerQuery) || fixture.awayTeam.toLowerCase().includes(lowerQuery),
    )

    setResults({
      teams: matchingTeams,
      fixtures: matchingFixtures,
    })
  }, [query, standings, fixtures])

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          <p className="text-muted-foreground">Results for: {query}</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchInput />
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6">
        {results.teams.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {results.teams.map((team) => (
                  <div key={team.Team} className="p-4 border rounded-md">
                    <div className="font-bold text-lg">{team.Team}</div>
                    <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Played:</span> {team.P}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Won:</span> {team.W}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Points:</span> {team.PTS}
                      </div>
                      <div>
                        <span className="text-muted-foreground">GD:</span> {team.GD}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {results.fixtures.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Fixtures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {results.fixtures.map((fixture) => (
                  <div key={fixture.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="font-bold">
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {fixture.date} at {fixture.time}
                      </div>
                    </div>
                    {fixture.played && (
                      <div className="mt-2 text-center font-bold">
                        {fixture.homeScore} - {fixture.awayScore}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {results.teams.length === 0 && results.fixtures.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">Try searching for a different team or player name</p>
          </div>
        )}
      </div>
    </div>
  )
}

