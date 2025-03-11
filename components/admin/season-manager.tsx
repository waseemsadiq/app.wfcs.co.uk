"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { League, Season } from "@/lib/types"
import { AdminFixtureGenerator } from "@/components/admin/fixture-generator"

interface AdminSeasonManagerProps {
  league: League
  onSeasonSelect: (season: Season) => void
  onSeasonCreated: () => void
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AdminSeasonManager({ league, onSeasonSelect, onSeasonCreated }: AdminSeasonManagerProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list")
  const [newSeasonName, setNewSeasonName] = useState("")
  const [startMonth, setStartMonth] = useState(0)
  const [endMonth, setEndMonth] = useState(11)
  const [defaultMatchDays, setDefaultMatchDays] = useState<string[]>(["Saturday"])
  const [defaultMatchTimes, setDefaultMatchTimes] = useState<string[]>(["15:00"])
  const [showFixtureGenerator, setShowFixtureGenerator] = useState(false)
  const [newSeasonTeams, setNewSeasonTeams] = useState<string[]>([])
  const [newTeamName, setNewTeamName] = useState("")
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null)
  const [newMatchTime, setNewMatchTime] = useState({ hours: "", minutes: "" })
  const { addSeason, removeSeason } = useLeagueStore()
  const { toast } = useToast()

  const handleAddTeam = () => {
    if (!newTeamName.trim()) return
    const teamsToAdd = newTeamName
      .split(",")
      .map((team) => team.trim())
      .filter((team) => team !== "")
    setNewSeasonTeams((prev) => [...prev, ...teamsToAdd])
    setNewTeamName("")
  }

  const handleRemoveTeam = (index: number) => {
    const updatedTeams = [...newSeasonTeams]
    updatedTeams.splice(index, 1)
    setNewSeasonTeams(updatedTeams)
  }

  const handleCreateSeason = () => {
    if (!newSeasonName.trim()) {
      toast({
        title: "Season name required",
        description: "Please enter a name for the season.",
        variant: "destructive",
      })
      return
    }

    if (newSeasonTeams.length < 2) {
      toast({
        title: "Not enough teams",
        description: "You need at least 2 teams to create a season.",
        variant: "destructive",
      })
      return
    }

    if (defaultMatchDays.length === 0 || defaultMatchTimes.length === 0) {
      toast({
        title: "Match days and times required",
        description: "Please select at least one default match day and time.",
        variant: "destructive",
      })
      return
    }

    // Create the new season
    const newSeason: Season = {
      id: Date.now().toString(),
      name: newSeasonName,
      teams: newSeasonTeams.map((name) => ({ name })),
      fixtures: [],
      startMonth,
      endMonth,
      defaultMatchDays,
      defaultMatchTimes,
    }

    // Add the season to the store
    addSeason(league.id, newSeason)

    // Update local state
    setCurrentSeason(newSeason)

    // Show fixture generator
    setShowFixtureGenerator(true)
  }

  const handleDeleteSeason = (e: React.MouseEvent, seasonId: string) => {
    e.stopPropagation()

    if (
      confirm(
        "Are you sure you want to delete this season? This will delete all fixtures and data associated with this season.",
      )
    ) {
      removeSeason(league.id, seasonId)
    }
  }

  const handleFixturesGenerated = () => {
    setShowFixtureGenerator(false)
    setActiveTab("list")
    setNewSeasonName("")
    setNewSeasonTeams([])
    setStartMonth(0)
    setEndMonth(11)
    setDefaultMatchDays(["Saturday"])
    setDefaultMatchTimes(["15:00"])
    setCurrentSeason(null)

    onSeasonCreated()

    toast({
      title: "Season created",
      description: "The season and fixtures have been created successfully.",
    })
  }

