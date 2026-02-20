"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    // @ts-ignore - The types for next-themes in React 19 might be slightly out of sync
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
