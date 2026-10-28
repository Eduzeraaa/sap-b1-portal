import { JwtPayload } from 'jsonwebtoken'

export type UserPayload = {
    login: string
    cargo: string
}

declare global {
  namespace Express {
    interface Request {
      login?: UserPayload
    }
  }
}