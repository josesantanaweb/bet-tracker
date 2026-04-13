export interface IMatch {
    id: string
    name: string
    logo: string
    won?: number
    lost?: number
  }
  
  export interface ICreateMatch {
    name: string
    logo: string
  }
  