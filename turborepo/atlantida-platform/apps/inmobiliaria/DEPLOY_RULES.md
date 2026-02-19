# Desplegar Firestore Security Rules

Para aplicar las reglas de seguridad en Firebase:

```bash
firebase deploy --only firestore:rules
```

Requiere tener Firebase CLI instalado y el proyecto configurado:

```bash
npm install -g firebase-tools
firebase login
firebase use <tu-project-id>
```
