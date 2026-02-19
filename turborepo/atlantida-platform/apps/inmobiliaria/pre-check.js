const fs = require('fs');
const path = require('path');

const checks = [
    {
        name: "Meta Tags Obsoletos",
        pattern: /apple-mobile-web-app-capable/,
        message: "❌ Error: Sigues usando 'apple-mobile-web-app-capable'. Cámbialo por 'mobile-web-app-capable'."
    },
    {
        name: "Google Maps Legacy",
        pattern: /google\.maps\.Marker\(/,
        // Note: We also check for MarkerF from react-google-maps-api used without AdvancedMarkerElement context if possible, 
        // but the regex mainly targets direct usage or imports that might suggest legacy.
        // Adjusting regex to be broader or more specific as needed. 
        // Since we use @react-google-maps/api, looking for Marker or MarkerF might trigger this.
        // Let's stick to the user's specific pattern first, but maybe add MarkerF warning.
        pattern: /(google\.maps\.Marker\(|MarkerF\s)/,
        message: "⚠️ Warning: Estás usando marcadores antiguos (google.maps.Marker o MarkerF). Migra a AdvancedMarkerElement."
    },
    {
        name: "Ubicación del Manifest",
        check: () => !fs.existsSync(path.join(__dirname, 'public/manifest.json')),
        message: "❌ Error: No se encuentra manifest.json en /public. Esto causará el error 401/404."
    }
];

// Helper to look for strings in files
function searchInDir(dir, pattern, excludeDirs = ['node_modules', '.next', '.git']) {
    let results = false;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                if (searchInDir(filePath, pattern, excludeDirs)) results = true;
            }
        } else {
            if (/\.(js|jsx|ts|tsx)$/.test(file)) {
                const content = fs.readFileSync(filePath, 'utf8');
                if (pattern.test(content)) {
                    console.log(`   Found in: ${filePath}`);
                    results = true;
                }
            }
        }
    }
    return results;
}

console.log("🚀 Iniciando validación pre-deploy...");
let errors = 0;

checks.forEach(check => {
    let failed = false;
    if (check.check) {
        if (check.check()) failed = true;
    } else if (check.pattern) {
        // Search in src or app or components
        // Assuming Next.js struct
        const dirsToCheck = ['app', 'components', 'src'];
        for (const d of dirsToCheck) {
            if (fs.existsSync(path.join(__dirname, d))) {
                if (searchInDir(path.join(__dirname, d), check.pattern)) failed = true;
            }
        }
    }

    if (failed) {
        console.error(check.message);
        errors++;
    }
});

if (errors > 0) {
    console.log(`❌ Validación fallida con ${errors} errores.`);
    process.exit(1);
} else {
    console.log("✅ Todo se ve en orden.");
}
