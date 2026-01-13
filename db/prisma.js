require('dotenv').config()
const { PrismaClient } = require('../generated/prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

// Production check
const isProduction = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction
    ? { rejectUnauthorized: false } // Neon / Render
    : false,                        // local dev
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

module.exports = { prisma }
