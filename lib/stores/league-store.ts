"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { League, Season, Fixture, TeamStanding, LeagueSettings, Team } from "@/lib/types"

// Sample data for the Well Foundation Community League
const sampleLeague: League = {
  id: "1",
  name: "WELL FOUNDATION COMMUNITY LEAGUE",
  seasons: [
    {
      id: "1",
      name: "Season 13",
      teams: [
        { name: "BLUE" },
        { name: "WHITE" },
        { name: "RED" },
        { name: "PURPLE" },
        { name: "ORANGE" },
        { name: "GREEN" },
        { name: "SKY BLUE" },
        { name: "YELLOW" },
        { name: "PINK" },
      ],
      fixtures: [
        {
          id: "1",
          homeTeam: "BLUE",
          awayTeam: "RED",
          date: "2023-10-15",
          time: "15:00",
          played: true,
          homeScore: 3,
          awayScore: 1,
        },
        {
          id: "2",
          homeTeam: "WHITE",
          awayTeam: "PURPLE",
          date: "2023-10-15",
          time: "17:00",
          played: true,
          homeScore: 2,
          awayScore: 2,
        },
        {
          id: "3",
          homeTeam: "YELLOW",
          awayTeam: "GREEN",
          date: "2023-10-22",
          time: "15:00",
          played: true,
          homeScore: 1,
          awayScore: 3,
        },
        {
          id: "4",
          homeTeam: "ORANGE",
          awayTeam: "PINK",
          date: "2023-10-22",
          time: "17:00",
          played: true,
          homeScore: 4,
          awayScore: 2,
        },
        {
          id: "5",
          homeTeam: "BLUE",
          awayTeam: "SKY BLUE",
          date: "2023-10-29",
          time: "15:00",
          played: false,
          homeScore: 0,
          awayScore: 0,
        },
        {
          id: "6",
          homeTeam: "RED",
          awayTeam: "WHITE",
          date: "2023-10-29",
          time: "17:00",
          played: false,
          homeScore: 0,
          awayScore: 0,
        },
      ],
      standings: [
        { Team: "BLUE", P: 6, W: 6, D: 0, L: 0, GF: 60, GA: 34, GD: 26, PTS: 18 },
        { Team: "WHITE", P: 6, W: 4, D: 1, L: 1, GF: 51, GA: 34, GD: 17, PTS: 13 },
        { Team: "RED", P: 6, W: 4, D: 0, L: 2, GF: 51, GA: 43, GD: 8, PTS: 12 },
        { Team: "PURPLE", P: 6, W: 3, D: 2, L: 1, GF: 60, GA: 37, GD: 23, PTS: 11 },
        { Team: "ORANGE", P: 6, W: 2, D: 1, L: 3, GF: 38, GA: 41, GD: -3, PTS: 7 },
        { Team: "GREEN", P: 6, W: 2, D: 1, L: 3, GF: 49, GA: 58, GD: -9, PTS: 7 },
        { Team: "SKY BLUE", P: 7, W: 2, D: 0, L: 5, GF: 41, GA: 64, GD: -23, PTS: 6 },
        { Team: "YELLOW", P: 6, W: 1, D: 1, L: 3, GF: 41, GA: 59, GD: -18, PTS: 4 },
        { Team: "PINK", P: 7, W: 1, D: 0, L: 6, GF: 37, GA: 59, GD: -22, PTS: 3 },
      ],
    },
  ],
}

// Default settings
const defaultSettings: LeagueSettings = {
  leagueName: "Soccer League Manager",
  seasonNumber: "1",
  defaultMatchDay: "SAT",
  defaultMatchTime: "15:00",
}

interface PlayerStats {
  goals: number
  assists: number
  ownGoals: number
  sinBins: number
  redCards: number
}

interface LeagueState {
  leagues: League[]
  settings: LeagueSettings

  // League actions
  addLeague: (league: League) => void
  updateLeague: (leagueId: string, league: Partial<League>) => void
  removeLeague: (leagueId: string) => void

  // Season actions
  addSeason: (leagueId: string, season: Season) => void
  updateSeason: (leagueId: string, seasonId: string, season: Partial<Season>) => void
  removeSeason: (leagueId: string, seasonId: string) => void

  // Fixture actions
  updateFixtures: (leagueId: string, seasonId: string, fixtures: Fixture[]) => void

  // Settings actions
  updateSettings: (settings: Partial<LeagueSettings>) => void