  const handleMatchDayToggle = (day: string) => {
    setDefaultMatchDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]))
  }

  const handleAddMatchTime = () => {
    const { hours, minutes } = newMatchTime
    if (hours && minutes) {
      const time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
      if (!defaultMatchTimes.includes(time)) {
        setDefaultMatchTimes([...defaultMatchTimes, time])
      }
      setNewMatchTime({ hours: "", minutes: "" })
    }
  }

  const handleRemoveMatchTime = (time: string) => {
    setDefaultMatchTimes((prev) => prev.filter((t) => t !== time))
  }

  if (showFixtureGenerator && currentSeason) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Generate Fixtures for {currentSeason.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminFixtureGenerator
            leagueId={league.id}
            seasonId={currentSeason.id}
            teams={currentSeason.teams.map((team) => team.name)}
            startMonth={currentSeason.startMonth}
            endMonth={currentSeason.endMonth}
            defaultMatchDays={currentSeason.defaultMatchDays}
            defaultMatchTimes={currentSeason.defaultMatchTimes}
            onComplete={handleFixturesGenerated}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "create")}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="list">Season List</TabsTrigger>
        <TabsTrigger value="create">Create New Season</TabsTrigger>
      </TabsList>
      <TabsContent value="list" className="pt-4">
        {league.seasons.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No Seasons Available</h3>
                <p className="text-muted-foreground mb-4">
                  This league doesn't have any seasons yet. Use the "Create New Season" tab to create your first season.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {league.seasons.map((season) => (
              <Card
                key={season.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onSeasonSelect(season)}
              >
                <CardHeader>
                  <CardTitle>{season.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {season.teams.length} teams •{season.fixtures.length} fixtures
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {months[season.startMonth]} to {months[season.endMonth]}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => onSeasonSelect(season)}>
                    Manage Fixtures
                  </Button>
                  <Button variant="destructive" size="sm" onClick={(e) => handleDeleteSeason(e, season.id)}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="create" className="pt-4">
        <Card>
          <CardHeader>
            <CardTitle>Create New Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="season-name">Season Name</Label>
                <Input
                  id="season-name"
                  value={newSeasonName}
                  onChange={(e) => setNewSeasonName(e.target.value)}
                  placeholder="e.g. Season 2023-2024"
                />
              </div>

              <div className="space-y-2">
                <Label>Season Duration</Label>
                <div className="flex space-x-4">
                  <Select value={startMonth.toString()} onValueChange={(value) => setStartMonth(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Start Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={endMonth.toString()} onValueChange={(value) => setEndMonth(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="End Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Match Days</Label>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={defaultMatchDays.includes(day)}
                        onCheckedChange={() => handleMatchDayToggle(day)}
                      />
                      <label htmlFor={`day-${day}`}>{day}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Default Match Times</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="HH"
                    value={newMatchTime.hours}
                    onChange={(e) => setNewMatchTime((prev) => ({ ...prev, hours: e.target.value }))}
                    className="w-20"
                  />
                  <span>:</span>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="MM"
                    value={newMatchTime.minutes}
                    onChange={(e) => setNewMatchTime((prev) => ({ ...prev, minutes: e.target.value }))}
                    className="w-20"
                  />
                  <Button type="button" onClick={handleAddMatchTime}>
                    Add Time
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {defaultMatchTimes.map((time) => (
                    <div key={time} className="flex items-center space-x-2 bg-secondary p-2 rounded">
                      <span>{time}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveMatchTime(time)}>
                        X
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Teams</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Enter team names (comma-separated)"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddTeam()
                      }
                    }}
                  />
                  <Button type="button" onClick={handleAddTeam}>
                    Add
                  </Button>
                </div>

                <div className="mt-4">
                  {newSeasonTeams.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No teams added yet. Add at least 2 teams.</p>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      {newSeasonTeams.map((team, index) => (
                        <div key={index} className="flex justify-between items-center p-2 border-b last:border-b-0">
                          <span>{team}</span>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveTeam(index)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleCreateSeason}
                disabled={
                  !newSeasonName.trim() ||
                  newSeasonTeams.length < 2 ||
                  defaultMatchDays.length === 0 ||
                  defaultMatchTimes.length === 0
                }
              >
                Create Season & Generate Fixtures
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

