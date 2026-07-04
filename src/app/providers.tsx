"use client";

import { QueryClient, QueryClientProvider, QueryCache } from '@tanstack/react-query'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/error-fallback'
import { toast } from 'sonner'
import React, { useState } from 'react';

export default function Providers({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error("Something went wrong", {
          description: error.message,
        });
      },
    }),
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 0,
      },
    },
  }))

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ErrorBoundary>
  )
}