  // Getters
  getLeague: (leagueId: string) => League | undefined
  getSeason: (leagueId: string, seasonId: string) => Season | undefined
  getFixtures: (leagueId: string, seasonId: string) => Fixture[]
  getTeamsForSeason: (leagueId: string, seasonId: string) => Team[]
  getStandings: (leagueId: string, seasonId: string) => TeamStanding[]
  getSettings: () => LeagueSettings

  // Calculations
  calculateStandings: (leagueId: string, seasonId: string) => void

  // Add a new action to initialize the store if it's empty
  initializeStore: () => void

  calculatePlayerStats: (leagueId: string, seasonId: string) => Record<string, PlayerStats>

  // Add these new functions
  getTeam: (leagueId: string, seasonId: string, teamName: string) => Team | undefined
  updateTeam: (leagueId: string, seasonId: string, oldTeamName: string, updatedTeam: Team) => void
}

export const useLeagueStore = create<LeagueState>()(
  persist(
    (set, get) => ({
      leagues: [sampleLeague],
      settings: defaultSettings,

      // League actions
      addLeague: (league) =>
        set((state) => ({
          leagues: [...state.leagues, league],
        })),

      updateLeague: (leagueId, updatedLeague) =>
        set((state) => ({
          leagues: state.leagues.map((league) => (league.id === leagueId ? { ...league, ...updatedLeague } : league)),
        })),

      removeLeague: (leagueId) =>
        set((state) => ({
          leagues: state.leagues.filter((league) => league.id !== leagueId),
        })),

      // Season actions
      addSeason: (leagueId, season) =>
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId ? { ...league, seasons: [...league.seasons, season] } : league,
          ),
        })),

      updateSeason: (leagueId, seasonId, updatedSeason) =>
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId
              ? {
                  ...league,
                  seasons: league.seasons.map((season) =>
                    season.id === seasonId ? { ...season, ...updatedSeason } : season,
                  ),
                }
              : league,
          ),
        })),

      removeSeason: (leagueId, seasonId) =>
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId
              ? {
                  ...league,
                  seasons: league.seasons.filter((season) => season.id !== seasonId),
                }
              : league,
          ),
        })),

      // Fixture actions
      updateFixtures: (leagueId, seasonId, fixtures) => {
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId
              ? {
                  ...league,
                  seasons: league.seasons.map((season) => (season.id === seasonId ? { ...season, fixtures } : season)),
                }
              : league,
          ),
        }))

        // Recalculate standings after updating fixtures
        get().calculateStandings(leagueId, seasonId)
      },

      // Settings actions
      updateSettings: (updatedSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...updatedSettings },
        })),

      // Getters
      getLeague: (leagueId) => {
        return get().leagues.find((league) => league.id === leagueId)
      },

      getSeason: (leagueId, seasonId) => {
        const league = get().leagues.find((league) => league.id === leagueId)
        if (!league) return undefined
        return league.seasons.find((season) => season.id === seasonId)
      },

      getFixtures: (leagueId, seasonId) => {
        const season = get().getSeason(leagueId, seasonId)
        return season?.fixtures || []
      },

      getTeamsForSeason: (leagueId, seasonId) => {
        const season = get().getSeason(leagueId, seasonId)
        return season?.teams || []
      },

      getStandings: (leagueId, seasonId) => {
        const season = get().getSeason(leagueId, seasonId)
        return season?.standings || []
      },

      getSettings: () => {
        return get().settings
      },

      // Calculations
      calculateStandings: (leagueId, seasonId) => {
        const season = get().getSeason(leagueId, seasonId)
        if (!season) return

        const fixtures = season.fixtures
        const teams = season.teams.map((team) => team.name)

        // Initialize standings
        const standings: Record<string, TeamStanding> = {}

        teams.forEach((team) => {
          standings[team] = {
            Team: team,
            P: 0, // Played
            W: 0, // Won
            D: 0, // Drawn
            L: 0, // Lost
            GF: 0, // Goals For
            GA: 0, // Goals Against
            GD: 0, // Goal Difference
            PTS: 0, // Points
          }
        })

        // Calculate standings from fixtures
        fixtures
          .filter((fixture) => fixture.played)
          .forEach((fixture) => {
            const { homeTeam, awayTeam, homeScore, awayScore } = fixture

            // Update home team stats
            if (standings[homeTeam]) {
              standings[homeTeam].P += 1
              standings[homeTeam].GF += homeScore
              standings[homeTeam].GA += awayScore

              if (homeScore > awayScore) {
                standings[homeTeam].W += 1
                standings[homeTeam].PTS += 3
              } else if (homeScore === awayScore) {
                standings[homeTeam].D += 1
                standings[homeTeam].PTS += 1
              } else {
                standings[homeTeam].L += 1
              }
            }

            // Update away team stats
            if (standings[awayTeam]) {
              standings[awayTeam].P += 1
              standings[awayTeam].GF += awayScore
              standings[awayTeam].GA += homeScore

              if (awayScore > homeScore) {
                standings[awayTeam].W += 1
                standings[awayTeam].PTS += 3
              } else if (awayScore === homeScore) {
                standings[awayTeam].D += 1
                standings[awayTeam].PTS += 1
              } else {
                standings[awayTeam].L += 1
              }
            }
          })

        // Calculate goal differences
        Object.keys(standings).forEach((team) => {
          standings[team].GD = standings[team].GF - standings[team].GA
        })

        // Convert to array and sort by points, then goal difference
        const sortedStandings = Object.values(standings).sort((a, b) => {
          if (a.PTS !== b.PTS) return b.PTS - a.PTS
          if (a.GD !== b.GD) return b.GD - a.GD
          return b.GF - a.GF
        })

        // Update the season standings
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId
              ? {
                  ...league,
                  seasons: league.seasons.map((season) =>
                    season.id === seasonId ? { ...season, standings: sortedStandings } : season,
                  ),
                }
              : league,
          ),
        }))
      },
      initializeStore: () => {
        const state = get()
        if (state.leagues.length === 0) {
          set({ leagues: [sampleLeague] })
        }
      },

      calculatePlayerStats: (leagueId: string, seasonId: string) => {
        const season = get().getSeason(leagueId, seasonId)
        if (!season) return {}

        const playerStats: Record<string, PlayerStats> = {}

        season.fixtures.forEach((fixture) => {
          if (fixture.played && fixture.matchDetails) {
            const { homeGoals, awayGoals, penalties } = fixture.matchDetails

            // Process goals
            homeGoals.concat(awayGoals).forEach((goal) => {
              const { player, isOwnGoal } = goal
              if (!playerStats[player.name]) {
                playerStats[player.name] = { goals: 0, assists: 0, ownGoals: 0, sinBins: 0, redCards: 0 }
              }
              if (isOwnGoal) {
                playerStats[player.name].ownGoals++
              } else {
                playerStats[player.name].goals++
              }
            })

            // Process penalties
            penalties.forEach((penalty) => {
              const { player, type } = penalty
              if (!playerStats[player.name]) {
                playerStats[player.name] = { goals: 0, assists: 0, ownGoals: 0, sinBins: 0, redCards: 0 }
              }
              if (type === "sinBin") {
                playerStats[player.name].sinBins++
              } else if (type === "redCard") {
                playerStats[player.name].redCards++
              }
            })
          }
        })

        return playerStats
      },

      getTeam: (leagueId, seasonId, teamName) => {
        const league = get().leagues.find((l) => l.id === leagueId)
        const season = league?.seasons.find((s) => s.id === seasonId)
        return season?.teams.find((t) => t.name === teamName)
      },

      updateTeam: (leagueId, seasonId, oldTeamName, updatedTeam) => {
        set((state) => ({
          leagues: state.leagues.map((league) =>
            league.id === leagueId
              ? {
                  ...league,
                  seasons: league.seasons.map((season) =>
                    season.id === seasonId
                      ? {
                          ...season,
                          teams: season.teams.map((team) => (team.name === oldTeamName ? updatedTeam : team)),
                        }
                      : season,
                  ),
                }
              : league,
          ),
        }))

        // Update team name in fixtures if it has changed
        if (oldTeamName !== updatedTeam.name) {
          set((state) => ({
            leagues: state.leagues.map((league) =>
              league.id === leagueId
                ? {
                    ...league,
                    seasons: league.seasons.map((season) =>
                      season.id === seasonId
                        ? {
                            ...season,
                            fixtures: season.fixtures.map((fixture) => ({
                              ...fixture,
                              homeTeam: fixture.homeTeam === oldTeamName ? updatedTeam.name : fixture.homeTeam,
                              awayTeam: fixture.awayTeam === oldTeamName ? updatedTeam.name : fixture.awayTeam,
                            })),
                          }
                        : season,
                    ),
                  }
                : league,
            ),
          }))
        }
      },
    }),
    {
      name: "league-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

