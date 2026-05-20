// Correspondance des 34 thèmes CliftonStrengths : noms localisés -> nom anglais
// (le nom anglais est celui utilisé en interne par l'agent et l'autocomplete).
// Couvre le français (rapport Gallup FR) et l'anglais. Les clés sont en minuscules
// sans accent pour une correspondance robuste.

export const STRENGTH_NAME_MAP = {
  // Exécution
  "realisateur": "Achiever", "achiever": "Achiever",
  "arrangeur": "Arranger", "arranger": "Arranger",
  "conviction": "Belief", "belief": "Belief",
  "equitable": "Consistency", "consistency": "Consistency",
  "prudent": "Deliberative", "deliberative": "Deliberative",
  "discipline": "Discipline",
  "focus": "Focus",
  "responsabilite": "Responsibility", "responsibility": "Responsibility",
  "restaurer": "Restorative", "restorative": "Restorative",

  // Influence
  "activateur": "Activator", "activator": "Activator",
  "autorite": "Command", "command": "Command",
  "communication": "Communication",
  "competition": "Competition",
  "maximisation": "Maximizer", "maximizer": "Maximizer",
  "assurance": "Self-Assurance", "self-assurance": "Self-Assurance",
  "importance": "Significance", "significance": "Significance",
  "charisme": "Woo", "woo": "Woo",

  // Développement des relations
  "adaptabilite": "Adaptability", "adaptability": "Adaptability",
  "connexion": "Connectedness", "connectedness": "Connectedness",
  "developpeur": "Developer", "developer": "Developer",
  "empathie": "Empathy", "empathy": "Empathy",
  "harmonie": "Harmony", "harmony": "Harmony",
  "inclusion": "Includer", "includer": "Includer",
  "individualisation": "Individualization", "individualization": "Individualization",
  "positivite": "Positivity", "positivity": "Positivity",
  "relationnel": "Relator", "relator": "Relator",

  // Réflexion stratégique
  "analyste": "Analytical", "analytical": "Analytical",
  "contexte": "Context", "context": "Context",
  "futuriste": "Futuristic", "futuristic": "Futuristic",
  "ideation": "Ideation",
  "input": "Input",
  "intellectualisme": "Intellection", "intellection": "Intellection",
  "studieux": "Learner", "learner": "Learner",
  "strategique": "Strategic", "strategic": "Strategic",
};

// Normalise un libellé (minuscule, sans accent, sans ponctuation parasite)
// puis renvoie le nom anglais correspondant, ou null si non reconnu.
export function toEnglishStrength(raw) {
  if (!raw) return null;
  const key = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // retire les accents
    .replace(/[®™*().]/g, "")        // retire ®, ™, parenthèses, etc.
    .trim();
  // Si le libellé contient le nom anglais entre parenthèses (ex "ideation"), on l'a déjà.
  return STRENGTH_NAME_MAP[key] || null;
}
