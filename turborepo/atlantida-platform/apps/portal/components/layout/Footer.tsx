import Link from "next/link"
import { Facebook, Instagram, AtSign, Send } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-primary/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <img src="/logo-barrio-alpha.png" alt="Barrio.uy" className="h-10 w-auto object-contain mix-blend-multiply" />
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Barrio.uy Soluciones Inmobiliarias. Líderes en el mercado inmobiliario uruguayo. Conectando personas con su lugar ideal.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Link className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <Facebook className="w-4 h-4" />
                            </Link>
                            <Link className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <Instagram className="w-4 h-4" />
                            </Link>
                            <Link className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="/" target="_blank">
                                <AtSign className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-xs">Explorar</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/search">Venta</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/search">Alquiler</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/servicios">Servicios</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/inmobiliarias">Inmobiliarias</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/barrio">Todos los Barrios</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-xs">Barrios Populares</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/barrio/pocitos">Pocitos</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/barrio/punta-carretas">Punta Carretas</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/barrio/cordon">Cordón</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/barrio/carrasco">Carrasco</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/barrio/punta-del-este">Punta del Este</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-xs">Empresa</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/nosotros">Sobre Nosotros</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/#contacto">Contacto</Link></li>
                            <li>
                                <Link className="hover:text-primary transition-colors flex items-center gap-2" href="/blog">
                                    Blog Inmobiliario
                                    <span className="px-1.5 py-0.5 bg-primary text-white text-[8px] font-semibold rounded-md animate-pulse">NUEVO</span>
                                </Link>
                            </li>
                            <li><Link className="hover:text-primary transition-colors" href="/invertir">Invertir</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6 text-xs">Newsletter</h4>
                        <p className="text-sm text-slate-500 font-medium mb-6">Recibe las mejores ofertas y tendencias del mercado en tu email.</p>
                        <div className="flex gap-2">
                            <input className="bg-primary/5 border-none rounded-xl w-full text-sm font-medium focus:ring-1 focus:ring-primary px-4" placeholder="Tu email" type="email" />
                            <button className="bg-primary text-white w-12 h-12 rounded-lg flex items-center justify-center hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col items-center md:items-start gap-1">
                        <p className="text-[10px] font-semibold text-slate-400">
                            © {new Date().getFullYear()} Barrio.uy SOLUCIONES INMOBILIARIAS - TODOS LOS DERECHOS RESERVADOS
                        </p>
                        <p className="text-[9px] font-semibold text-slate-400/60">
                            Desarrollado con <span className="text-red-500/50">❤️</span> por <span className="text-primary/60">Facundo Fernández</span>
                        </p>
                    </div>
                    <div className="flex gap-6 text-[10px] font-semibold text-slate-400">
                        <Link className="hover:text-primary" href="/privacidad">Privacidad</Link>
                        <Link className="hover:text-primary" href="/terminos-y-condiciones">Términos</Link>
                        <Link className="hover:text-primary" href="/aviso-legal">Aviso Legal</Link>
                        <Link className="hover:text-primary" href="/privacidad">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
