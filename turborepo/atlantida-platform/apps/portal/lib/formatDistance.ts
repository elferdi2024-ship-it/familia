/** Formatea distancia en metros para mostrar (ej. "200 m", "1.2 km") */
export function formatDistance(meters: number): string {
    if (meters < 1000) return `${meters} m`
    const km = (meters / 1000).toFixed(1)
    return `${km} km`
}
