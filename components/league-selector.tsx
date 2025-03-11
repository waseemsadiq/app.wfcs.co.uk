"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useLeagueStore } from "@/lib/stores/league-store"

export function LeagueSelector() {
  const { leagues } = useLeagueStore()
  const router = useRouter()

  if (leagues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">No Leagues Available</h3>
            <p className="text-muted-foreground mb-4">
              There are no leagues set up yet. Administrators can create leagues from the admin dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {leagues.map((league) => (
        <Link key={league.id} href={`/leagues/${league.id}`} className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-1">{league.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {league.seasons.length} {league.seasons.length === 1 ? "season" : "seasons"}
              </p>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Latest season:</span>
                  <span className="font-medium">
                    {league.seasons.length > 0 ? league.seasons[league.seasons.length - 1].name : "None"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Teams:</span>
                  <span className="font-medium">
                    {league.seasons.length > 0 ? league.seasons[league.seasons.length - 1].teams.length : 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

