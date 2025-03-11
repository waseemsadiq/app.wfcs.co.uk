"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueStore } from "@/lib/stores/league-store"
import { PlusCircle, Trash2 } from "lucide-react"

interface Player {
  id: string
  name: string
  position: string
  age: number
  isCaptain: boolean
}

interface Team {
  name: string
  players: Player[]
}

interface TeamEditorProps {
  leagueId: string
  seasonId: string
  teamName: string
  onClose: () => void
}

export function TeamEditor({ leagueId, seasonId, teamName, onClose }: TeamEditorProps) {
  const { getTeam, updateTeam } = useLeagueStore()
  const { toast } = useToast()
  const [team, setTeam] = useState<Team>({ name: "", players: [] })

  useEffect(() => {
    const fetchedTeam = getTeam(leagueId, seasonId, teamName)
    if (fetchedTeam) {
      setTeam(fetchedTeam)
    }
  }, [getTeam, leagueId, seasonId, teamName])

  const handleTeamNameChange = (newName: string) => {
    setTeam((prev) => ({ ...prev, name: newName }))
  }

  const handlePlayerChange = (index: number, field: keyof Player, value: string | number | boolean) => {
    setTeam((prev) => {
      const newPlayers = [...prev.players]
      newPlayers[index] = { ...newPlayers[index], [field]: value }
      if (field === "isCaptain" && value === true) {
        newPlayers.forEach((player, i) => {
          if (i !== index) player.isCaptain = false
        })
      }
      return { ...prev, players: newPlayers }
    })
  }

  const handleAddPlayer = () => {
    setTeam((prev) => ({
      ...prev,
      players: [...prev.players, { id: Date.now().toString(), name: "", position: "", age: 18, isCaptain: false }],
    }))
  }

  const handleRemovePlayer = (index: number) => {
    setTeam((prev) => {
      const newPlayers = prev.players.filter((_, i) => i !== index)
      return { ...prev, players: newPlayers }
    })
  }

  const handleSave = () => {
    updateTeam(leagueId, seasonId, teamName, team)
    toast({
      title: "Team updated",
      description: "The team details have been successfully updated.",
    })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Team: {teamName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamName" className="text-right">
              Team Name
            </Label>
            <Input
              id="teamName"
              value={team.name}
              onChange={(e) => handleTeamNameChange(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="space-y-4">
            <Label>Players</Label>
            {team.players.map((player, index) => (
              <div key={player.id} className="grid grid-cols-12 gap-2 items-center">
                <Input
                  value={player.name}
                  onChange={(e) => handlePlayerChange(index, "name", e.target.value)}
                  placeholder="Name"
                  className="col-span-3"
                />
                <Select value={player.position} onValueChange={(value) => handlePlayerChange(index, "position", value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GK">Goalkeeper</SelectItem>
                    <SelectItem value="DF">Defender</SelectItem>
                    <SelectItem value="MF">Midfielder</SelectItem>
                    <SelectItem value="FW">Forward</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={player.age}
                  onChange={(e) => handlePlayerChange(index, "age", Number.parseInt(e.target.value))}
                  placeholder="Age"
                  className="col-span-2"
                />
                <div className="flex items-center space-x-2 col-span-3">
                  <Checkbox
                    id={`captain-${player.id}`}
                    checked={player.isCaptain}
                    onCheckedChange={(checked) => handlePlayerChange(index, "isCaptain", checked)}
                  />
                  <Label htmlFor={`captain-${player.id}`}>Captain</Label>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemovePlayer(index)} className="col-span-1">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={handleAddPlayer} variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> Add Player
            </Button>
          </div>
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

