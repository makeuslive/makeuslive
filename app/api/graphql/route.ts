import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest, NextResponse } from 'next/server'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

// Create Next.js handler with proper typing for App Router
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
})

// Wrap handlers to satisfy Next.js 16 App Router type requirements
export async function GET(request: NextRequest): Promise<NextResponse | Response> {
  return handler(request) as Promise<NextResponse | Response>
}

export async function POST(request: NextRequest): Promise<NextResponse | Response> {
  return handler(request) as Promise<NextResponse | Response>
}
