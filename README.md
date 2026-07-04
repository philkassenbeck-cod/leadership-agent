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
2. Ajoutez ces **trois** variables :
   - `ANTHROPIC_API_KEY` : votre clé API (commence par `sk-ant-...`)
   - `ACCESS_PASSWORD` : votre mot de passe maître (accès complet + génération de codes)
   - `AUTH_SECRET` : une chaîne aléatoire secrète. Générez-la avec `openssl rand -hex 32`
3. Cliquez **Save**
4. Allez dans **Deployments** → cliquez les 3 points → **Redeploy**

> ⚠️ Sans `ACCESS_PASSWORD` et `AUTH_SECRET`, l'application reste verrouillée (aucune connexion possible). C'est voulu : l'accès est protégé par défaut.

---

### Accès et codes à durée limitée

- **Vous (coach)** : connectez-vous avec `ACCESS_PASSWORD`. Vous avez alors accès au bouton **🔑 Codes d'accès** en haut à droite.
- **Vos clients** : dans ce panneau, choisissez une durée (ex. 7 jours) et générez un **code**. Donnez-le au client : il pourra se connecter jusqu'à la date d'expiration, puis le code cessera de fonctionner automatiquement.
- Les codes sont signés cryptographiquement (aucune base de données). Ils ne sont pas révocables avant leur expiration — choisissez une durée courte pour les accès ponctuels.

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
│   │   ├── analyze/
│   │   │   └── route.js     ← API sécurisée (clé Anthropic côté serveur)
│   │   └── auth/            ← login / logout / session / generate (codes)
│   ├── globals.css
│   ├── layout.js
│   └── page.js              ← Interface principale + porte d'authentification
├── lib/
│   └── auth.js              ← signature/vérification des sessions et codes (HMAC)
├── middleware.js           ← protège /api/analyze (401 sans session valide)
├── package.json
├── next.config.js
└── .env.example
```

## Fonctionnalités

- **Accès protégé** : mot de passe maître + codes d'accès à durée limitée pour les clients
- **Mode Individuel** : top 5 / top 10 → rapport structuré → chat
- **Mode Équipe** : jusqu'à 15 membres → analyse collective → chat
- **Trilingue** : FR / DE / EN
- **Autocomplete** des 34 thèmes CliftonStrengths
- **Sécurisé** : clé API jamais exposée au navigateur ; débrief généré par Claude Sonnet 5
