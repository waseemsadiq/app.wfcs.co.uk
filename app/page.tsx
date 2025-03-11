import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchInput } from "@/components/search-input"
import { LeagueSelector } from "@/components/league-selector"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Soccer League Manager</h1>
          <p className="text-muted-foreground">View and manage multiple leagues and seasons</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchInput />
          <Button variant="outline" asChild>
            <Link href="/admin">Admin Login</Link>
          </Button>
        </div>
      </header>

      <Suspense fallback={<div>Loading leagues...</div>}>
        <LeagueSelector />
      </Suspense>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Soccer League Manager</CardTitle>
            <CardDescription>
              A comprehensive platform for managing soccer leagues, fixtures, and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Select a league from above to view standings, fixtures, and player statistics. Administrators can manage
              multiple leagues and seasons, generate fixtures, and track results.
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
            <Button asChild>
              <Link href="/leagues">Browse All Leagues</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

