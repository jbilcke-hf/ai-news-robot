export type DailyPapersApiResponse = DailyPaperArticle[]

export interface DailyPaperArticle {
  paper: Paper
  publishedAt: string
  title: string
  mediaUrl: string
  numComments: number
}

export interface Paper {
  id: string
  authors: Author[]
  publishedAt: string
  title: string
  summary: string
  upvotes: number
}

export interface Author {
  _id: string
  name: string
  hidden: boolean
  user?: User
  status?: string
  statusLastChangedAt?: string
}

export interface User {
  avatarUrl: string
  isPro: boolean
  fullname: string
  user: string
  type: string
}
