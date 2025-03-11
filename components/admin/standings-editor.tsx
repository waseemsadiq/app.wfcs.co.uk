"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueData } from "@/lib/hooks/use-league-data"
import type { TeamStanding } from "@/lib/types"

export function AdminStandingsEditor() {
  const { standings, updateStandings } = useLeagueData()
  const [editedStandings, setEditedStandings] = useState<TeamStanding[]>([])
  const { toast } = useToast()

  useEffect(() => {
    setEditedStandings(standings)
  }, [standings])

  const handleInputChange = (index: number, field: keyof TeamStanding, value: string) => {
    const newStandings = [...editedStandings]

    if (field === "Team") {
      newStandings[index][field] = value
    } else {
      // Convert to number for numeric fields
      newStandings[index][field] = Number.parseInt(value) || 0

      // Auto-calculate GD
      if (field === "GF" || field === "GA") {
        newStandings[index].GD = newStandings[index].GF - newStandings[index].GA
      }
    }

    setEditedStandings(newStandings)
  }

  const handleSave = () => {
    updateStandings(editedStandings)
    toast({
      title: "Standings updated",
      description: "The league standings have been successfully updated.",
    })
  }

  const addNewTeam = () => {
    const newTeam: TeamStanding = {
      Team: "New Team",
      P: 0,
      W: 0,
      D: 0,
      L: 0,
      GF: 0,
      GA: 0,
      GD: 0,
      PTS: 0,
    }

    setEditedStandings([...editedStandings, newTeam])
  }

  const removeTeam = (index: number) => {
    const newStandings = [...editedStandings]
    newStandings.splice(index, 1)
    setEditedStandings(newStandings)
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>P</TableHead>
              <TableHead>W</TableHead>
              <TableHead>D</TableHead>
              <TableHead>L</TableHead>
              <TableHead>GF</TableHead>
              <TableHead>GA</TableHead>
              <TableHead>GD</TableHead>
              <TableHead>PTS</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editedStandings.map((team, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input value={team.Team} onChange={(e) => handleInputChange(index, "Team", e.target.value)} />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.P}
                    onChange={(e) => handleInputChange(index, "P", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.W}
                    onChange={(e) => handleInputChange(index, "W", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.D}
                    onChange={(e) => handleInputChange(index, "D", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.L}
                    onChange={(e) => handleInputChange(index, "L", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.GF}
                    onChange={(e) => handleInputChange(index, "GF", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.GA}
                    onChange={(e) => handleInputChange(index, "GA", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Input type="number" value={team.GD} readOnly className="w-16 bg-muted" />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={team.PTS}
                    onChange={(e) => handleInputChange(index, "PTS", e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => removeTeam(index)}>
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <Button onClick={addNewTeam}>Add Team</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  )
}

