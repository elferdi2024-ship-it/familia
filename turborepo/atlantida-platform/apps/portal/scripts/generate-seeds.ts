/**
 * 🌱 Property Seed Generator
 * Generates 50 curated properties for Barrio.uy and writes to seeds/properties.json
 * Usage: npx tsx scripts/generate-seeds.ts
 */
import { writeFileSync, mkdirSync } from "fs"
import { resolve } from "path"

const IMG = "https://images.unsplash.com/photo-"
const imgs = {
    apt: [`${IMG}1522708323590-d24dbb6b0267?w=800&h=600&fit=crop`, `${IMG}1502672260266-1c1ef2d93688?w=800&h=600&fit=crop`, `${IMG}1560448204771-d5118743ea68?w=800&h=600&fit=crop`, `${IMG}1493809842364-78f73bb4b3f4?w=800&h=600&fit=crop`],
    casa: [`${IMG}1564013799919-ab6b3850b5b4?w=800&h=600&fit=crop`, `${IMG}1600596542815-ffad4c1539a9?w=800&h=600&fit=crop`, `${IMG}1600585154340-be6161a56a0c?w=800&h=600&fit=crop`, `${IMG}1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop`],
    premium: [`${IMG}1600607687939-ce8a6c25118c?w=800&h=600&fit=crop`, `${IMG}1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop`, `${IMG}1600573472556-e8d173de1d21?w=800&h=600&fit=crop`, `${IMG}1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop`],
    local: [`${IMG}1497366216548-37526070297c?w=800&h=600&fit=crop`, `${IMG}1497366811353-6870744d04b2?w=800&h=600&fit=crop`, `${IMG}1524758631624-e2822e304c36?w=800&h=600&fit=crop`],
    terreno: [`${IMG}1500382017468-9049fed747ef?w=800&h=600&fit=crop`, `${IMG}1628624747186-a941c476b7ef?w=800&h=600&fit=crop`],
}

// Neighborhood coordinates (real Uruguay)
const geo: Record<string, { lat: number; lng: number }> = {
    // Montevideo
    "Cordón": { lat: -34.9058, lng: -56.1735 },
    "Centro": { lat: -34.9060, lng: -56.1882 },
    "La Blanqueada": { lat: -34.8890, lng: -56.1590 },
    "Tres Cruces": { lat: -34.8932, lng: -56.1712 },
    "Pocitos Nuevo": { lat: -34.9175, lng: -56.1510 },
    "Pocitos": { lat: -34.9210, lng: -56.1560 },
    "Malvín": { lat: -34.9100, lng: -56.1140 },
    "Punta Carretas": { lat: -34.9270, lng: -56.1600 },
    "Buceo": { lat: -34.9120, lng: -56.1310 },
    "Parque Rodó": { lat: -34.9170, lng: -56.1680 },
    "Ciudad Vieja": { lat: -34.9068, lng: -56.2020 },
    "Palermo": { lat: -34.9100, lng: -56.1800 },
    "Aguada": { lat: -34.8980, lng: -56.1850 },
    "Prado": { lat: -34.8750, lng: -56.1850 },
    "Carrasco": { lat: -34.8830, lng: -56.0550 },
    // Ciudad de la Costa (Canelones)
    "Solymar": { lat: -34.8330, lng: -55.9530 },
    "Lagomar": { lat: -34.8280, lng: -55.9720 },
    "Shangrilá": { lat: -34.8290, lng: -55.9350 },
    "El Pinar": { lat: -34.8160, lng: -55.9120 },
    "Marindia": { lat: -34.8030, lng: -55.8580 },
    "San José de Carrasco": { lat: -34.8480, lng: -55.9850 },
    "Médanos de Solymar": { lat: -34.8240, lng: -55.9450 },
    "Parque Carrasco": { lat: -34.8550, lng: -55.9980 },
    // Canelones Interior
    "Las Piedras": { lat: -34.7280, lng: -56.2200 },
    "Colón": { lat: -34.7700, lng: -56.2400 },
    "La Paz": { lat: -34.7640, lng: -56.2280 },
    "Barros Blancos": { lat: -34.7520, lng: -56.1900 },
    "Canelones ciudad": { lat: -34.5380, lng: -56.2780 },
    // Costa de Oro
    "Atlántida": { lat: -34.7720, lng: -55.7580 },
    "Parque del Plata": { lat: -34.7580, lng: -55.7230 },
    "La Floresta": { lat: -34.7470, lng: -55.6850 },
    "Salinas": { lat: -34.7880, lng: -55.8220 },
    // Maldonado
    "Punta del Este": { lat: -34.9560, lng: -54.9360 },
    "Maldonado ciudad": { lat: -34.9090, lng: -54.9610 },
    "Piriápolis": { lat: -34.8640, lng: -55.2750 },
    "Manantiales": { lat: -34.9240, lng: -54.8620 },
    "La Barra": { lat: -34.9380, lng: -54.8770 },
}

const jitter = () => (Math.random() - 0.5) * 0.008

const amenitySets = {
    basic: ["Aire Acondicionado", "Calefacción"],
    mid: ["Aire Acondicionado", "Calefacción", "Terraza / Balcón", "Ascensor", "Lavadero"],
    full: ["Garage / Cochera", "Seguridad 24hs", "Piscina", "Parrillero", "Gimnasio", "Aire Acondicionado", "Terraza / Balcón", "Ascensor"],
    house: ["Garage / Cochera", "Parrillero", "Jardín", "Aire Acondicionado", "Calefacción", "Lavadero"],
    premium: ["Garage / Cochera", "Seguridad 24hs", "Piscina", "Parrillero", "Gimnasio", "Aire Acondicionado", "Losa Radiante", "Terraza / Balcón", "Ascensor", "Acepta Mascotas"],
}

