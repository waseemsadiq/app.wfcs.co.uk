"use client"

import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { Fixture } from "@/lib/types"
import { format, addDays, setMonth, setYear, isBefore, endOfMonth, startOfMonth } from "date-fns"

type FixtureRuleset = "round-robin" | "double-round-robin" | "single-elimination" | "double-elimination"

interface AdminFixtureGeneratorProps {
  leagueId: string
  seasonId: string
  teams: string[]
  startMonth: number
  endMonth: number
  defaultMatchDays: string[]
  defaultMatchTimes: string[]
  onComplete: () => void
}

export function AdminFixtureGenerator({
  leagueId,
  seasonId,
  teams,
  startMonth,
  endMonth,
  defaultMatchDays,
  defaultMatchTimes,
  onComplete,
}: AdminFixtureGeneratorProps) {
  const [ruleset, setRuleset] = useState<FixtureRuleset>("round-robin")
  const [isGenerating, setIsGenerating] = useState(false)
  const updateFixtures = useLeagueStore((state) => state.updateFixtures)
  const { toast } = useToast()

  const validMatchDays = useMemo(() => {
    const getValidMatchDays = (start: Date, end: Date, validDays: string[]): Date[] => {
      const validMatchDays: Date[] = []
      let currentDate = new Date(start)

      while (isBefore(currentDate, end) || format(currentDate, "yyyy-MM-dd") === format(end, "yyyy-MM-dd")) {
        if (validDays.includes(format(currentDate, "EEEE"))) {
          validMatchDays.push(new Date(currentDate))
        }
        currentDate = addDays(currentDate, 1)
      }

      return validMatchDays
    }

    let currentDate = new Date()
    currentDate = startOfMonth(setMonth(setYear(currentDate, currentDate.getFullYear()), startMonth))
    let endDate = endOfMonth(setMonth(setYear(new Date(), currentDate.getFullYear()), endMonth))
    if (endMonth < startMonth) {
      endDate = setYear(endDate, endDate.getFullYear() + 1)
    }

    return getValidMatchDays(currentDate, endDate, defaultMatchDays)
  }, [startMonth, endMonth, defaultMatchDays])

  const generateRoundRobin = useCallback(
    (teamList: string[], isDouble: boolean): Fixture[] => {
      const fixtures: Fixture[] = []
      const teamsCopy = [...teamList]

      if (teamsCopy.length % 2 !== 0) {
        teamsCopy.push("BYE")
      }

      const n = teamsCopy.length
      const rounds = n - 1
      const matchesPerRound = n / 2

      let dayIndex = 0
      let timeIndex = 0

      for (let round = 0; round < rounds; round++) {
        for (let match = 0; match < matchesPerRound; match++) {
          const home = teamsCopy[match]
          const away = teamsCopy[n - 1 - match]

          if (home !== "BYE" && away !== "BYE") {
            const fixtureDate = validMatchDays[dayIndex]

            fixtures.push({
              id: `${round}-${match}`,
              homeTeam: home,
              awayTeam: away,
              date: format(fixtureDate, "yyyy-MM-dd"),
              time: defaultMatchTimes[timeIndex],
              played: false,
              homeScore: 0,
              awayScore: 0,
            })

            timeIndex = (timeIndex + 1) % defaultMatchTimes.length
            if (timeIndex === 0) {
              dayIndex = (dayIndex + 1) % validMatchDays.length
            }
          }
        }

        teamsCopy.splice(1, 0, teamsCopy.pop()!)
      }

      if (isDouble) {
        const singleRoundFixtures = [...fixtures]

        for (const fixture of singleRoundFixtures) {
          const fixtureDate = validMatchDays[dayIndex]

          fixtures.push({
            id: `return-${fixture.id}`,
            homeTeam: fixture.awayTeam,
            awayTeam: fixture.homeTeam,
            date: format(fixtureDate, "yyyy-MM-dd"),
            time: defaultMatchTimes[timeIndex],
            played: false,
            homeScore: 0,
            awayScore: 0,
          })

          timeIndex = (timeIndex + 1) % defaultMatchTimes.length
          if (timeIndex === 0) {
            dayIndex = (dayIndex + 1) % validMatchDays.length
          }
        }
      }

      return fixtures
    },
    [validMatchDays, defaultMatchTimes],
  )

  const handleGenerate = useCallback(() => {
    if (teams.length < 2) {
      toast({
        title: "Not enough teams",
        description: "You need at least 2 teams to generate fixtures.",
        variant: "destructive",
      })
      return
    }

    if (!seasonId) {
      toast({
        title: "Invalid season",
        description: "Unable to generate fixtures for an invalid season.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      let generatedFixtures: Fixture[] = []

      if (ruleset === "round-robin") {
        generatedFixtures = generateRoundRobin(teams, false)
      } else if (ruleset === "double-round-robin") {
        generatedFixtures = generateRoundRobin(teams, true)
      } else {
        throw new Error(`${ruleset} fixture generation is not yet implemented.`)
      }

      updateFixtures(leagueId, seasonId, generatedFixtures)

      toast({
        title: "Fixtures generated",
        description: `Generated ${generatedFixtures.length} fixtures using ${ruleset} format.`,
      })

      onComplete()
    } catch (error) {
      console.error("Fixture generation error:", error)
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "There was an error generating the fixtures.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }, [teams, seasonId, leagueId, ruleset, generateRoundRobin, updateFixtures, onComplete, toast])

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ruleset">Fixture Generation Ruleset</Label>
              <Select value={ruleset} onValueChange={(value) => setRuleset(value as FixtureRuleset)}>
                <SelectTrigger id="ruleset">
                  <SelectValue placeholder="Select ruleset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round-robin">Round Robin (Single)</SelectItem>
                  <SelectItem value="double-round-robin">Round Robin (Double)</SelectItem>
                  <SelectItem value="single-elimination">Single Elimination Tournament</SelectItem>
                  <SelectItem value="double-elimination">Double Elimination Tournament</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                {ruleset === "round-robin" && "Each team plays against every other team once."}
                {ruleset === "double-round-robin" && "Each team plays against every other team twice (home and away)."}
                {ruleset === "single-elimination" && "Teams are eliminated after a single loss."}
                {ruleset === "double-elimination" && "Teams are eliminated after two losses."}
              </p>

              <div className="bg-muted p-4 rounded-md">
                <h4 className="font-medium mb-2">Teams in this season:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {teams.map((team, index) => (
                    <li key={index}>{team}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onComplete}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Fixtures"}
        </Button>
      </div>
    </div>
  )
}

