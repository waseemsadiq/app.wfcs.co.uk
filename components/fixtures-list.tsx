"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { format, parseISO, compareAsc } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLeagueStore } from "@/lib/stores/league-store"
import { FixtureEditor } from "@/components/fixture-editor"
import { TeamEditor } from "@/components/team-editor"
import type { Fixture } from "@/lib/types"

export function FixturesList({ leagueId, seasonId }: { leagueId: string; seasonId: string }) {
  const { getFixtures } = useLeagueStore()
  const fixtures = getFixtures(leagueId, seasonId)
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all")
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)

  const sortedFixtures = useMemo(() => {
    return [...fixtures].sort((a, b) => {
      const dateA = parseISO(`${a.date}T${a.time}`)
      const dateB = parseISO(`${b.date}T${b.time}`)
      return compareAsc(dateA, dateB)
    })
  }, [fixtures])

  const upcomingFixtures = useMemo(() => sortedFixtures.filter((fixture) => !fixture.played), [sortedFixtures])

  const completedFixtures = useMemo(() => sortedFixtures.filter((fixture) => fixture.played), [sortedFixtures])

  const displayFixtures = useMemo(() => {
    switch (filter) {
      case "upcoming":
        return upcomingFixtures
      case "completed":
        return completedFixtures
      default:
        return sortedFixtures
    }
  }, [filter, sortedFixtures, upcomingFixtures, completedFixtures])

  const handleFixtureClick = (fixture: Fixture) => {
    setSelectedFixture(fixture)
  }

  const handleTeamClick = (e: React.MouseEvent, teamName: string) => {
    e.stopPropagation() // Prevent the fixture click event from firing
    setSelectedTeam(teamName)
  }

  const handleCloseEditor = () => {
    setSelectedFixture(null)
    setSelectedTeam(null)
  }

  return (
    <div>
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setFilter("all")}>
            All
          </TabsTrigger>
          <TabsTrigger value="upcoming" onClick={() => setFilter("upcoming")}>
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="completed" onClick={() => setFilter("completed")}>
            Completed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4">
        {displayFixtures.length === 0 ? (
          <div className="text-center py-8">
            <p>No fixtures to display.</p>
          </div>
        ) : (
          displayFixtures.map((fixture) => (
            <Card
              key={fixture.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleFixtureClick(fixture)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col">
                  <div className="bg-muted px-4 py-2 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {format(parseISO(fixture.date), "EEEE, MMMM d, yyyy")} • {fixture.time}
                    </div>
                    <Badge variant={fixture.played ? "secondary" : "outline"}>
                      {fixture.played ? "Completed" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="p-4 grid grid-cols-3 items-center">
                    <div className="text-right">
                      <div
                        className="font-semibold hover:underline"
                        onClick={(e) => handleTeamClick(e, fixture.homeTeam)}
                      >
                        {fixture.homeTeam}
                      </div>
                      {fixture.played && <div className="text-2xl font-bold">{fixture.homeScore}</div>}
                    </div>
                    <div className="text-center text-muted-foreground">vs</div>
                    <div className="text-left">
                      <div
                        className="font-semibold hover:underline"
                        onClick={(e) => handleTeamClick(e, fixture.awayTeam)}
                      >
                        {fixture.awayTeam}
                      </div>
                      {fixture.played && <div className="text-2xl font-bold">{fixture.awayScore}</div>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedFixture && (
        <FixtureEditor fixture={selectedFixture} leagueId={leagueId} seasonId={seasonId} onClose={handleCloseEditor} />
      )}

      {selectedTeam && (
        <TeamEditor leagueId={leagueId} seasonId={seasonId} teamName={selectedTeam} onClose={handleCloseEditor} />
      )}
    </div>
  )
}