const util = {
    standard: { saneamiento: "conectado", gas: "cañería", agua: "OSE", electricidad: "UTE" },
    supergas: { saneamiento: "conectado", gas: "supergas", agua: "OSE", electricidad: "UTE" },
    mixto: { saneamiento: "conectado", gas: "cañería", agua: "OSE", electricidad: "mixto" },
}

interface Prop {
    title: string; slug: string; description: string; type: string; operation: string
    price: number; currency: string; pricePerM2: number; gastosComunes: number | null
    bedrooms: number; bathrooms: number; area: number; garages: number
    department: string; city: string; neighborhood: string; address: string
    geolocation: { lat: number; lng: number }; viviendaPromovida: boolean
    acceptedGuarantees: string[]; utilityStatus: any; energyLabel: string | null
    images: string[]; amenities: string[]; badge?: string; badgeColor?: string
    views: number; featured: boolean; status: string
}

function slug(t: string) { return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") }

const properties: Prop[] = []

// ── BATCH 1: 20x Cordón/Centro (alquileres $25k-$32k focus) ──
const cordonCentro = [
    { t: "Monoambiente luminoso en Cordón Sur", n: "Cordón", op: "Alquiler", p: 25000, c: "UYU", bed: 0, bath: 1, area: 32, gar: 0, gc: 4500, vp: true, el: "C", am: "basic", addr: "Colonia 1845", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "1 dormitorio reciclado en Cordón", n: "Cordón", op: "Alquiler", p: 28000, c: "UYU", bed: 1, bath: 1, area: 45, gar: 0, gc: 5200, vp: true, el: "B", am: "mid", addr: "Guayabos 1720", g: ["ANDA", "CGN", "Porto Seguro", "Sura"] },
    { t: "2 dormitorios con balcón en Cordón", n: "Cordón", op: "Alquiler", p: 32000, c: "UYU", bed: 2, bath: 1, area: 58, gar: 0, gc: 6800, vp: true, el: "B", am: "mid", addr: "Fernández Crespo 1950", g: ["ANDA", "CGN"] },
    { t: "Apto a estrenar Cordón Norte", n: "Cordón", op: "Alquiler", p: 30000, c: "UYU", bed: 1, bath: 1, area: 42, gar: 0, gc: 5000, vp: true, el: "A", am: "mid", addr: "Magallanes 1638", g: ["ANDA", "CGN", "Porto Seguro", "Sura", "Mapfre"] },
    { t: "Studio moderno calle Tristán Narvaja", n: "Cordón", op: "Alquiler", p: 26000, c: "UYU", bed: 0, bath: 1, area: 28, gar: 0, gc: 3800, vp: false, el: "D", am: "basic", addr: "Tristán Narvaja 1755", g: ["ANDA", "CGN"] },
    { t: "2 dorm amplio cerca de la Universidad", n: "Cordón", op: "Venta", p: 145000, c: "USD", bed: 2, bath: 1, area: 65, gar: 0, gc: 7200, vp: true, el: "B", am: "mid", addr: "Eduardo Acevedo 1432" },
    { t: "1 dormitorio con renta en Centro", n: "Centro", op: "Venta", p: 98000, c: "USD", bed: 1, bath: 1, area: 38, gar: 0, gc: 4000, vp: true, el: "C", am: "basic", addr: "18 de Julio 1020" },
    { t: "Apartamento 2 dorm Plaza Cagancha", n: "Centro", op: "Alquiler", p: 27000, c: "UYU", bed: 2, bath: 1, area: 55, gar: 0, gc: 5500, vp: false, el: "D", am: "basic", addr: "Plaza Cagancha 1340", g: ["ANDA", "Depósito"] },
    { t: "Monoambiente ideal inversión Centro", n: "Centro", op: "Venta", p: 78000, c: "USD", bed: 0, bath: 1, area: 30, gar: 0, gc: 3500, vp: true, el: "B", am: "basic", addr: "Rondeau 1515" },
    { t: "1 dormitorio Vivienda Promovida Cordón", n: "Cordón", op: "Venta", p: 125000, c: "USD", bed: 1, bath: 1, area: 48, gar: 0, gc: 5800, vp: true, el: "A", am: "mid", addr: "Jackson 1280" },
    { t: "Local comercial sobre 18 de Julio", n: "Centro", op: "Alquiler", p: 45000, c: "UYU", bed: 0, bath: 1, area: 65, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "18 de Julio 890", type: "Local Comercial" },
    { t: "Oficina equipada en Centro", n: "Centro", op: "Alquiler", p: 38000, c: "UYU", bed: 0, bath: 1, area: 40, gar: 0, gc: 6000, vp: false, el: "C", am: "basic", addr: "Andes 1365", type: "Oficina" },
    { t: "3 dormitorios familiar Cordón", n: "Cordón", op: "Alquiler", p: 35000, c: "UYU", bed: 3, bath: 2, area: 85, gar: 0, gc: 8500, vp: false, el: "C", am: "mid", addr: "Canelones 1815", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "Penthouse con terraza Cordón Sur", n: "Cordón", op: "Venta", p: 215000, c: "USD", bed: 2, bath: 2, area: 90, gar: 1, gc: 9500, vp: true, el: "A", am: "full", addr: "Constituyente 1685" },
    { t: "Monoambiente amoblado Centro", n: "Centro", op: "Alquiler Temporal", p: 850, c: "USD", bed: 0, bath: 1, area: 25, gar: 0, gc: null, vp: false, el: "C", am: "basic", addr: "Ciudadela 1220" },
    { t: "1 dorm a pasos de la Intendencia", n: "Centro", op: "Alquiler", p: 24000, c: "UYU", bed: 1, bath: 1, area: 40, gar: 0, gc: 4200, vp: false, el: "D", am: "basic", addr: "San José 1105", g: ["ANDA", "Depósito"] },
    { t: "2 dorm reciclaje integral Cordón", n: "Cordón", op: "Venta", p: 168000, c: "USD", bed: 2, bath: 1, area: 62, gar: 0, gc: 6500, vp: true, el: "B", am: "mid", addr: "Gaboto 1530" },
    { t: "Apto con garage Cordón", n: "Cordón", op: "Venta", p: 185000, c: "USD", bed: 2, bath: 2, area: 72, gar: 1, gc: 7800, vp: true, el: "A", am: "full", addr: "Paysandú 1150" },
    { t: "Local gastronómico en Ciudad Vieja", n: "Ciudad Vieja", op: "Alquiler", p: 55000, c: "UYU", bed: 0, bath: 2, area: 120, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Sarandí 280", type: "Local Comercial", g: ["Depósito"] },
    { t: "1 dorm luminoso Palermo", n: "Palermo", op: "Alquiler", p: 26500, c: "UYU", bed: 1, bath: 1, area: 42, gar: 0, gc: 4800, vp: false, el: "C", am: "mid", addr: "Gonzalo Ramírez 1780", g: ["ANDA", "CGN", "Porto Seguro"] },
]

cordonCentro.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Cordón"]
    const isRent = p.op === "Alquiler" || p.op === "Alquiler Temporal"
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. Ubicado en ${n}, ${p.addr}. ${p.vp ? "Vivienda Promovida bajo Ley 18.795 con exoneración tributaria." : ""} Ideal para ${isRent ? "inquilinos" : "inversores"} que buscan la mejor relación precio-calidad en ${n}.`,
        type: (p as any).type || "Apartamento", operation: p.op, price: p.p, currency: p.c,
        pricePerM2: pm2, gastosComunes: p.gc, bedrooms: p.bed, bathrooms: p.bath,
        area: p.area, garages: p.gar, department: "Montevideo", city: "Montevideo",
        neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.standard, energyLabel: p.el,
        images: (p as any).type === "Local Comercial" || (p as any).type === "Oficina" ? imgs.local : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        views: Math.floor(Math.random() * 200) + 20,
        featured: false, status: "active",
    })
})

// ── BATCH 2: 15x La Blanqueada/Tres Cruces (VP + inversores) ──
const blanqueada = [
    { t: "2 dorm VP La Blanqueada a estrenar", n: "La Blanqueada", op: "Venta", p: 155000, c: "USD", bed: 2, bath: 1, area: 60, gar: 1, gc: 7000, vp: true, el: "A", am: "full", addr: "Br. Artigas 2340" },
    { t: "1 dorm rentabilidad asegurada VP", n: "La Blanqueada", op: "Venta", p: 115000, c: "USD", bed: 1, bath: 1, area: 44, gar: 0, gc: 5200, vp: true, el: "A", am: "mid", addr: "Rivera 2680" },
    { t: "Monoambiente inversor La Blanqueada", n: "La Blanqueada", op: "Venta", p: 88000, c: "USD", bed: 0, bath: 1, area: 33, gar: 0, gc: 3800, vp: true, el: "B", am: "basic", addr: "Garibaldi 2520" },
    { t: "3 dorm familiar La Blanqueada", n: "La Blanqueada", op: "Alquiler", p: 38000, c: "UYU", bed: 3, bath: 2, area: 90, gar: 1, gc: 9000, vp: false, el: "C", am: "full", addr: "José L. Terra 2855", g: ["ANDA", "CGN", "Porto Seguro", "Sura"] },
    { t: "2 dorm con balcón Tres Cruces", n: "Tres Cruces", op: "Alquiler", p: 30000, c: "UYU", bed: 2, bath: 1, area: 55, gar: 0, gc: 6200, vp: true, el: "B", am: "mid", addr: "Acevedo Díaz 1420", g: ["ANDA", "CGN"] },
    { t: "1 dorm frente a terminal Tres Cruces", n: "Tres Cruces", op: "Alquiler", p: 26000, c: "UYU", bed: 1, bath: 1, area: 38, gar: 0, gc: 4500, vp: false, el: "C", am: "basic", addr: "Miguelete 1830", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "Penthouse VP con terraza privada", n: "La Blanqueada", op: "Venta", p: 235000, c: "USD", bed: 3, bath: 2, area: 110, gar: 2, gc: 12000, vp: true, el: "A", am: "premium", addr: "Br. Artigas 2580" },
    { t: "Studio Tres Cruces ideal Airbnb", n: "Tres Cruces", op: "Venta", p: 92000, c: "USD", bed: 0, bath: 1, area: 30, gar: 0, gc: 3200, vp: true, el: "B", am: "basic", addr: "Galicia 1265" },
    { t: "2 dorm garage cubierto Tres Cruces", n: "Tres Cruces", op: "Venta", p: 148000, c: "USD", bed: 2, bath: 1, area: 58, gar: 1, gc: 6800, vp: true, el: "B", am: "mid", addr: "Dr. Javier Barrios Amorín 1590" },
    { t: "Casa 3 dorm con jardín La Blanqueada", n: "La Blanqueada", op: "Venta", p: 195000, c: "USD", bed: 3, bath: 2, area: 140, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Joaquín Requena 2720", type: "Casa" },
    { t: "Apto temporal amoblado Tres Cruces", n: "Tres Cruces", op: "Alquiler Temporal", p: 750, c: "USD", bed: 1, bath: 1, area: 40, gar: 0, gc: null, vp: false, el: "C", am: "mid", addr: "Arenal Grande 1340" },
    { t: "2 dorm VP piso alto La Blanqueada", n: "La Blanqueada", op: "Venta", p: 162000, c: "USD", bed: 2, bath: 2, area: 68, gar: 1, gc: 7500, vp: true, el: "A", am: "full", addr: "Garibaldi 2780" },
    { t: "1 dorm amoblado La Blanqueada", n: "La Blanqueada", op: "Alquiler", p: 28000, c: "UYU", bed: 1, bath: 1, area: 40, gar: 0, gc: 5000, vp: true, el: "B", am: "mid", addr: "Br. España 2650", g: ["ANDA", "CGN", "Sura"] },
    { t: "Oficina premium Tres Cruces", n: "Tres Cruces", op: "Alquiler", p: 42000, c: "UYU", bed: 0, bath: 1, area: 50, gar: 0, gc: 7000, vp: false, el: "B", am: "basic", addr: "Arenal Grande 1510", type: "Oficina", g: ["Depósito"] },
    { t: "Garaje doble cubierto Tres Cruces", n: "Tres Cruces", op: "Venta", p: 32000, c: "USD", bed: 0, bath: 0, area: 28, gar: 2, gc: 1500, vp: false, el: null, am: "basic", addr: "Justicia 1680", type: "Garaje o Cochera" },
]

blanqueada.forEach(p => {
    const n = p.n; const g = geo[n] || geo["La Blanqueada"]
    const isRent = p.op === "Alquiler" || p.op === "Alquiler Temporal"
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. Zona ${n}, sobre ${p.addr}. ${p.vp ? "Proyecto Vivienda Promovida — exoneración ITP + IRPF/IRAE por 10 años." : ""} Excelente ubicación con todos los servicios a pasos.`,
        type: tp, operation: p.op, price: p.p, currency: p.c,
        pricePerM2: pm2, gastosComunes: p.gc, bedrooms: p.bed, bathrooms: p.bath,
        area: p.area, garages: p.gar, department: "Montevideo", city: "Montevideo",
        neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.standard, energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Oficina" || tp === "Local Comercial" || tp === "Garaje o Cochera" ? imgs.local : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        views: Math.floor(Math.random() * 200) + 20,
        featured: p.vp && p.c === "USD" && p.p > 150000, status: "active",
    })
})

