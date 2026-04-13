# Leadership Agent — StrengthsFinder

Agent de debrief StrengthsFinder individuel et équipe, trilingue (FR / DE / EN).

---

## Déploiement sur Vercel (5 minutes)

### Étape 1 — Prérequis
- Un compte [GitHub](https://github.com) (gratuit)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Votre clé API Anthropic → [console.anthropic.com](https://console.anthropic.com)

---

### Étape 2 — Mettre le code sur GitHub

1. Allez sur [github.com/new](https://github.com/new)
2. Créez un repo nommé `leadership-agent` (privé recommandé)
3. Uploadez tous les fichiers de ce dossier dans le repo

---

### Étape 3 — Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com) → **Add New Project**
2. Importez votre repo GitHub `leadership-agent`
3. Vercel détecte automatiquement Next.js → cliquez **Deploy**

---

### Étape 4 — Ajouter la clé API (IMPORTANT)

Sans cette étape, l'agent ne fonctionne pas.

1. Dans Vercel → votre projet → **Settings** → **Environment Variables**
2. Ajoutez :
   - **Name** : `ANTHROPIC_API_KEY`
   - **Value** : votre clé API (commence par `sk-ant-...`)
3. Cliquez **Save**
4. Allez dans **Deployments** → cliquez les 3 points → **Redeploy**

---

### Étape 5 — Partager

Vercel vous donne une URL du type :
```
https://leadership-agent-xxx.vercel.app
```

Partagez cette URL à qui vous voulez. La clé API reste sécurisée côté serveur, personne ne la voit.

---

## Structure du projet

```
leadership-agent/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js     ← API sécurisée (clé Anthropic côté serveur)
│   ├── globals.css
│   ├── layout.js
│   └── page.js              ← Interface principale
├── package.json
├── next.config.js
└── .env.example
```

## Fonctionnalités

- **Mode Individuel** : top 5 / top 10 → rapport structuré → chat
- **Mode Équipe** : N membres → analyse collective → chat
- **Trilingue** : FR / DE / EN
- **Autocomplete** des 34 thèmes CliftonStrengths
- **Sécurisé** : clé API jamais exposée au navigateur
