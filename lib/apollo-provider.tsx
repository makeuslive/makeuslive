'use client'

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { ApolloProvider as ApolloClientProvider } from '@apollo/client/react'
import { ReactNode, useMemo } from 'react'

// Create Apollo Client instance
function createApolloClient(): ApolloClient<unknown> {
    return new ApolloClient({
        ssrMode: typeof window === 'undefined',
        link: new HttpLink({
            uri: '/api/graphql',
            credentials: 'same-origin',
        }),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        // Merge policies for list queries
                        blogPosts: {
                            merge: (_, incoming) => incoming,
                        },
                        testimonials: {
                            merge: (_, incoming) => incoming,
                        },
                        works: {
                            merge: (_, incoming) => incoming,
                        },
                    },
                },
            },
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: 'cache-first',
            },
        },
    })
}

// Singleton for client
let apolloClient: ApolloClient<unknown> | undefined

// Get or create Apollo Client
export function getApolloClient(): ApolloClient<unknown> {
    const _apolloClient = apolloClient ?? createApolloClient()

    // Create new client for server-side
    if (typeof window === 'undefined') return _apolloClient

    // Reuse client on client-side
    if (!apolloClient) apolloClient = _apolloClient

    return _apolloClient
}

// Apollo Provider component
export function ApolloProvider({ children }: { children: ReactNode }) {
    const client = useMemo(() => getApolloClient(), [])
    return <ApolloClientProvider client={client}>{children}</ApolloClientProvider>
}
