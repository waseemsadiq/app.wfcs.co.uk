"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminLeagueManager } from "@/components/admin/league-manager"
import { AdminDataImport } from "@/components/admin/data-import"
import { AdminSettings } from "@/components/admin/settings"
import { useAuth } from "@/lib/hooks/use-auth"

export default function AdminDashboardPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/admin")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage leagues, seasons, fixtures, and settings</p>
      </header>

      <Tabs defaultValue="leagues" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="leagues">Leagues & Seasons</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="leagues">
          <Card>
            <CardHeader>
              <CardTitle>Manage Leagues & Seasons</CardTitle>
              <CardDescription>Create and manage leagues, seasons, teams, and fixtures</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLeagueManager />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import Data</CardTitle>
              <CardDescription>Import league data from CSV, XLSX, or Numbers files</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminDataImport />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure global application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

