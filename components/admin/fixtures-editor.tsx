"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { Fixture, Goal, Penalty } from "@/lib/types"

interface AdminFixturesEditorProps {
  leagueId: string
  seasonId: string
}

export function AdminFixturesEditor({ leagueId, seasonId }: AdminFixturesEditorProps) {
  const { getFixtures, getTeamsForSeason, updateFixtures, calculateStandings } = useLeagueStore()
  const fixtures = getFixtures(leagueId, seasonId)
  const teams = getTeamsForSeason(leagueId, seasonId)
  const [editedFixtures, setEditedFixtures] = useState<Fixture[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setEditedFixtures(fixtures)
  }, [fixtures])

  const handleInputChange = (index: number, field: keyof Fixture, value: any) => {
    const newFixtures = [...editedFixtures]

    if (field === "played") {
      newFixtures[index][field] = value
    } else if (field === "homeScore" || field === "awayScore") {
      newFixtures[index][field] = Number.parseInt(value) || 0
    } else {
      newFixtures[index][field] = value
    }

    setEditedFixtures(newFixtures)
  }

  const handleMatchDetailsChange = (fixtureIndex: number, details: MatchDetails) => {
    const newFixtures = [...editedFixtures]
    newFixtures[fixtureIndex].matchDetails = details
    setEditedFixtures(newFixtures)
  }

  const handleSave = () => {
    updateFixtures(leagueId, seasonId, editedFixtures)

    // Recalculate standings based on fixture results
    calculateStandings(leagueId, seasonId)

    toast({
      title: "Fixtures updated",
      description: "The fixtures have been successfully updated and standings recalculated.",
    })
  }

  const addNewFixture = () => {
    const today = new Date()
    const newFixture: Fixture = {
      id: Date.now().toString(),
      homeTeam: teams[0]?.name || "",
      awayTeam: teams[1]?.name || "",
      date: format(today, "yyyy-MM-dd"),
      time: "15:00",
      played: false,
      homeScore: 0,
      awayScore: 0,
      matchDetails: {
        homeGoals: [],
        awayGoals: [],
        penalties: [],
      },
    }

    setEditedFixtures([...editedFixtures, newFixture])
  }

  const removeFixture = (index: number) => {
    const newFixtures = [...editedFixtures]
    newFixtures.splice(index, 1)
    setEditedFixtures(newFixtures)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {editedFixtures.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Fixtures Available</h3>
                <p className="text-muted-foreground mb-4">
                  This season doesn't have any fixtures yet. Add fixtures manually or use the fixture generator.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          editedFixtures.map((fixture, index) => (
            <Card key={fixture.id}>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`home-team-${index}`}>Home Team</Label>
                        <Select
                          value={fixture.homeTeam}
                          onValueChange={(value) => handleInputChange(index, "homeTeam", value)}
                        >
                          <SelectTrigger id={`home-team-${index}`}>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.name} value={team.name}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`away-team-${index}`}>Away Team</Label>
                        <Select
                          value={fixture.awayTeam}
                          onValueChange={(value) => handleInputChange(index, "awayTeam", value)}
                        >
                          <SelectTrigger id={`away-team-${index}`}>
                            <SelectValue placeholder="Select team" />
                          </SelectTrigger>
                          <SelectContent>
                            {teams.map((team) => (
                              <SelectItem key={team.name} value={team.name}>
                                {team.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`date-${index}`}>Date</Label>
                        <Input
                          id={`date-${index}`}
                          type="date"
                          value={fixture.date}
                          onChange={(e) => handleInputChange(index, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`time-${index}`}>Time</Label>
                        <Input
                          id={`time-${index}`}
                          type="time"
                          value={fixture.time}
                          onChange={(e) => handleInputChange(index, "time", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`played-${index}`}
                        checked={fixture.played}
                        onCheckedChange={(checked) => handleInputChange(index, "played", checked)}
                      />
                      <Label htmlFor={`played-${index}`}>Match Played</Label>
                    </div>

                    {fixture.played && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor={`home-score-${index}`}>Home Score</Label>
                          <Input
                            id={`home-score-${index}`}
                            type="number"
                            value={fixture.homeScore}
                            onChange={(e) => handleInputChange(index, "homeScore", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`away-score-${index}`}>Away Score</Label>
                          <Input
                            id={`away-score-${index}`}
                            type="number"
                            value={fixture.awayScore}
                            onChange={(e) => handleInputChange(index, "awayScore", e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {fixture.played && (
                  <MatchDetailsEditor
                    fixture={fixture}
                    teams={teams}
                    onChange={(details) => handleMatchDetailsChange(index, details)}
                  />
                )}

                <div className="flex justify-end mt-4">
                  <Button variant="destructive" size="sm" onClick={() => removeFixture(index)}>
                    Remove Fixture
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-between">
        <Button onClick={addNewFixture}>Add Fixture</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

interface MatchDetailsEditorProps {
  fixture: Fixture
  teams: { name: string }[]
  onChange: (details: MatchDetails) => void
}

function MatchDetailsEditor({ fixture, teams, onChange }: MatchDetailsEditorProps) {
  const [homeGoals, setHomeGoals] = useState<Goal[]>(fixture.matchDetails?.homeGoals || [])
  const [awayGoals, setAwayGoals] = useState<Goal[]>(fixture.matchDetails?.awayGoals || [])
  const [penalties, setPenalties] = useState<Penalty[]>(fixture.matchDetails?.penalties || [])

  useEffect(() => {
    onChange({ homeGoals, awayGoals, penalties })
  }, [homeGoals, awayGoals, penalties, onChange])

  const addGoal = (team: "home" | "away") => {
    const newGoal: Goal = {
      player: { id: Date.now().toString(), name: "", team: team === "home" ? fixture.homeTeam : fixture.awayTeam },
      isOwnGoal: false,
    }
    if (team === "home") {
      setHomeGoals([...homeGoals, newGoal])
    } else {
      setAwayGoals([...awayGoals, newGoal])
    }
  }

  const addPenalty = () => {
    const newPenalty: Penalty = {
      player: { id: Date.now().toString(), name: "", team: "" },
      type: "sinBin",
    }
    setPenalties([...penalties, newPenalty])
  }

  const updateGoal = (index: number, team: "home" | "away", field: keyof Goal, value: any) => {
    const goals = team === "home" ? [...homeGoals] : [...awayGoals]
    goals[index] = { ...goals[index], [field]: value }
    if (team === "home") {
      setHomeGoals(goals)
    } else {
      setAwayGoals(goals)
    }
  }

  const updatePenalty = (index: number, field: keyof Penalty, value: any) => {
    const newPenalties = [...penalties]
    newPenalties[index] = { ...newPenalties[index], [field]: value }
    setPenalties(newPenalties)
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Match Details</h3>

      <div className="space-y-2">
        <h4 className="font-medium">Home Goals</h4>
        {homeGoals.map((goal, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={goal.player.name}
              onChange={(e) => updateGoal(index, "home", "player", { ...goal.player, name: e.target.value })}
              placeholder="Player Name"
            />
            <Checkbox
              checked={goal.isOwnGoal}
              onCheckedChange={(checked) => updateGoal(index, "home", "isOwnGoal", checked)}
            />
            <Label>Own Goal</Label>
          </div>
        ))}
        <Button onClick={() => addGoal("home")}>Add Home Goal</Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Away Goals</h4>
        {awayGoals.map((goal, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={goal.player.name}
              onChange={(e) => updateGoal(index, "away", "player", { ...goal.player, name: e.target.value })}
              placeholder="Player Name"
            />
            <Checkbox
              checked={goal.isOwnGoal}
              onCheckedChange={(checked) => updateGoal(index, "away", "isOwnGoal", checked)}
            />
            <Label>Own Goal</Label>
          </div>
        ))}
        <Button onClick={() => addGoal("away")}>Add Away Goal</Button>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Penalties</h4>
        {penalties.map((penalty, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              value={penalty.player.name}
              onChange={(e) => updatePenalty(index, "player", { ...penalty.player, name: e.target.value })}
              placeholder="Player Name"
            />
            <Select
              value={penalty.player.team}
              onValueChange={(value) => updatePenalty(index, "player", { ...penalty.player, team: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={fixture.homeTeam}>{fixture.homeTeam}</SelectItem>
                <SelectItem value={fixture.awayTeam}>{fixture.awayTeam}</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={penalty.type}
              onValueChange={(value) => updatePenalty(index, "type", value as "sinBin" | "redCard")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select penalty type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinBin">Sin Bin</SelectItem>
                <SelectItem value="redCard">Red Card</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button onClick={addPenalty}>Add Penalty</Button>
      </div>
    </div>
  )
}

interface MatchDetails {
  homeGoals: Goal[]
  awayGoals: Goal[]
  penalties: Penalty[]
}

