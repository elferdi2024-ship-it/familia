"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

const BANKS = [
    { name: "BROU", rate: 6.5, maxYears: 25, maxPercent: 80 },
    { name: "Santander", rate: 7.0, maxYears: 25, maxPercent: 80 },
    { name: "Itau", rate: 7.2, maxYears: 25, maxPercent: 80 },
    { name: "Scotiabank", rate: 6.8, maxYears: 25, maxPercent: 80 },
    { name: "BBVA", rate: 7.5, maxYears: 20, maxPercent: 70 },
]

function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 100 / 12
    const n = years * 12
    if (monthlyRate === 0) return principal / n
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
}

export function MortgageCalculatorClient() {
    const [propertyPrice, setPropertyPrice] = useState(200000)
    const [downPaymentPercent, setDownPaymentPercent] = useState(20)
    const [years, setYears] = useState(20)
    const [selectedBankIdx, setSelectedBankIdx] = useState(0)

    const bank = BANKS[selectedBankIdx]
    const downPayment = propertyPrice * (downPaymentPercent / 100)
    const loanAmount = propertyPrice - downPayment

    const results = useMemo(() => {
        return BANKS.map(b => {
            const monthly = calculateMonthlyPayment(loanAmount, b.rate, Math.min(years, b.maxYears))
            const totalPaid = monthly * Math.min(years, b.maxYears) * 12
            const totalInterest = totalPaid - loanAmount
            return { ...b, monthly, totalPaid, totalInterest }
        })
    }, [loanAmount, years])

    const selected = results[selectedBankIdx]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link href="/" className="text-sm text-primary font-bold hover:underline mb-4 inline-block">&larr; Volver al inicio</Link>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
                        Calculadora de Hipoteca
                    </h1>
                    <p className="text-slate-500 max-w-2xl">
                        Simula tu cuota mensual de prestamo hipotecario con tasas referenciales de bancos uruguayos. Los valores son estimativos.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Inputs */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border p-6 space-y-6 h-fit">
                        <div>
                            <label htmlFor="property-price" className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                                Precio de la propiedad (USD)
                            </label>
                            <input
                                id="property-price"
                                type="range"
                                min={30000}
                                max={1000000}
                                step={5000}
                                value={propertyPrice}
                                onChange={(e) => setPropertyPrice(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                            <div className="text-2xl font-black text-primary mt-1">
                                USD {propertyPrice.toLocaleString()}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="down-payment" className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                                Adelanto: {downPaymentPercent}% (USD {downPayment.toLocaleString()})
                            </label>
                            <input
                                id="down-payment"
                                type="range"
                                min={10}
                                max={60}
                                step={5}
                                value={downPaymentPercent}
                                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <div>
                            <label htmlFor="loan-years" className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">
                                Plazo: {years} anos
                            </label>
                            <input
                                id="loan-years"
                                type="range"
                                min={5}
                                max={25}
                                step={1}
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="w-full accent-primary"
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Monto del prestamo</div>
                            <div className="text-xl font-black text-slate-900 dark:text-white">
                                USD {loanAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Selected bank highlight */}
                        <div className="bg-primary text-white rounded-2xl p-6">
                            <div className="text-sm font-bold opacity-80 mb-1">Tu cuota mensual estimada ({selected.name})</div>
                            <div className="text-4xl md:text-5xl font-black">
                                USD {Math.round(selected.monthly).toLocaleString()}
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <div className="opacity-70">Tasa anual</div>
                                    <div className="font-bold">{selected.rate}%</div>
                                </div>
                                <div>
                                    <div className="opacity-70">Total a pagar</div>
                                    <div className="font-bold">USD {Math.round(selected.totalPaid).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="opacity-70">Intereses</div>
                                    <div className="font-bold">USD {Math.round(selected.totalInterest).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Bank comparison */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden">
                            <div className="p-4 border-b">
                                <h3 className="font-bold text-slate-900 dark:text-white">Comparar bancos</h3>
                            </div>
                            <div className="divide-y">
                                {results.map((r, i) => (
                                    <button
                                        key={r.name}
                                        onClick={() => setSelectedBankIdx(i)}
                                        className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${i === selectedBankIdx ? "bg-primary/5 border-l-4 border-primary" : ""}`}
                                    >
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{r.name}</div>
                                            <div className="text-xs text-slate-500">Tasa {r.rate}% - Max {r.maxYears} anos</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-primary text-lg">USD {Math.round(r.monthly).toLocaleString()}</div>
                                            <div className="text-xs text-slate-400">/mes</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                            <strong>Nota:</strong> Las tasas son referenciales (Feb 2026) y pueden variar. Consulta directamente con cada banco para obtener una cotizacion personalizada.
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border p-6 text-center">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Ya sabes cuanto podes pagar?
                    </h3>
                    <p className="text-slate-500 mb-4">Busca propiedades dentro de tu presupuesto.</p>
                    <Link
                        href={`/search?priceMax=${propertyPrice}`}
                        className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                        Buscar Propiedades hasta USD {propertyPrice.toLocaleString()}
                    </Link>
                </div>
            </div>
        </div>
    )
}
