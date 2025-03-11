import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StandingsTable } from "@/components/standings-table"
import { FixturesList } from "@/components/fixtures-list"
import { Skeleton } from "@/components/ui/skeleton"
import { SearchInput } from "@/components/search-input"
import { SeasonSelector } from "@/components/season-selector"
import { getLeague } from "@/lib/actions/league-actions"

export default async function LeaguePage({ params }: { params: { leagueId: string } }) {
  const league = await getLeague(params.leagueId)

  if (!league) {
    notFound()
  }

  const latestSeason = league.seasons[league.seasons.length - 1]

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{league.name}</h1>
          <p className="text-muted-foreground">
            {league.seasons.length} {league.seasons.length === 1 ? "season" : "seasons"} available
          </p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchInput />
          <Button variant="outline" asChild>
            <Link href="/leagues">Back to Leagues</Link>
          </Button>
        </div>
      </header>

      <Suspense fallback={<div>Loading seasons...</div>}>
        <SeasonSelector leagueId={params.leagueId} />
      </Suspense>

      {league.seasons.length > 0 ? (
        <div className="mt-6">
          <Tabs defaultValue="standings" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="standings">Standings</TabsTrigger>
              <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
              <TabsTrigger value="stats">Player Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="standings">
              <Card>
                <CardHeader>
                  <CardTitle>League Standings</CardTitle>
                  <CardDescription>Current standings for all teams in the league</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<StandingsTableSkeleton />}>
                    <StandingsTable leagueId={params.leagueId} seasonId={latestSeason.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="fixtures">
              <Card>
                <CardHeader>
                  <CardTitle>Fixtures & Results</CardTitle>
                  <CardDescription>Upcoming matches and recent results</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<div>Loading fixtures...</div>}>
                    <FixturesList leagueId={params.leagueId} seasonId={latestSeason.id} />
                  </Suspense>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Player Statistics</CardTitle>
                  <CardDescription>Top scorers, assists, and other player stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p>Player statistics will be available soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">No Seasons Available</h3>
              <p className="text-muted-foreground mb-4">
                This league doesn't have any seasons yet. Administrators can add seasons from the admin dashboard.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function StandingsTableSkeleton() {
  return (
    <div className="w-full">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4 py-3">
            <Skeleton className="h-4 w-[30px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
    </div>
  )
}

