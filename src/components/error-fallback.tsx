"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export function ErrorFallback({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-12">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold">Something went wrong</h2>
            <p className="text-muted-foreground text-sm">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
            <Button variant="outline" onClick={resetErrorBoundary}>Try again</Button>
        </div>
    );
}