// ── BATCH 3: 15x Malvín/Pocitos/Premium ──
const premium = [
    { t: "3 dorm premium frente al mar Pocitos", n: "Pocitos", op: "Venta", p: 320000, c: "USD", bed: 3, bath: 2, area: 120, gar: 2, gc: 15000, vp: false, el: "A", am: "premium", addr: "Rambla República del Perú 1250" },
    { t: "Penthouse Pocitos Nuevo vista al río", n: "Pocitos Nuevo", op: "Venta", p: 385000, c: "USD", bed: 3, bath: 3, area: 150, gar: 2, gc: 18000, vp: false, el: "A", am: "premium", addr: "26 de Marzo 3280", badge: "Premium", badgeColor: "bg-amber-500" },
    { t: "2 dorm moderno Pocitos Nuevo", n: "Pocitos Nuevo", op: "Alquiler", p: 42000, c: "UYU", bed: 2, bath: 2, area: 75, gar: 1, gc: 9500, vp: true, el: "A", am: "full", addr: "Benito Blanco 3540", g: ["ANDA", "CGN", "Porto Seguro", "Sura"] },
    { t: "Casa con jardín y piscina Malvín", n: "Malvín", op: "Venta", p: 290000, c: "USD", bed: 3, bath: 2, area: 180, gar: 2, gc: null, vp: false, el: "C", am: "premium", addr: "Amazonas 2640", type: "Casa", badge: "Oportunidad", badgeColor: "bg-green-500" },
    { t: "1 dorm a pasos de la rambla Malvín", n: "Malvín", op: "Alquiler", p: 28000, c: "UYU", bed: 1, bath: 1, area: 45, gar: 0, gc: 5500, vp: false, el: "C", am: "mid", addr: "Orinoco 5180", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "Duplex Punta Carretas con terraza", n: "Punta Carretas", op: "Venta", p: 345000, c: "USD", bed: 3, bath: 2, area: 135, gar: 1, gc: 14000, vp: false, el: "B", am: "premium", addr: "Ellauri 520", badge: "Recién Ingresado", badgeColor: "bg-blue-500" },
    { t: "2 dorm Buceo con vista", n: "Buceo", op: "Venta", p: 198000, c: "USD", bed: 2, bath: 1, area: 68, gar: 1, gc: 7800, vp: true, el: "B", am: "full", addr: "Luis A. de Herrera 3180" },
    { t: "Monoambiente Parque Rodó", n: "Parque Rodó", op: "Alquiler", p: 22000, c: "UYU", bed: 0, bath: 1, area: 28, gar: 0, gc: 3500, vp: false, el: "D", am: "basic", addr: "Pablo de María 1080", g: ["ANDA", "Depósito"] },
    { t: "Casa Carrasco 4 dorm premium", n: "Carrasco", op: "Venta", p: 520000, c: "USD", bed: 4, bath: 3, area: 280, gar: 3, gc: null, vp: false, el: "A", am: "premium", addr: "Av. Bolivia 2680", type: "Casa", badge: "Premium", badgeColor: "bg-amber-500" },
    { t: "2 dorm VP piso alto Buceo", n: "Buceo", op: "Venta", p: 175000, c: "USD", bed: 2, bath: 2, area: 72, gar: 1, gc: 8200, vp: true, el: "A", am: "full", addr: "Rivera 3450" },
    { t: "Loft artístico Parque Rodó", n: "Parque Rodó", op: "Alquiler", p: 30000, c: "UYU", bed: 1, bath: 1, area: 55, gar: 0, gc: 5000, vp: false, el: "C", am: "mid", addr: "Gonzalo Ramírez 2180", g: ["ANDA", "CGN"] },
    { t: "Terreno en Carrasco Norte", n: "Carrasco", op: "Venta", p: 185000, c: "USD", bed: 0, bath: 0, area: 450, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Camino Carrasco 6350", type: "Terreno" },
    { t: "3 dorm Punta Carretas Shopping", n: "Punta Carretas", op: "Alquiler", p: 55000, c: "UYU", bed: 3, bath: 2, area: 95, gar: 1, gc: 11000, vp: false, el: "B", am: "full", addr: "José Ellauri 750", g: ["ANDA", "CGN", "Porto Seguro", "Sura", "Mapfre"] },
    { t: "1 dorm con patio en Malvín", n: "Malvín", op: "Venta", p: 142000, c: "USD", bed: 1, bath: 1, area: 52, gar: 0, gc: 5800, vp: false, el: "C", am: "mid", addr: "Hipólito Yrigoyen 5320" },
    { t: "Alquiler temporal premium Pocitos", n: "Pocitos", op: "Alquiler Temporal", p: 1200, c: "USD", bed: 2, bath: 1, area: 70, gar: 1, gc: null, vp: false, el: "B", am: "full", addr: "Bvar. España 2880" },
]

premium.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Pocitos"]
    const isRent = p.op === "Alquiler" || p.op === "Alquiler Temporal"
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. ${n}, Montevideo — ${p.addr}. ${p.vp ? "Vivienda Promovida Ley 18.795." : ""} Zona residencial premium con excelentes servicios y conectividad.`,
        type: tp, operation: p.op, price: p.p, currency: p.c,
        pricePerM2: pm2, gastosComunes: p.gc, bedrooms: p.bed, bathrooms: p.bath,
        area: p.area, garages: p.gar, department: "Montevideo", city: "Montevideo",
        neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: p.c === "USD" && p.p > 300000 ? util.mixto : util.standard,
        energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Terreno" ? imgs.terreno : p.p > 200000 ? imgs.premium : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        badge: p.badge, badgeColor: p.badgeColor,
        views: Math.floor(Math.random() * 500) + 50,
        featured: !!(p.badge), status: "active",
    })
})

// ── BATCH 4: 15x Ciudad de la Costa (familias, crecimiento urbano) ──
const ciudadCosta = [
    { t: "Casa 3 dorm con jardín Solymar", n: "Solymar", op: "Venta", p: 165000, c: "USD", bed: 3, bath: 2, area: 140, gar: 1, gc: null, vp: false, el: "C", am: "house", addr: "Av. Giannattasio km 24", type: "Casa" },
    { t: "2 dorm a estrenar Lagomar", n: "Lagomar", op: "Venta", p: 128000, c: "USD", bed: 2, bath: 1, area: 65, gar: 1, gc: 5500, vp: true, el: "B", am: "mid", addr: "Av. de las Américas 8540" },
    { t: "Casa 4 dorm con piscina Shangrilá", n: "Shangrilá", op: "Venta", p: 220000, c: "USD", bed: 4, bath: 2, area: 200, gar: 2, gc: null, vp: false, el: "C", am: "premium", addr: "Av. Shangrilá 3280", type: "Casa", badge: "Oportunidad", badgeColor: "bg-green-500" },
    { t: "1 dorm moderno El Pinar", n: "El Pinar", op: "Alquiler", p: 22000, c: "UYU", bed: 1, bath: 1, area: 42, gar: 0, gc: 3800, vp: false, el: "C", am: "basic", addr: "Ruta Interbalnearia km 28", g: ["ANDA", "CGN"] },
    { t: "Terreno 500m² Marindia", n: "Marindia", op: "Venta", p: 45000, c: "USD", bed: 0, bath: 0, area: 500, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle 21 y Rambla", type: "Terreno" },
    { t: "2 dorm familiar Solymar Norte", n: "Solymar", op: "Alquiler", p: 25000, c: "UYU", bed: 2, bath: 1, area: 60, gar: 1, gc: 4500, vp: false, el: "C", am: "mid", addr: "Camino Picasso 1250", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "Casa reciclada Médanos de Solymar", n: "Médanos de Solymar", op: "Venta", p: 145000, c: "USD", bed: 2, bath: 1, area: 95, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Calle de los Cisnes 340", type: "Casa" },
    { t: "Duplex San José de Carrasco", n: "San José de Carrasco", op: "Venta", p: 185000, c: "USD", bed: 3, bath: 2, area: 130, gar: 2, gc: 7000, vp: false, el: "B", am: "full", addr: "Av. Italia y Camino de las Tropas" },
    { t: "Monoambiente Parque Carrasco", n: "Parque Carrasco", op: "Alquiler", p: 18000, c: "UYU", bed: 0, bath: 1, area: 30, gar: 0, gc: 3000, vp: false, el: "D", am: "basic", addr: "Av. Giannattasio km 19", g: ["ANDA", "Depósito"] },
    { t: "Casa 3 dorm Lagomar Sur", n: "Lagomar", op: "Alquiler", p: 32000, c: "UYU", bed: 3, bath: 1, area: 110, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Rambla Costanera 4580", type: "Casa", g: ["ANDA", "CGN", "Porto Seguro"] },
    { t: "Local comercial Solymar centro", n: "Solymar", op: "Alquiler", p: 28000, c: "UYU", bed: 0, bath: 1, area: 55, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Av. Giannattasio km 23.5", type: "Local Comercial", g: ["Depósito"] },
    { t: "2 dorm VP El Pinar Norte", n: "El Pinar", op: "Venta", p: 108000, c: "USD", bed: 2, bath: 1, area: 55, gar: 0, gc: 4200, vp: true, el: "B", am: "mid", addr: "Ruta Interbalnearia km 29" },
    { t: "Casa quinta Marindia", n: "Marindia", op: "Venta", p: 175000, c: "USD", bed: 3, bath: 2, area: 250, gar: 2, gc: null, vp: false, el: "D", am: "premium", addr: "Camino del Indio 580", type: "Casa" },
    { t: "Terreno 350m² Shangrilá Sur", n: "Shangrilá", op: "Venta", p: 52000, c: "USD", bed: 0, bath: 0, area: 350, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle 10 entre 27 y 29", type: "Terreno" },
    { t: "1 dorm amoblado Solymar playa", n: "Solymar", op: "Alquiler Temporal", p: 550, c: "USD", bed: 1, bath: 1, area: 40, gar: 0, gc: null, vp: false, el: "C", am: "mid", addr: "Rambla Rep. de México 820" },
]

ciudadCosta.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Solymar"]
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. ${n}, Ciudad de la Costa, Canelones. ${p.addr}. ${p.vp ? "Vivienda Promovida Ley 18.795." : ""} Zona en pleno crecimiento a minutos de Montevideo.`,
        type: tp, operation: p.op, price: p.p, currency: p.c, pricePerM2: pm2, gastosComunes: p.gc,
        bedrooms: p.bed, bathrooms: p.bath, area: p.area, garages: p.gar,
        department: "Canelones", city: "Ciudad de la Costa", neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.supergas, energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Terreno" ? imgs.terreno : tp === "Local Comercial" ? imgs.local : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        badge: (p as any).badge, badgeColor: (p as any).badgeColor,
        views: Math.floor(Math.random() * 150) + 15, featured: !!(p as any).badge, status: "active",
    })
})

