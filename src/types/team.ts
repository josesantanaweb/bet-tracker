export interface ITeam {
  id: string
  name: string
  logo: string
  won?: number
  lost?: number
}

export interface ICreateTeam {
  name: string
  logo: string
}
