/**
 * Días entre dos fechas (truncado).
 * Usado para FOMO "Salud de la propiedad".
 */
export function getDaysDifference(
    from: Date | string | { seconds: number; nanoseconds?: number },
    to: Date = new Date()
): number {
    const fromMs =
        typeof from === 'string'
            ? new Date(from).getTime()
            : from instanceof Date
              ? from.getTime()
              : from.seconds * 1000 + (from.nanoseconds ?? 0) / 1_000_000
    const toMs = to instanceof Date ? to.getTime() : new Date(to).getTime()
    return Math.max(0, Math.floor((toMs - fromMs) / (24 * 60 * 60 * 1000)))
}
