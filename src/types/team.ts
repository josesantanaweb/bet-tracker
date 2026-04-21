export interface ITeam {
  id: string
  name: string
  logo: string
  won?: number
  lost?: number
  isFavorite?: boolean
}

export interface ICreateTeam {
  name: string
  logo: string
}

export interface IUpdateTeam extends Partial<ICreateTeam> {
  id: string
  isFavorite?: boolean
}
