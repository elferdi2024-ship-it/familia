import sys

# Inmobiliaria Navbar
path1 = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\inmobiliaria\components\layout\Navbar.tsx'
with open(path1, "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace('href="#contacto"', 'href="/#contacto"')
text = text.replace('className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-primary/10 shadow-2xl animate-in slide-in-from-top duration-300"', 'className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-primary/10 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[calc(100vh-80px)] overflow-y-auto"')
with open(path1, "w", encoding="utf-8") as f:
    f.write(text)

# Portal Navbar
path2 = r'd:\INMOBILIARIA\turborepo\atlantida-platform\apps\portal\components\layout\Navbar.tsx'
with open(path2, "r", encoding="utf-8") as f:
    text = f.read()
text = text.replace('href="#contacto"', 'href="/#contacto"')
text = text.replace('className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300"', 'className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[calc(100vh-80px)] overflow-y-auto"')
with open(path2, "w", encoding="utf-8") as f:
    f.write(text)
print("Done!")
