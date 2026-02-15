"use client"

import Link from "next/link"

export default function ComparePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased max-w-7xl mx-auto px-4 md:px-6 pb-12">
            {/* Breadcrumbs & Title */}
            <div className="mb-6 md:mb-8">
                <nav className="flex text-xs text-slate-500 mb-2 gap-2">
                    <Link className="hover:underline" href="/">Inicio</Link>
                    <span>/</span>
                    <Link className="hover:underline" href="/search">Búsqueda</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-slate-200">Comparar Propiedades</span>
                </nav>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Comparación Detallada</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Analiza hasta 3 propiedades seleccionadas de Montevideo y Punta del Este.</p>
            </div>

            {/* Comparison Container */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-border-light dark:border-slate-800 overflow-hidden mb-12">
                <div className="overflow-x-auto -mx-4 md:mx-0">
                    <table className="w-full border-collapse min-w-[700px]">
                        {/* Property Header Cards Row */}
                        <thead>
                            <tr className="align-top">
                                <th className="label-column p-6 text-left border-b border-border-light dark:border-slate-800 bg-neutral-light dark:bg-slate-800/50 w-[180px] sticky top-0 z-10">
                                    <div className="pt-2">
                                        <Link href="/search" className="text-primary hover:text-blue-700 flex items-center gap-1 text-sm font-semibold">
                                            <span className="material-icons text-sm">add_circle</span>
                                            Agregar más
                                        </Link>
                                    </div>
                                </th>
                                {/* Property 1 */}
                                <th className="comparison-column p-4 border-b border-border-light dark:border-slate-800 relative group sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <button className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 p-1 rounded-full shadow-sm transition-all z-10">
                                        <span className="material-icons text-sm">close</span>
                                    </button>
                                    <div className="mb-4 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Modern high-end apartment with large glass terrace" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsacGgoQFnkg6FJcRTxUucp0zLnMeTxnhGEFrhhd_WOzCzqV1GpLhAo8R0PzFVyiHPFkmGpQJralYZ-VH6ppHk02l25JMOCKMmHaUI5Ct6yBAuU6st4XUTC3ZjM2z3oNKiCarUXRs4bmqH-hvdpBloltfjeMUpyDATPoNlagoXw0ZVnZFTkQWBIxGMbW6pGHyGvG2kolNufIgpQyXDjddfwFw73okWeqNxgu1Ss0A0GVIOMuXKz08wL_YnyNX7sdT-bQw0KvDcwSG7" />
                                    </div>
                                    <div className="text-left px-2">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Apartamento</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Edificio Gala Pop, Pocitos</h3>
                                        <div className="mt-2 text-2xl font-bold text-primary tracking-tight font-display">USD 345.000</div>
                                    </div>
                                </th>
                                {/* Property 2 */}
                                <th className="comparison-column p-4 border-b border-border-light dark:border-slate-800 relative group sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <button className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 p-1 rounded-full shadow-sm transition-all z-10">
                                        <span className="material-icons text-sm">close</span>
                                    </button>
                                    <div className="mb-4 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Luxury beachfront property with panoramic ocean view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiRbhaejrFJm1g9vALpmQmm-KhP37yfwiH-GA1oxDS6nQI8UNtshE97ruf5Dyf_rx5C6dYKYQFxndc6xfmv43_Ql6dDhAUg0websrB7RzL-YSlopdJm9-rUd9_8_H2EdKVBTz76A2KR3eQ9VLu-h8JQ2JHD6ScW_mNa6tnvtWKGhkhK7VtA_dLK3LwVIUtfhIC5ZmYfbh8cthhVUpTLBj-pnkm9G83ZpRDoYNoJ29yFiRM8zjIhSydHbupZ8P_GenwPZZK3rsFNlak" />
                                    </div>
                                    <div className="text-left px-2">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Penthouse</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Forum Puerto del Buceo</h3>
                                        <div className="mt-2 text-2xl font-bold text-primary tracking-tight font-display">USD 890.000</div>
                                    </div>
                                </th>
                                {/* Property 3 */}
                                <th className="comparison-column p-4 border-b border-border-light dark:border-slate-800 relative group sticky top-0 bg-white dark:bg-slate-900 z-10">
                                    <button className="absolute top-2 right-2 bg-white/90 hover:bg-white text-slate-400 hover:text-red-500 p-1 rounded-full shadow-sm transition-all z-10">
                                        <span className="material-icons text-sm">close</span>
                                    </button>
                                    <div className="mb-4 aspect-[4/3] rounded-lg overflow-hidden bg-slate-100">
                                        <img className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" alt="Elegant apartment building in residential area" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpRKlyW87x_AW53_SzzlqId24GWO6-m3sN_jB7M8wwNT6GEK88zqDpiBQQgy-lpftg4XNtMOy5KreOruzeI3QodNJ-KO676JP_iyhEcZWEruUwhtBdqKue3H_OxfABRgGaL5PSEx7w4AxjS8gY6oAbdFUczcbDODeqD0z7Xsf0KJ6uAuauAxZEXKFMj-F2KWvUffw9ahwWlCsIoDj32NK0vi12YkhUPX_Gk0Ks-vhKwfV3ziJoW-sIAdpYBCHpbonT-qLl7fxu0-CS" />
                                    </div>
                                    <div className="text-left px-2">
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">Apartamento</span>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">Joy MVD, Tres Cruces</h3>
                                        <div className="mt-2 text-2xl font-bold text-primary tracking-tight font-display">USD 215.000</div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        {/* Financial Data Rows */}
                        <tbody>
                            <tr className="bg-neutral-light/50 dark:bg-slate-800/30">
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Precio / m²</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">USD 4.107 <span className="text-xs text-slate-400 font-normal">/ m²</span></td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">USD 5.114 <span className="text-xs text-slate-400 font-normal">/ m²</span></td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">USD 3.257 <span className="text-xs text-slate-400 font-normal">/ m²</span></td>
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Gastos Comunes</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">UYU 12.500 <span className="text-xs text-slate-400 font-normal">/ mes</span></td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">UYU 45.800 <span className="text-xs text-slate-400 font-normal">/ mes</span></td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">UYU 8.900 <span className="text-xs text-slate-400 font-normal">/ mes</span></td>
                            </tr>
                            {/* Specs Rows */}
                            <tr className="bg-neutral-light/50 dark:bg-slate-800/30">
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Dormitorios</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">2 Dormitorios</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">3 Dormitorios</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">1 Dormitorio</td>
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Baños</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">2 Baños</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">4 Baños (3 en suite)</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">1 Baño</td>
                            </tr>
                            <tr className="bg-neutral-light/50 dark:bg-slate-800/30">
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Superficie Total</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">84 m²</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">174 m²</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">66 m²</td>
                            </tr>
                            <tr>
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Año Construcción</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">2019</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">2017</td>
                                <td className="p-6 text-base font-medium border-b border-border-light dark:border-slate-800">2022 (Estrenar)</td>
                            </tr>
                            {/* Amenities */}
                            <tr className="bg-neutral-light/50 dark:bg-slate-800/30">
                                <td className="p-4 pl-6 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide border-b border-border-light dark:border-slate-800">Amenities Clave</td>
                                <td className="p-6 border-b border-border-light dark:border-slate-800">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">directions_car</span> Garaje (1)</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">security</span> Vigilancia 24hs</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">deck</span> Terraza c/Parrillero</div>
                                    </div>
                                </td>
                                <td className="p-6 border-b border-border-light dark:border-slate-800">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">directions_car</span> Garaje Doble</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">security</span> Seguridad Prosegur</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">pool</span> Piscina Propia</div>
                                    </div>
                                </td>
                                <td className="p-6 border-b border-border-light dark:border-slate-800">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-slate-300 dark:text-slate-700 text-base">directions_car</span> No incluye garaje</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">security</span> Portería Inteligente</div>
                                        <div className="flex items-center gap-2 text-sm"><span className="material-icons text-primary text-base">fitness_center</span> Gym de última gen.</div>
                                    </div>
                                </td>
                            </tr>
                            {/* WhatsApp Action Buttons Row */}
                            <tr>
                                <td className="p-4 pl-6 bg-neutral-light/50 dark:bg-slate-800/30"></td>
                                <td className="p-6">
                                    <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.512-2.961-2.628-.086-.117-.718-.953-.718-1.816 0-.862.453-1.286.613-1.454.16-.169.347-.211.463-.211.117 0 .234.001.336.005.11.004.256-.041.401.308.16.388.547 1.332.594 1.428.047.097.078.211.014.34-.064.129-.096.211-.191.321-.096.111-.202.248-.288.334-.097.098-.198.204-.085.399.113.194.502.827 1.08 1.342.744.664 1.372.871 1.566.968.194.098.308.081.421-.049.113-.131.483-.563.612-.756.129-.193.258-.162.436-.097.178.065 1.125.531 1.319.628.193.097.323.146.37.227.046.082.046.474-.098.879zM12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1z"></path></svg>
                                        WhatsApp
                                    </button>
                                </td>
                                <td className="p-6">
                                    <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.512-2.961-2.628-.086-.117-.718-.953-.718-1.816 0-.862.453-1.286.613-1.454.16-.169.347-.211.463-.211.117 0 .234.001.336.005.11.004.256-.041.401.308.16.388.547 1.332.594 1.428.047.097.078.211.014.34-.064.129-.096.211-.191.321-.096.111-.202.248-.288.334-.097.098-.198.204-.085.399.113.194.502.827 1.08 1.342.744.664 1.372.871 1.566.968.194.098.308.081.421-.049.113-.131.483-.563.612-.756.129-.193.258-.162.436-.097.178.065 1.125.531 1.319.628.193.097.323.146.37.227.046.082.046.474-.098.879zM12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1z"></path></svg>
                                        WhatsApp
                                    </button>
                                </td>
                                <td className="p-6">
                                    <button className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.512-2.961-2.628-.086-.117-.718-.953-.718-1.816 0-.862.453-1.286.613-1.454.16-.169.347-.211.463-.211.117 0 .234.001.336.005.11.004.256-.041.401.308.16.388.547 1.332.594 1.428.047.097.078.211.014.34-.064.129-.096.211-.191.321-.096.111-.202.248-.288.334-.097.098-.198.204-.085.399.113.194.502.827 1.08 1.342.744.664 1.372.871 1.566.968.194.098.308.081.421-.049.113-.131.483-.563.612-.756.129-.193.258-.162.436-.097.178.065 1.125.531 1.319.628.193.097.323.146.37.227.046.082.046.474-.098.879zM12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1z"></path></svg>
                                        WhatsApp
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Additional Info / Tip */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 md:p-6 flex gap-3 md:gap-4">
                <span className="material-icons text-primary">info</span>
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-blue-100">Consejo del experto</h4>
                    <p className="text-slate-600 dark:text-blue-200/70 text-sm mt-1 leading-relaxed">Al comparar apartamentos en Montevideo, ten en cuenta que los "Gastos Comunes" pueden variar significativamente según los servicios centrales y el tipo de calefacción. No olvides consultar si la propiedad cuenta con tributos domiciliarios incluidos.</p>
                </div>
            </div>
        </div>
    )
}
