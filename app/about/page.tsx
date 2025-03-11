import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">About Soccer League Manager</h1>
        <p className="text-muted-foreground">Learn more about our platform</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>Key capabilities of the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Manage multiple leagues and seasons</li>
              <li>Automatic standings calculation from match results</li>
              <li>FIFA-sanctioned fixture generation</li>
              <li>Team and player statistics</li>
              <li>Offline functionality with PWA support</li>
              <li>Import/export data in various formats</li>
              <li>Responsive design for all devices</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
            <CardDescription>Built with modern web technologies</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Soccer League Manager is built as a Progressive Web App (PWA) using Next.js, React, and Tailwind CSS. It
              supports serverless architecture and can be deployed on GitHub Pages and Cloudflare.
            </p>
            <p>
              The app uses client-side storage for offline functionality and synchronizes data when back online. All
              data is stored locally in the browser, making it fast and responsive.
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>How to use Soccer League Manager</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>To get started with Soccer League Manager, follow these steps:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Create a league by logging in as an administrator (username: admin, password: password)</li>
                <li>Add a season to your league and enter the teams</li>
                <li>Generate fixtures using the built-in fixture generator</li>
                <li>Enter match results as games are played</li>
                <li>View automatically calculated standings and statistics</li>
              </ol>
              <div className="flex justify-center mt-6">
                <Button asChild>
                  <Link href="/leagues">Browse Leagues</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

