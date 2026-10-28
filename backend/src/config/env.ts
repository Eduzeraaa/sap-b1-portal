import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export const port = process.env.PORT

const jwt_secret = process.env.JWT_SECRET

if (!jwt_secret) {
  throw new Error('JWT_SECRET is not defined')
}

export const JWT_SECRET: string = jwt_secret