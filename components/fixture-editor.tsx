"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import type { Fixture } from "@/lib/types"

interface FixtureEditorProps {
  fixture: Fixture
  leagueId: string
  seasonId: string
  onClose: () => void
}

export function FixtureEditor({ fixture, leagueId, seasonId, onClose }: FixtureEditorProps) {
  const [editedFixture, setEditedFixture] = useState<Fixture>({ ...fixture })
  const { updateFixtures, getFixtures } = useLeagueStore()
  const { toast } = useToast()

  const handleInputChange = (field: keyof Fixture, value: string | boolean) => {
    setEditedFixture((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const fixtures = getFixtures(leagueId, seasonId)
    const updatedFixtures = fixtures.map((f) => (f.id === editedFixture.id ? editedFixture : f))
    updateFixtures(leagueId, seasonId, updatedFixtures)

    toast({
      title: "Fixture updated",
      description: "The fixture has been successfully updated.",
    })

    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Fixture</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={format(new Date(editedFixture.date), "yyyy-MM-dd")}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              Time
            </Label>
            <Input
              id="time"
              type="time"
              value={editedFixture.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="homeTeam" className="text-right">
              Home Team
            </Label>
            <Input
              id="homeTeam"
              value={editedFixture.homeTeam}
              onChange={(e) => handleInputChange("homeTeam", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="awayTeam" className="text-right">
              Away Team
            </Label>
            <Input
              id="awayTeam"
              value={editedFixture.awayTeam}
              onChange={(e) => handleInputChange("awayTeam", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="played" className="text-right">
              Played
            </Label>
            <Checkbox
              id="played"
              checked={editedFixture.played}
              onCheckedChange={(checked) => handleInputChange("played", checked)}
              className="col-span-3"
            />
          </div>
          {editedFixture.played && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="homeScore" className="text-right">
                  Home Score
                </Label>
                <Input
                  id="homeScore"
                  type="number"
                  value={editedFixture.homeScore}
                  onChange={(e) => handleInputChange("homeScore", e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="awayScore" className="text-right">
                  Away Score
                </Label>
                <Input
                  id="awayScore"
                  type="number"
                  value={editedFixture.awayScore}
                  onChange={(e) => handleInputChange("awayScore", e.target.value)}
                  className="col-span-3"
                />
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

