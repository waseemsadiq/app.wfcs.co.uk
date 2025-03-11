"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useLeagueData } from "@/lib/hooks/use-league-data"
import type { TeamStanding } from "@/lib/types"

export function AdminDataImport() {
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<"standings" | "fixtures" | "players">("standings")
  const [isLoading, setIsLoading] = useState(false)
  const { updateStandings, updateFixtures } = useLeagueData()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) return

    setIsLoading(true)

    try {
      const text = await file.text()

      if (importType === "standings") {
        const standings = parseCSV(text)
        updateStandings(standings)
        toast({
          title: "Import successful",
          description: `Imported ${standings.length} teams into standings.`,
        })
      } else if (importType === "fixtures") {
        // Implement fixtures import
        toast({
          title: "Not implemented",
          description: "Fixtures import is not yet implemented.",
          variant: "destructive",
        })
      } else {
        // Implement players import
        toast({
          title: "Not implemented",
          description: "Players import is not yet implemented.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing the data. Please check the file format.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const parseCSV = (csv: string): TeamStanding[] => {
    const lines = csv.split("\n")
    const headers = lines[7].split(",")

    const standings: TeamStanding[] = []

    for (let i = 8; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(",")
      if (values.length < 8) continue

      const standing: TeamStanding = {
        Team: values[0],
        P: Number.parseInt(values[1]) || 0,
        W: Number.parseInt(values[2]) || 0,
        D: Number.parseInt(values[3]) || 0,
        L: Number.parseInt(values[4]) || 0,
        GF: Number.parseInt(values[5]) || 0,
        GA: Number.parseInt(values[6]) || 0,
        GD: Number.parseInt(values[7]) || 0,
        PTS: Number.parseInt(values[8]) || 0,
      }

      standings.push(standing)
    }

    return standings
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="standings" onValueChange={(value) => setImportType(value as any)}>
        <TabsList>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
        </TabsList>
        <TabsContent value="standings">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                Import team standings from a CSV file. The file should have the following format:
              </p>
              <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto mb-4">
                {`WELL FOUNDATION,,COMMUNITY,,LEAGUE,SEASON,13,,

Team,P,W,D,L,GF,GA,GD,PTS
BLUE,6,6,,,60,34,26,18
WHITE,6,4,1,1,51,34,17,13
...`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fixtures">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Import fixtures from a CSV file. Format details will be provided soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="players">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Import player statistics from a CSV file. Format details will be provided soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".csv,.xlsx,.numbers"
          onChange={handleFileChange}
          className="block w-full text-sm text-slate-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-primary file:text-primary-foreground
            hover:file:bg-primary/90"
        />
        <Button onClick={handleImport} disabled={!file || isLoading}>
          {isLoading ? "Importing..." : "Import"}
        </Button>
      </div>
    </div>
  )
}

