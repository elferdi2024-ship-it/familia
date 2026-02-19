const fs = require('fs');
const path = require('path');

// --- CONFIGURACIÓN DE REGLAS ---
const rules = [
    {
        name: "Meta Tag Obsoleto (PWA)",
        pattern: /apple-mobile-web-app-capable/,
        message: "❌ Error: Usa 'mobile-web-app-capable' en lugar de la versión de Apple. Revisa layout.tsx o head.tsx.",
        files: ['.html', '.tsx', '.jsx', '.js']
    },
    {
        name: "Google Maps Deprecado",
        pattern: /(google\.maps\.Marker\(|MarkerF\s|new google\.maps\.Marker\()/,
        message: "⚠️ Alerta: Estás usando Marker o MarkerF (legacy). Migra a AdvancedMarkerElement para evitar warnings.",
        files: ['.tsx', '.jsx', '.js', '.ts']
    },
    {
        name: "Middleware Incompleto",
        check: (content, filename) => {
            if (!filename.includes('middleware')) return false;
            // Check for matcher config but missing webp/avif/svg/jpg/jpeg in negative lookahead if using that pattern
            // The pattern usually looks like: '/((?!_next/static|_next/image|favicon.ico|...)'
            // We want to ensure at least webp, svg, png, jpg/jpeg are covered if a matcher exists and looks like an exclusion list
            const matcherRegex = /matcher:\s*\[\s*['"`].*?\?\!.*?\)\s*['"`]\s*\]/s;
            if (matcherRegex.test(content)) {
                // If we have a matcher with negative lookahead, check if it includes modern formats
                return !content.match(/webp|avif|svg/) || !content.match(/jpg|jpeg|png/);
            }
            return false;
        },
        message: "❌ Error: El matcher del middleware no incluye extensiones modernas (webp, avif, svg...).",
        files: ['middleware.ts', 'middleware.js']
    },
    {
        name: "Logs de Consola Olvidados",
        pattern: /console\.log\(/,
        message: "⚠️ Warning: Se detectaron console.log. Límpialos antes de producción (o usa logger/debug).",
        files: ['.tsx', '.jsx', '.js', '.ts']
    },
    {
        name: "TODOs Pendientes",
        pattern: /\/\/\s*TODO:/,
        message: "⚠️ Warning: Hay comentarios TODO pendientes. Revisa si bloquean el deploy.",
        files: ['.tsx', '.jsx', '.js', '.ts']
    },
    {
        name: "Ubicación del Manifest",
        check: () => !fs.existsSync(path.join(__dirname, 'public/manifest.json')),
        message: "❌ Error: No se encuentra manifest.json en /public. Esto causará el error 401/404.",
        global: true
    }
];

// --- LÓGICA DE ESCANEO ---
function scanFiles(dir) {
    const files = fs.readdirSync(dir);
    let hasErrors = false;

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!['node_modules', '.next', '.git', '.firebase'].includes(file)) {
                if (scanFiles(filePath)) hasErrors = true;
            }
        } else {
            // Exclude validation scripts themselves to avoid false positives
            if (file === 'validate-deploy.js' || file === 'pre-check.js') return;

            const ext = path.extname(file);
            // Scan each file against relevant rules
            rules.forEach(rule => {
                // Skip global rules in file loop
                if (rule.global) return;

                if (rule.files && (rule.files.includes(ext) || rule.files.includes(file))) {
                    const content = fs.readFileSync(filePath, 'utf8');

                    let failed = false;
                    if (rule.pattern && rule.pattern.test(content)) failed = true;
                    if (rule.check && rule.check(content, file)) failed = true;

                    if (failed) {
                        console.log(`\n[${rule.name}] en ${filePath}`);
                        console.log(rule.message);
                        // Treat console.log and TODO as warnings (don't fail build strictly unless requested, but script says exit 1 if errors found)
                        if (rule.message.startsWith("❌")) {
                            hasErrors = true;
                        } else {
                            console.log("   (Es un warning, no bloquea deploy pero requiere atención)");
                            // Warnings don't set hasErrors = true for blocking deploy, 
                            // UNLESS we want strict mode. User asked "detendrá el proceso".
                            // But usually TODOs shouldn't block build unless strict. 
                            // Let's adhere to the message prefix: Error vs Warning.
                        }
                    }
                }
            });
        }
    });
    return hasErrors;
}

// Global checks
console.log("🔍 Iniciando validación basada en la Guía de Errores...");
let globalErrors = false;
rules.forEach(r => {
    if (r.global && r.check) {
        if (r.check()) {
            console.log(`\n[${r.name}]`);
            console.log(r.message);
            if (r.message.startsWith("❌")) globalErrors = true;
        }
    }
})

const fileErrors = scanFiles('.');

if (globalErrors || fileErrors) {
    console.log("\n🛑 Validación fallida con ERRORES CRÍTICOS. Corrige los puntos arriba.");
    process.exit(1);
} else {
    console.log("\n✅ ¡Todo limpio! El código cumple con la Guía de Despliegue.");
    process.exit(0);
}
