import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/search-input"
import { LeagueSelector } from "@/components/league-selector"

export default function LeaguesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Leagues</h1>
          <p className="text-muted-foreground">Browse and select a league to view</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <SearchInput />
          <Button variant="outline" asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </header>

      <Suspense fallback={<div>Loading leagues...</div>}>
        <LeagueSelector />
      </Suspense>
    </div>
  )
}

