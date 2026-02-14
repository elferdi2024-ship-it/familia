import Link from "next/link"

export function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-primary/10 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="text-2xl font-extrabold tracking-tighter text-primary mb-6">
                            DOMINIO<span className="text-slate-400 font-light">TOTAL</span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Líderes en el mercado inmobiliario uruguayo. Conectando personas con su lugar ideal desde 2010.
                        </p>
                        <div className="flex gap-4 mt-8">
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                                <span className="material-icons text-xl">facebook</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                                <span className="material-icons text-xl">camera_alt</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm" href="#">
                                <span className="material-icons text-xl">alternate_email</span>
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Explorar</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="/search">Venta</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="/search">Alquiler</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Proyectos</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Inmobiliarias</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-xs">Empresa</h4>
                        <ul className="space-y-4 text-sm text-slate-500 font-medium">
                            <li><Link className="hover:text-primary transition-colors" href="#">Sobre Nosotros</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Contacto</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Blog de Noticias</Link></li>
                            <li><Link className="hover:text-primary transition-colors" href="#">Invertir</Link></li>
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} DOMINIO TOTAL URUGUAY - TODOS LOS DERECHOS RESERVADOS
                    </p>
                    <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link className="hover:text-primary" href="#">Privacidad</Link>
                        <Link className="hover:text-primary" href="#">Términos</Link>
                        <Link className="hover:text-primary" href="#">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
