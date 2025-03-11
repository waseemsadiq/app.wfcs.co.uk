export type TeamStanding = {
  Team: string
  P: number // Played
  W: number // Won
  D: number // Drawn
  L: number // Lost
  GF: number // Goals For
  GA: number // Goals Against
  GD: number // Goal Difference
  PTS: number // Points
}

export type Team = {
  name: string
  // Additional team properties can be added here
}

export type Player = {
  id: string
  name: string
  team: string
}

export type Goal = {
  player: Player
  isOwnGoal: boolean
}

export type Penalty = {
  player: Player
  type: "sinBin" | "redCard"
}

export type MatchDetails = {
  homeGoals: Goal[]
  awayGoals: Goal[]
  penalties: Penalty[]
}

export type Fixture = {
  id: string
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  played: boolean
  homeScore: number
  awayScore: number
  matchDetails?: MatchDetails
}

export type Season = {
  id: string
  name: string
  teams: Team[]
  fixtures: Fixture[]
  standings?: TeamStanding[]
  startMonth: number
  endMonth: number
  defaultMatchDays: string[]
  defaultMatchTimes: string[]
}

export type League = {
  id: string
  name: string
  seasons: Season[]
}

export type LeagueSettings = {
  leagueName: string
  seasonNumber: string
  defaultMatchDay: string
  defaultMatchTime: string
}

