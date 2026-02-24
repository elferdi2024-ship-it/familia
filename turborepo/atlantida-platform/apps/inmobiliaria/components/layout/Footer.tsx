import Link from "next/link"

export function Footer() {
    return (
        <footer id="contacto" className="bg-white dark:bg-background-dark border-t border-primary/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <img src="/logo-mibarrio-alpha.png" alt="MiBarrio.uy" className="h-10 w-auto object-contain mix-blend-multiply" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            MiBarrio.uy Soluciones Inmobiliarias. Líderes en el mercado inmobiliario uruguayo. Conectando personas con su lugar ideal.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <span className="material-icons text-xl">facebook</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <span className="material-icons text-xl">camera_alt</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <span className="material-icons text-xl">alternate_email</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Explorar</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/search">Venta</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/search">Alquiler</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/servicios">Servicios</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/proyectos">Proyectos</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Empresa</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/nosotros">Sobre Nosotros</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/#contacto">Contacto</Link></li>
                            <li>
                                <Link className="hover:text-primary transition-colors flex items-center gap-2" href="/blog">
                                    Blog Inmobiliario
                                    <span className="px-1.5 py-0.5 bg-primary text-white text-[8px] font-black rounded-md animate-pulse">NUEVO</span>
                                </Link>
                            </li>
                            <li><Link className="hover:text-primary transition-colors" href="/invertir">Invertir</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-sm text-slate-500 font-medium mb-6">Recibe las mejores ofertas y tendencias del mercado en tu email.</p>
                        <div className="flex gap-2">
                            <input className="bg-primary/5 border-none rounded-xl w-full text-sm font-medium focus:ring-1 focus:ring-primary px-4" placeholder="Tu email" type="email" />
                            <button className="bg-primary text-white w-12 h-12 rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                                <span className="material-icons text-sm">send</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            © {new Date().getFullYear()} MIBARRIO.UY SOLUCIONES INMOBILIARIAS - TODOS LOS DERECHOS RESERVADOS
                        </p>
                        <p className="text-[9px] font-bold text-slate-400/60 uppercase tracking-tighter">
                            Desarrollado con <span className="text-red-500/50">❤️</span> por <span className="text-primary/60">Facundo Fernández</span>
                        </p>
                    </div>
                    <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link className="hover:text-primary" href="/privacidad">Privacidad</Link>
                        <Link className="hover:text-primary" href="/terminos-y-condiciones">Términos</Link>
                        <Link className="hover:text-primary" href="/privacidad">Cookies</Link>
                    </div>
                </div>

                {/* LARGE BOTTOM LOGO */}
                <div className="mt-20 flex justify-center items-center w-full select-none pointer-events-none">
                    <img
                        src="/mibarrio-ok-large.png"
                        alt="MiBarrio.uy"
                        className="w-full max-w-5xl h-auto object-contain dark:brightness-0 dark:invert opacity-20 dark:opacity-40 grayscale transition-all duration-700 hover:grayscale-0 hover:opacity-100"
                    />
                </div>
            </div>
        </footer>
    )
}
