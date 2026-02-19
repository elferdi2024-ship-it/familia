import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGETS = ['apps/portal', 'apps/inmobiliaria', 'packages/ui'];

const REPLACEMENTS = [
    // UI Components inside apps
    {
        regex: /from\s+["']@\/components\/ui\/[^"']+["']/g,
        replacement: 'from "@repo/ui"'
    },
    // cn in UI package
    {
        regex: /from\s+["']@\/lib\/utils["']/g,
        replacement: 'from "@repo/lib/utils"'
    },
    // Lib - Firebase
    {
        regex: /from\s+["']@\/lib\/firebase["']/g,
        replacement: 'from "@repo/lib/firebase"'
    },
    // Lib - Algolia
    {
        regex: /from\s+["']@\/lib\/algolia["']/g,
        replacement: 'from "@repo/lib/algolia"'
    },
    {
        regex: /from\s+["']@\/lib\/algolia-client["']/g,
        replacement: 'from "@repo/lib/algolia"'
    },
    // Lib - SEO Content (local file)
    {
        regex: /from\s+["']@\/lib\/seo-content["']/g,
        replacement: 'from "@repo/lib/seo"'
    },
    // Lib - Tracking
    {
        regex: /from\s+["']@\/lib\/tracking["']/g,
        replacement: 'from "@repo/lib/tracking"'
    },
    // Lib - Utils
    {
        regex: /from\s+["']@\/lib\/utils["']/g,
        replacement: 'from "@repo/lib/utils"'
    },
    // Lib - Mail
    {
        regex: /from\s+["']@\/lib\/mail["']/g,
        replacement: 'from "@repo/lib/mail"'
    },
    // Lib - Validations
    {
        regex: /from\s+["']@\/lib\/validations([^"']*)["']/g,
        replacement: 'from "@repo/lib/validations$1"'
    }
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    for (const r of REPLACEMENTS) {
        content = content.replace(r.regex, r.replacement);
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                walk(fullPath);
            }
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

for (const target of TARGETS) {
    const targetPath = path.join(ROOT, target);
    if (fs.existsSync(targetPath)) {
        console.log(`Processing ${targetPath}...`);
        walk(targetPath);
    }
}

console.log('Migration complete!');
