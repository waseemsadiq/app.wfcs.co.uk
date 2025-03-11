"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { League, Season } from "@/lib/types"
import { AdminLeagueList } from "@/components/admin/league-list"
import { AdminSeasonManager } from "@/components/admin/season-manager"
import { AdminFixturesEditor } from "@/components/admin/fixtures-editor"

export function AdminLeagueManager() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list")
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null)
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [newLeagueName, setNewLeagueName] = useState("")
  const { addLeague, getLeague } = useLeagueStore()
  const { toast } = useToast()

  const handleCreateLeague = () => {
    if (!newLeagueName.trim()) {
      toast({
        title: "League name required",
        description: "Please enter a name for the league.",
        variant: "destructive",
      })
      return
    }

    const newLeague: League = {
      id: Date.now().toString(),
      name: newLeagueName,
      seasons: [],
    }

    addLeague(newLeague)
    setNewLeagueName("")
    setActiveTab("list")

    toast({
      title: "League created",
      description: `"${newLeagueName}" has been created successfully.`,
    })
  }

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league)
    setSelectedSeason(null)
  }

  const handleSeasonSelect = (season: Season) => {
    setSelectedSeason(season)
  }

  const handleBackToLeagues = () => {
    setSelectedLeague(null)
    setSelectedSeason(null)
  }

  const handleBackToSeasons = () => {
    setSelectedSeason(null)
  }

  const handleSeasonCreated = (leagueId: string) => {
    // Refresh the selected league data
    const updatedLeague = getLeague(leagueId)
    if (updatedLeague) {
      setSelectedLeague(updatedLeague)
    }
    setActiveTab("list")
  }

  return (
    <div className="space-y-6">
      {!selectedLeague ? (
        <>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "list" | "create")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">League List</TabsTrigger>
              <TabsTrigger value="create">Create New League</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="pt-4">
              <AdminLeagueList onLeagueSelect={handleLeagueSelect} />
            </TabsContent>
            <TabsContent value="create" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Create New League</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="league-name">League Name</Label>
                      <Input
                        id="league-name"
                        value={newLeagueName}
                        onChange={(e) => setNewLeagueName(e.target.value)}
                        placeholder="e.g. Premier League"
                      />
                    </div>
                    <Button onClick={handleCreateLeague}>Create League</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : !selectedSeason ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedLeague.name}</h2>
            <Button variant="outline" onClick={handleBackToLeagues}>
              Back to Leagues
            </Button>
          </div>
          <AdminSeasonManager
            league={selectedLeague}
            onSeasonSelect={handleSeasonSelect}
            onSeasonCreated={() => handleSeasonCreated(selectedLeague.id)}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">
                {selectedLeague.name} - {selectedSeason.name}
              </h2>
              <p className="text-muted-foreground">Manage fixtures and results</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBackToSeasons}>
                Back to Seasons
              </Button>
              <Button variant="outline" onClick={handleBackToLeagues}>
                Back to Leagues
              </Button>
            </div>
          </div>
          <AdminFixturesEditor leagueId={selectedLeague.id} seasonId={selectedSeason.id} />
        </>
      )}
    </div>
  )
}

