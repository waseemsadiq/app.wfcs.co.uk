"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueData } from "@/lib/hooks/use-league-data"

export function AdminSettings() {
  const { settings, updateSettings } = useLeagueData()
  const [leagueName, setLeagueName] = useState(settings.leagueName || "")
  const [seasonNumber, setSeasonNumber] = useState(settings.seasonNumber || "")
  const [defaultMatchDay, setDefaultMatchDay] = useState(settings.defaultMatchDay || "SAT")
  const [defaultMatchTime, setDefaultMatchTime] = useState(settings.defaultMatchTime || "15:00")
  const { toast } = useToast()

  useEffect(() => {
    setLeagueName(settings.leagueName || "")
    setSeasonNumber(settings.seasonNumber || "")
    setDefaultMatchDay(settings.defaultMatchDay || "SAT")
    setDefaultMatchTime(settings.defaultMatchTime || "15:00")
  }, [settings])

  const handleSave = () => {
    updateSettings({
      leagueName,
      seasonNumber,
      defaultMatchDay,
      defaultMatchTime,
    })

    toast({
      title: "Settings saved",
      description: "Your league settings have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="league-name">League Name</Label>
              <Input
                id="league-name"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
                placeholder="e.g. WELL FOUNDATION COMMUNITY LEAGUE"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season-number">Season Number</Label>
              <Input
                id="season-number"
                value={seasonNumber}
                onChange={(e) => setSeasonNumber(e.target.value)}
                placeholder="e.g. 13"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Default Match Schedule</h3>

            <div className="space-y-2">
              <Label htmlFor="default-day">Default Match Day</Label>
              <Select value={defaultMatchDay} onValueChange={setDefaultMatchDay}>
                <SelectTrigger id="default-day">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MON">Monday</SelectItem>
                  <SelectItem value="TUE">Tuesday</SelectItem>
                  <SelectItem value="WED">Wednesday</SelectItem>
                  <SelectItem value="THU">Thursday</SelectItem>
                  <SelectItem value="FRI">Friday</SelectItem>
                  <SelectItem value="SAT">Saturday</SelectItem>
                  <SelectItem value="SUN">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-time">Default Match Time</Label>
              <Input
                id="default-time"
                type="time"
                value={defaultMatchTime}
                onChange={(e) => setDefaultMatchTime(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave}>Save Settings</Button>
    </div>
  )
}