// ── BATCH 5: 10x Canelones Interior (precio accesible, primera vivienda) ──
const canelones = [
    { t: "Casa 2 dorm Las Piedras centro", n: "Las Piedras", op: "Venta", p: 85000, c: "USD", bed: 2, bath: 1, area: 80, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Av. Artigas 520", type: "Casa" },
    { t: "3 dorm familiar Las Piedras", n: "Las Piedras", op: "Alquiler", p: 20000, c: "UYU", bed: 3, bath: 1, area: 100, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Rivera 1340", type: "Casa", g: ["ANDA", "CGN"] },
    { t: "Terreno 600m² Colón", n: "Colón", op: "Venta", p: 38000, c: "USD", bed: 0, bath: 0, area: 600, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Ruta 1 km 18", type: "Terreno" },
    { t: "1 dorm económico La Paz", n: "La Paz", op: "Alquiler", p: 15000, c: "UYU", bed: 1, bath: 1, area: 38, gar: 0, gc: 2500, vp: false, el: "D", am: "basic", addr: "Av. César Mayo Gutiérrez 880", g: ["ANDA", "Depósito"] },
    { t: "Casa 3 dorm con garage Colón", n: "Colón", op: "Venta", p: 95000, c: "USD", bed: 3, bath: 1, area: 110, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Camino Colón 2450", type: "Casa" },
    { t: "Local comercial Las Piedras", n: "Las Piedras", op: "Alquiler", p: 18000, c: "UYU", bed: 0, bath: 1, area: 45, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "18 de Mayo 640", type: "Local Comercial", g: ["Depósito"] },
    { t: "Casa nueva Barros Blancos", n: "Barros Blancos", op: "Venta", p: 78000, c: "USD", bed: 2, bath: 1, area: 75, gar: 1, gc: null, vp: false, el: "C", am: "house", addr: "Ruta 8 km 22", type: "Casa" },
    { t: "2 dorm Canelones ciudad", n: "Canelones ciudad", op: "Alquiler", p: 16000, c: "UYU", bed: 2, bath: 1, area: 55, gar: 0, gc: 3000, vp: false, el: "D", am: "basic", addr: "Av. Suárez 450", g: ["ANDA", "Depósito"] },
    { t: "Casa 4 dorm gran terreno La Paz", n: "La Paz", op: "Venta", p: 110000, c: "USD", bed: 4, bath: 2, area: 160, gar: 2, gc: null, vp: false, el: "D", am: "house", addr: "Camino La Paz 1820", type: "Casa" },
    { t: "Terreno 800m² Barros Blancos", n: "Barros Blancos", op: "Venta", p: 28000, c: "USD", bed: 0, bath: 0, area: 800, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Ruta 8 km 24.5", type: "Terreno" },
]

canelones.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Las Piedras"]
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. ${n}, Canelones. ${p.addr}. Zona residencial accesible con buena conectividad hacia Montevideo.`,
        type: tp, operation: p.op, price: p.p, currency: p.c, pricePerM2: pm2, gastosComunes: p.gc,
        bedrooms: p.bed, bathrooms: p.bath, area: p.area, garages: p.gar,
        department: "Canelones", city: n, neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.supergas, energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Terreno" ? imgs.terreno : tp === "Local Comercial" ? imgs.local : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        views: Math.floor(Math.random() * 80) + 10, featured: false, status: "active",
    })
})

// ── BATCH 6: 12x Costa de Oro (temporal + residencial) ──
const costaOro = [
    { t: "Casa frente al mar Atlántida", n: "Atlántida", op: "Venta", p: 195000, c: "USD", bed: 3, bath: 2, area: 150, gar: 1, gc: null, vp: false, el: "C", am: "premium", addr: "Rambla Dr. P. Williman 1250", type: "Casa", badge: "Frente al Mar", badgeColor: "bg-cyan-500" },
    { t: "2 dorm céntrico Atlántida", n: "Atlántida", op: "Alquiler", p: 20000, c: "UYU", bed: 2, bath: 1, area: 58, gar: 0, gc: 4000, vp: false, el: "D", am: "mid", addr: "Calle 3 y Av. Argentina", g: ["ANDA", "CGN"] },
    { t: "Cabaña Parque del Plata", n: "Parque del Plata", op: "Alquiler Temporal", p: 450, c: "USD", bed: 2, bath: 1, area: 55, gar: 0, gc: null, vp: false, el: "D", am: "house", addr: "Calle del Diálogo 380", type: "Casa" },
    { t: "Terreno 400m² La Floresta", n: "La Floresta", op: "Venta", p: 42000, c: "USD", bed: 0, bath: 0, area: 400, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle 13 entre A y B", type: "Terreno" },
    { t: "Casa 3 dorm Salinas centro", n: "Salinas", op: "Venta", p: 155000, c: "USD", bed: 3, bath: 2, area: 130, gar: 1, gc: null, vp: false, el: "C", am: "house", addr: "Av. Artigas 780", type: "Casa" },
    { t: "1 dorm temporal Atlántida playa", n: "Atlántida", op: "Alquiler Temporal", p: 400, c: "USD", bed: 1, bath: 1, area: 35, gar: 0, gc: null, vp: false, el: "D", am: "basic", addr: "Calle 1 y Rambla" },
    { t: "Local comercial Atlántida centro", n: "Atlántida", op: "Alquiler", p: 22000, c: "UYU", bed: 0, bath: 1, area: 50, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle 2 y Av. Argentina", type: "Local Comercial", g: ["Depósito"] },
    { t: "Casa con jardín Parque del Plata", n: "Parque del Plata", op: "Venta", p: 125000, c: "USD", bed: 2, bath: 1, area: 90, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Calle del Arroyo 220", type: "Casa" },
    { t: "Terreno 600m² Salinas Norte", n: "Salinas", op: "Venta", p: 35000, c: "USD", bed: 0, bath: 0, area: 600, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle Nube 4, Salinas Norte", type: "Terreno" },
    { t: "Apartamento 1 dorm La Floresta", n: "La Floresta", op: "Alquiler", p: 18000, c: "UYU", bed: 1, bath: 1, area: 42, gar: 0, gc: 2500, vp: false, el: "C", am: "basic", addr: "Ruta 35 km 2", g: ["ANDA", "CGN"] },
    { t: "Casa alpina Parque del Plata", n: "Parque del Plata", op: "Venta", p: 98000, c: "USD", bed: 2, bath: 1, area: 75, gar: 1, gc: null, vp: false, el: "D", am: "house", addr: "Calle 24 y la playa", type: "Casa" },
    { t: "Local frente a plaza Atlántida", n: "Atlántida", op: "Alquiler", p: 35000, c: "UYU", bed: 0, bath: 1, area: 80, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Calle 11 y Av. Rivera", type: "Local Comercial" },
]

costaOro.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Atlántida"]
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. ${n}, Costa de Oro, Canelones. ${p.addr}. Zona balnearia con excelente potencial turístico y residencial.`,
        type: tp, operation: p.op, price: p.p, currency: p.c, pricePerM2: pm2, gastosComunes: p.gc,
        bedrooms: p.bed, bathrooms: p.bath, area: p.area, garages: p.gar,
        department: "Canelones", city: n, neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.supergas, energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Terreno" ? imgs.terreno : tp === "Local Comercial" ? imgs.local : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        badge: (p as any).badge, badgeColor: (p as any).badgeColor,
        views: Math.floor(Math.random() * 120) + 20, featured: !!(p as any).badge, status: "active",
    })
})

// ── BATCH 7: 13x Maldonado / Punta del Este (turismo + inversión) ──
const maldonado = [
    { t: "Penthouse Punta del Este frente al mar", n: "Punta del Este", op: "Venta", p: 450000, c: "USD", bed: 3, bath: 3, area: 160, gar: 2, gc: 22000, vp: false, el: "A", am: "premium", addr: "Rambla Gral. Artigas Parada 5", badge: "Premium", badgeColor: "bg-amber-500" },
    { t: "2 dorm Punta del Este Península", n: "Punta del Este", op: "Venta", p: 285000, c: "USD", bed: 2, bath: 2, area: 85, gar: 1, gc: 14000, vp: false, el: "B", am: "full", addr: "Calle 20 y Gorlero" },
    { t: "Apto temporal Punta del Este", n: "Punta del Este", op: "Alquiler Temporal", p: 1800, c: "USD", bed: 2, bath: 1, area: 70, gar: 1, gc: null, vp: false, el: "B", am: "full", addr: "Av. Gorlero 980" },
    { t: "Casa 4 dorm La Barra premium", n: "La Barra", op: "Venta", p: 520000, c: "USD", bed: 4, bath: 3, area: 250, gar: 2, gc: null, vp: false, el: "B", am: "premium", addr: "Ruta 10 km 162", type: "Casa", badge: "Premium", badgeColor: "bg-amber-500" },
    { t: "Loft Manantiales con vista", n: "Manantiales", op: "Venta", p: 340000, c: "USD", bed: 2, bath: 2, area: 95, gar: 1, gc: 12000, vp: false, el: "A", am: "premium", addr: "Ruta 10 km 165" },
    { t: "2 dorm centro Maldonado", n: "Maldonado ciudad", op: "Alquiler", p: 22000, c: "UYU", bed: 2, bath: 1, area: 55, gar: 0, gc: 4500, vp: false, el: "D", am: "mid", addr: "18 de Julio 840", g: ["ANDA", "CGN"] },
    { t: "Casa Piriápolis con vista al cerro", n: "Piriápolis", op: "Venta", p: 165000, c: "USD", bed: 3, bath: 2, area: 130, gar: 1, gc: null, vp: false, el: "C", am: "house", addr: "Calle Tucumán 520", type: "Casa" },
    { t: "1 dorm temporal Piriápolis centro", n: "Piriápolis", op: "Alquiler Temporal", p: 500, c: "USD", bed: 1, bath: 1, area: 38, gar: 0, gc: null, vp: false, el: "D", am: "basic", addr: "Rambla de los Argentinos 1450" },
    { t: "Terreno 700m² Manantiales", n: "Manantiales", op: "Venta", p: 150000, c: "USD", bed: 0, bath: 0, area: 700, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Ruta 10 km 164.5", type: "Terreno" },
    { t: "3 dorm familiar Maldonado ciudad", n: "Maldonado ciudad", op: "Venta", p: 145000, c: "USD", bed: 3, bath: 2, area: 95, gar: 1, gc: 7000, vp: false, el: "C", am: "full", addr: "Av. Roosevelt 3280" },
    { t: "Local gastronómico Punta del Este", n: "Punta del Este", op: "Alquiler", p: 85000, c: "UYU", bed: 0, bath: 2, area: 100, gar: 0, gc: null, vp: false, el: null, am: "basic", addr: "Av. Gorlero 650", type: "Local Comercial", g: ["Depósito"] },
    { t: "Studio Punta del Este inversión", n: "Punta del Este", op: "Venta", p: 175000, c: "USD", bed: 0, bath: 1, area: 40, gar: 0, gc: 8000, vp: false, el: "B", am: "mid", addr: "Calle 28 y Gorlero" },
    { t: "Apartamento 3 dorm Beverly Hills", n: "Punta del Este", op: "Alquiler", p: 3500, c: "USD", bed: 3, bath: 3, area: 140, gar: 2, gc: 25000, vp: false, el: "A", am: "premium", addr: "Av. Laureano Alonsopérez", g: ["Depósito", "Sura"] },
]

maldonado.forEach(p => {
    const n = p.n; const g = geo[n] || geo["Punta del Este"]
    const pm2 = p.c === "USD" ? Math.round(p.p / p.area) : Math.round((p.p / 42) / p.area)
    const tp = (p as any).type || "Apartamento"
    properties.push({
        title: p.t, slug: slug(p.t), description: `${p.t}. ${n}, Maldonado. ${p.addr}. Zona turística premium con alta demanda de alquiler temporal e inversión.`,
        type: tp, operation: p.op, price: p.p, currency: p.c, pricePerM2: pm2, gastosComunes: p.gc,
        bedrooms: p.bed, bathrooms: p.bath, area: p.area, garages: p.gar,
        department: "Maldonado", city: n === "Maldonado ciudad" ? "Maldonado" : n, neighborhood: n, address: p.addr,
        geolocation: { lat: g.lat + jitter(), lng: g.lng + jitter() },
        viviendaPromovida: p.vp, acceptedGuarantees: p.g || [],
        utilityStatus: util.standard, energyLabel: p.el,
        images: tp === "Casa" ? imgs.casa : tp === "Terreno" ? imgs.terreno : tp === "Local Comercial" ? imgs.local : p.p > 300000 ? imgs.premium : imgs.apt,
        amenities: amenitySets[p.am as keyof typeof amenitySets],
        badge: (p as any).badge, badgeColor: (p as any).badgeColor,
        views: Math.floor(Math.random() * 300) + 30, featured: !!(p as any).badge, status: "active",
    })
})

// Write
const outDir = resolve(__dirname, "../seeds")
mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, "properties.json")
writeFileSync(outPath, JSON.stringify(properties, null, 2), "utf-8")

console.log(`\n🌱 Generated ${properties.length} properties → seeds/properties.json`)
console.log(`   • Cordón/Centro: 20`)
console.log(`   • La Blanqueada/Tres Cruces: 15`)
console.log(`   • Malvín/Pocitos/Premium: 15`)
console.log(`   • Ciudad de la Costa: 15`)
console.log(`   • Canelones Interior: 10`)
console.log(`   • Costa de Oro: 12`)
console.log(`   • Maldonado/Punta del Este: 13\n`)

