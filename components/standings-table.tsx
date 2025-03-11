"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { useLeagueStore } from "@/lib/stores/league-store"

type SortField = "PTS" | "GD" | "GF" | "W" | "P"
type SortDirection = "asc" | "desc"

export function StandingsTable({ leagueId, seasonId }: { leagueId: string; seasonId: string }) {
  const { getStandings } = useLeagueStore()
  const standings = getStandings(leagueId, seasonId)

  const [sortField, setSortField] = useState<SortField>("PTS")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedStandings = [...standings].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1

    if (sortField === "PTS") {
      return (a.PTS - b.PTS) * multiplier
    } else if (sortField === "GD") {
      return (a.GD - b.GD) * multiplier
    } else if (sortField === "GF") {
      return (a.GF - b.GF) * multiplier
    } else if (sortField === "W") {
      return (a.W - b.W) * multiplier
    } else {
      return (a.P - b.P) * multiplier
    }
  })

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Pos</TableHead>
            <TableHead>Team</TableHead>
            <TableHead className="w-[60px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => handleSort("P")}>
                P
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="w-[60px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => handleSort("W")}>
                W
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="w-[60px]">D</TableHead>
            <TableHead className="w-[60px]">L</TableHead>
            <TableHead className="w-[60px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => handleSort("GF")}>
                GF
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="w-[60px]">GA</TableHead>
            <TableHead className="w-[60px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => handleSort("GD")}>
                GD
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
            <TableHead className="w-[60px]">
              <Button variant="ghost" size="sm" className="p-0 h-auto font-medium" onClick={() => handleSort("PTS")}>
                PTS
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStandings.map((team, index) => (
            <TableRow key={team.Team}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="font-medium">{team.Team}</TableCell>
              <TableCell>{team.P}</TableCell>
              <TableCell>{team.W}</TableCell>
              <TableCell>{team.D}</TableCell>
              <TableCell>{team.L}</TableCell>
              <TableCell>{team.GF}</TableCell>
              <TableCell>{team.GA}</TableCell>
              <TableCell>{team.GD}</TableCell>
              <TableCell className="font-bold">{team.PTS}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

