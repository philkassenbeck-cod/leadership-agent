"use client";
import { useState, useRef, useEffect } from "react";
import { OPTIMUP_LOGO, OPTIMUP_LOGO_RATIO } from "./logo";
import { toEnglishStrength } from "./strengthsMap";

const ALL34 = ["Achiever","Activator","Adaptability","Analytical","Arranger","Belief","Command","Communication","Competition","Connectedness","Consistency","Context","Deliberative","Developer","Discipline","Empathy","Focus","Futuristic","Harmony","Ideation","Includer","Individualization","Input","Intellection","Learner","Maximizer","Positivity","Relator","Responsibility","Restorative","Self-Assurance","Significance","Strategic","Woo"];

const DOMAINS = {
  Executing: ["Achiever","Arranger","Belief","Consistency","Deliberative","Discipline","Focus","Responsibility","Restorative"],
  Influencing: ["Activator","Command","Communication","Competition","Maximizer","Self-Assurance","Significance","Woo"],
  Relationship: ["Adaptability","Connectedness","Developer","Empathy","Harmony","Includer","Individualization","Positivity","Relator"],
  Thinking: ["Analytical","Context","Futuristic","Ideation","Input","Intellection","Learner","Strategic"],
};

const LABELS = {
  fr: { identity:"Identité", name:"Nom", role:"Rôle / Poste", top5:"Top 5 forces (obligatoire)", top10:"Forces 6–10 (optionnel)", context:"Contexte", goal:"Objectif du debrief", teamName:"Nom de l'équipe", teamGoal:"Objectif du debrief", teamLeader:"Chef d'équipe", teamLeaderHint:"Cliquez ⭐ sur le membre qui dirige l'équipe", statsByPerson:"Les 5 forces par personne", statsByDomain:"Répartition par domaine de forces", statsRanking:"Classement pondéré des forces", statsPresent:"Talents présents", statsDomainCol:"Domaine", statsSocio:"Synergie et antagonisme (Fauvet)", socioSynergy:"Synergie", socioAntagonism:"Antagonisme", socioNeutral:"Neutre / latence", socioSub:"Cohésion interne (EGO) vs autonomie & ouverture (ECO)", department:"Département / Service", phDepartment:"ex. Marketing, Direction générale, Production...", business:"Nature du métier / secteur", phBusiness:"ex. Luxe, Industrie, Services financiers...", members:"Membres", addMember:"+ Ajouter un membre", analyze:"Analyser →", analyzeTeam:"Analyser l'équipe →", back:"← Nouveau debrief", backTeam:"← Nouvelle analyse", individual:"Individuel", team:"Équipe", headerSub:"Debrief individuel · Saisissez le top 5 ou top 10", headerSubTeam:"Analyse d'équipe · Ajoutez les membres et leurs forces", executing:"Exécution", influencing:"Influence", relationship:"Relation", thinking:"Pensée stratégique", chatPlaceholder:"Approfondissez une force, posez une question...", teamChatPlaceholder:"Posez une question sur la dynamique d'équipe...", goalOptions:[{v:"dev",l:"Développement personnel"},{v:"team",l:"Intégration dans une équipe"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], level:"Niveau de responsabilité", levelOptions:[{v:"leader",l:"Dirigeant·e / leader"},{v:"manager",l:"Manager / encadrant·e"},{v:"ic",l:"Sans responsabilité d'encadrement"}], teamGoalOptions:[{v:"dynamics",l:"Dynamiques d'équipe"},{v:"collab",l:"Améliorer la collaboration"},{v:"blind",l:"Identifier les angles morts"},{v:"perf",l:"Performance collective"}], coachName:"Votre nom (coach)", downloadPdf:"⬇ Télécharger en PDF", downloadWord:"⬇ Télécharger en Word", importPdf:"📄 Glissez votre rapport Gallup ici, ou cliquez", importDrop:"Déposez le PDF ici…", importing:"Lecture du PDF...", importOk:"Forces importées ✓", importErr:"Lecture impossible. Vérifiez que c'est bien le PDF Gallup, ou saisissez à la main.", importTeam:"📄 Glissez jusqu'à 15 rapports Gallup ici, ou cliquez", importTeamDrop:"Déposez les PDF ici…", importingTeam:"Lecture des rapports...", importTeamOk:(n)=>`${n} membre(s) importé(s) ✓`, importTeamErr:"Aucun rapport lisible. Vérifiez que ce sont bien des PDF Gallup.", importTeamMax:"15 rapports maximum.", letterGreeting:(n)=>`Cher(e) ${n},`, letterIntro:"Voici le débrief de tes forces, fruit de notre échange. Prends le temps de le lire, d'y revenir, et de laisser ces mots résonner.", letterClose:"Avec toute ma confiance,", pdfTitle:"Débrief StrengthsFinder", phName:"Prénom Nom", phRole:"ex. CEO, Chef de projet...", phCoach:"ex. Philippe Kassenbeck", phTeam:"ex. Board, Équipe Marketing...", strength:"Force", optional:"optionnel", member:"Membre", analyzing:"Analyse en cours...", errMin3:"Saisissez au moins 3 forces.", errMin2:"Ajoutez au moins 2 membres avec des forces.", errApi:"Erreur API.", errRetry:"Erreur. Réessayez.", authSub:"Accès réservé", authTitle:"Connexion", authPassword:"Mot de passe", authPlaceholder:"Votre mot de passe ou code d'accès", authLogin:"Entrer →", authChecking:"Vérification...", authWrong:"Mot de passe invalide ou expiré.", logout:"Déconnexion", codesBtn:"🔑 Codes d'accès", adminCodes:"Générer un code d'accès", codeDays:"Durée de validité (jours)", generateCode:"Générer le code", copyCode:"Copier", copied:"Copié ✓", codeExpires:"Valable jusqu'au", codeHint:"Donnez ce code à votre client : il pourra se connecter jusqu'à la date d'expiration.", pair:"Binôme", headerSubPair:"Débrief binôme · Analysez l'interaction entre deux personnes", pairRelation:"Nature de la relation", pairRelationOptions:[{v:"peers",l:"Pairs / collègues"},{v:"manager",l:"Manager – collaborateur"},{v:"cofounders",l:"Co-fondateurs / associés"},{v:"transverse",l:"Collaboration transverse"}], analyzePair:"Analyser le binôme →", backPair:"← Nouveau binôme", pairChatPlaceholder:"Posez une question sur la dynamique du binôme...", importPair:"📄 Glissez les 2 rapports Gallup ici, ou cliquez", importPairDrop:"Déposez les 2 PDF ici…", importPairOk:"Binôme importé ✓", importPairErr:"Il faut 2 rapports Gallup lisibles.", statsShared:"Forces communes", statsComplement:"Les deux profils comparés", statsFriction:"Points de friction potentiels", pairNoShared:"Aucune force commune dans les tops — deux profils très différents.", pairNoFriction:"Aucune paire de tension classique détectée.", errPairMin:"Saisissez au moins 3 forces pour chacune des deux personnes.", personA:"Personne A", personB:"Personne B", cnv:"CNV", headerSubCnv:"Outil de résolution de conflit · Communication NonViolente (O·S·B·D)", cnvSituationLabel:"Décrivez la situation", cnvSituationPh:"Racontez les faits et ce que vous ressentez, avec vos mots…", cnvWithLabel:"À qui s'adresse le message", cnvWithPh:"ex. mon associé, un collaborateur, un client… (optionnel)", cnvGoalLabel:"Ce que vous aimeriez", cnvGoalPh:"ce que vous voudriez obtenir de cet échange (optionnel)", analyzeCnv:"Générer le message CNV →", backCnv:"← Nouvelle situation", cnvChatPlaceholder:"Affinez votre message, testez une reformulation…", errCnvMin:"Décrivez d'abord la situation." },
  de: { identity:"Identität", name:"Name", role:"Rolle / Position", top5:"Top 5 Stärken (Pflicht)", top10:"Stärken 6–10 (optional)", context:"Kontext", goal:"Ziel des Debriefs", teamName:"Teamname", teamGoal:"Ziel des Debriefs", teamLeader:"Teamleiter", teamLeaderHint:"Klicken Sie ⭐ beim Mitglied, das das Team leitet", statsByPerson:"Die 5 Stärken pro Person", statsByDomain:"Verteilung nach Stärkenbereich", statsRanking:"Gewichtetes Stärken-Ranking", statsPresent:"Vorhandene Talente", statsDomainCol:"Bereich", statsSocio:"Synergie und Antagonismus (Fauvet)", socioSynergy:"Synergie", socioAntagonism:"Antagonismus", socioNeutral:"Neutral / latent", socioSub:"Innerer Zusammenhalt (EGO) vs. Autonomie & Offenheit (ECO)", department:"Abteilung / Bereich", phDepartment:"z. B. Marketing, Geschäftsführung, Produktion...", business:"Branche / Tätigkeitsbereich", phBusiness:"z. B. Luxus, Industrie, Finanzdienstleistungen...", members:"Mitglieder", addMember:"+ Mitglied hinzufügen", analyze:"Analysieren →", analyzeTeam:"Team analysieren →", back:"← Neues Debrief", backTeam:"← Neue Analyse", individual:"Individuell", team:"Team", headerSub:"Individuelles Debrief · Geben Sie die Top 5 oder Top 10 ein", headerSubTeam:"Teamanalyse · Fügen Sie Mitglieder und Stärken hinzu", executing:"Ausführung", influencing:"Einfluss", relationship:"Beziehung", thinking:"Strategisches Denken", chatPlaceholder:"Vertiefen Sie eine Stärke...", teamChatPlaceholder:"Fragen zur Teamdynamik...", goalOptions:[{v:"dev",l:"Persönliche Entwicklung"},{v:"team",l:"Teamintegration"},{v:"perf",l:"Performance"},{v:"collab",l:"Zusammenarbeit"}], level:"Verantwortungsebene", levelOptions:[{v:"leader",l:"Führungskraft / Leader"},{v:"manager",l:"Manager / Teamleiter"},{v:"ic",l:"Ohne Führungsverantwortung"}], teamGoalOptions:[{v:"dynamics",l:"Teamdynamiken"},{v:"collab",l:"Zusammenarbeit verbessern"},{v:"blind",l:"Blinde Flecken erkennen"},{v:"perf",l:"Kollektive Performance"}], coachName:"Ihr Name (Coach)", downloadPdf:"⬇ Als PDF herunterladen", downloadWord:"⬇ Als Word herunterladen", importPdf:"📄 Gallup-Bericht hierher ziehen oder klicken", importDrop:"PDF hier ablegen…", importing:"PDF wird gelesen...", importOk:"Stärken importiert ✓", importErr:"Lesen nicht möglich. Bitte prüfen Sie das Gallup-PDF oder geben Sie manuell ein.", importTeam:"📄 Bis zu 15 Gallup-Berichte hierher ziehen oder klicken", importTeamDrop:"PDFs hier ablegen…", importingTeam:"Berichte werden gelesen...", importTeamOk:(n)=>`${n} Mitglied(er) importiert ✓`, importTeamErr:"Keine lesbaren Berichte. Bitte prüfen Sie die Gallup-PDFs.", importTeamMax:"Maximal 15 Berichte.", letterGreeting:(n)=>`Liebe(r) ${n},`, letterIntro:"Hier ist das Debrief deiner Stärken, das Ergebnis unseres Gesprächs. Nimm dir Zeit, es zu lesen und nachwirken zu lassen.", letterClose:"Mit vollem Vertrauen,", pdfTitle:"StrengthsFinder Debrief", phName:"Vor- und Nachname", phRole:"z. B. CEO, Projektleiter...", phCoach:"z. B. Philippe Kassenbeck", phTeam:"z. B. Vorstand, Marketing-Team...", strength:"Stärke", optional:"optional", member:"Mitglied", analyzing:"Analyse läuft...", errMin3:"Geben Sie mindestens 3 Stärken ein.", errMin2:"Fügen Sie mindestens 2 Mitglieder mit Stärken hinzu.", errApi:"API-Fehler.", errRetry:"Fehler. Bitte erneut versuchen.", authSub:"Zugang beschränkt", authTitle:"Anmeldung", authPassword:"Passwort", authPlaceholder:"Ihr Passwort oder Zugangscode", authLogin:"Eintreten →", authChecking:"Prüfung...", authWrong:"Passwort ungültig oder abgelaufen.", logout:"Abmelden", codesBtn:"🔑 Zugangscodes", adminCodes:"Zugangscode generieren", codeDays:"Gültigkeitsdauer (Tage)", generateCode:"Code generieren", copyCode:"Kopieren", copied:"Kopiert ✓", codeExpires:"Gültig bis", codeHint:"Geben Sie diesen Code an Ihren Kunden weiter: er kann sich bis zum Ablaufdatum anmelden.", pair:"Duo", headerSubPair:"Duo-Debrief · Analysieren Sie die Interaktion zwischen zwei Personen", pairRelation:"Art der Beziehung", pairRelationOptions:[{v:"peers",l:"Kollegen / auf Augenhöhe"},{v:"manager",l:"Führungskraft – Mitarbeiter"},{v:"cofounders",l:"Mitgründer / Partner"},{v:"transverse",l:"Bereichsübergreifend"}], analyzePair:"Duo analysieren →", backPair:"← Neues Duo", pairChatPlaceholder:"Frage zur Dynamik des Duos...", importPair:"📄 Die 2 Gallup-Berichte hierher ziehen oder klicken", importPairDrop:"Die 2 PDFs hier ablegen…", importPairOk:"Duo importiert ✓", importPairErr:"Es braucht 2 lesbare Gallup-Berichte.", statsShared:"Gemeinsame Stärken", statsComplement:"Beide Profile im Vergleich", statsFriction:"Mögliche Reibungspunkte", pairNoShared:"Keine gemeinsame Stärke in den Tops — zwei sehr unterschiedliche Profile.", pairNoFriction:"Kein klassisches Spannungspaar erkannt.", errPairMin:"Geben Sie für jede der beiden Personen mindestens 3 Stärken ein.", personA:"Person A", personB:"Person B", cnv:"GFK", headerSubCnv:"Konfliktlösungs-Tool · Gewaltfreie Kommunikation (B·G·B·B)", cnvSituationLabel:"Beschreiben Sie die Situation", cnvSituationPh:"Schildern Sie die Fakten und was Sie fühlen, in Ihren Worten…", cnvWithLabel:"An wen richtet sich die Botschaft", cnvWithPh:"z. B. mein Partner, ein Mitarbeiter, ein Kunde… (optional)", cnvGoalLabel:"Was Sie sich wünschen", cnvGoalPh:"was Sie aus diesem Gespräch erreichen möchten (optional)", analyzeCnv:"GFK-Botschaft erstellen →", backCnv:"← Neue Situation", cnvChatPlaceholder:"Verfeinern Sie Ihre Botschaft…", errCnvMin:"Beschreiben Sie zuerst die Situation." },
  en: { identity:"Identity", name:"Name", role:"Role / Position", top5:"Top 5 strengths (required)", top10:"Strengths 6–10 (optional)", context:"Context", goal:"Debrief objective", teamName:"Team name", teamGoal:"Debrief objective", teamLeader:"Team leader", teamLeaderHint:"Click ⭐ on the member who leads the team", statsByPerson:"The 5 strengths per person", statsByDomain:"Distribution by strength domain", statsRanking:"Weighted strengths ranking", statsPresent:"Present talents", statsDomainCol:"Domain", statsSocio:"Synergy and antagonism (Fauvet)", socioSynergy:"Synergy", socioAntagonism:"Antagonism", socioNeutral:"Neutral / latent", socioSub:"Internal cohesion (EGO) vs autonomy & openness (ECO)", department:"Department / Unit", phDepartment:"e.g. Marketing, Executive board, Production...", business:"Business / industry", phBusiness:"e.g. Luxury, Industry, Financial services...", members:"Members", addMember:"+ Add member", analyze:"Analyze →", analyzeTeam:"Analyze team →", back:"← New debrief", backTeam:"← New analysis", individual:"Individual", team:"Team", headerSub:"Individual debrief · Enter top 5 or top 10", headerSubTeam:"Team analysis · Add members and their strengths", executing:"Executing", influencing:"Influencing", relationship:"Relationship", thinking:"Strategic Thinking", chatPlaceholder:"Dive deeper into a strength...", teamChatPlaceholder:"Ask about team dynamics...", goalOptions:[{v:"dev",l:"Personal development"},{v:"team",l:"Team integration"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], level:"Level of responsibility", levelOptions:[{v:"leader",l:"Executive / leader"},{v:"manager",l:"Manager / team lead"},{v:"ic",l:"No management responsibility"}], teamGoalOptions:[{v:"dynamics",l:"Team dynamics"},{v:"collab",l:"Improve collaboration"},{v:"blind",l:"Identify blind spots"},{v:"perf",l:"Collective performance"}], coachName:"Your name (coach)", downloadPdf:"⬇ Download PDF", downloadWord:"⬇ Download Word", importPdf:"📄 Drag your Gallup report here, or click", importDrop:"Drop the PDF here…", importing:"Reading PDF...", importOk:"Strengths imported ✓", importErr:"Could not read it. Check it's the Gallup PDF, or enter manually.", importTeam:"📄 Drag up to 15 Gallup reports here, or click", importTeamDrop:"Drop the PDFs here…", importingTeam:"Reading reports...", importTeamOk:(n)=>`${n} member(s) imported ✓`, importTeamErr:"No readable reports. Check they are Gallup PDFs.", importTeamMax:"15 reports maximum.", letterGreeting:(n)=>`Dear ${n},`, letterIntro:"Here is the debrief of your strengths, the fruit of our conversation. Take the time to read it, return to it, and let these words resonate.", letterClose:"With all my confidence,", pdfTitle:"StrengthsFinder Debrief", phName:"First and last name", phRole:"e.g. CEO, Project manager...", phCoach:"e.g. Philippe Kassenbeck", phTeam:"e.g. Board, Marketing team...", strength:"Strength", optional:"optional", member:"Member", analyzing:"Analyzing...", errMin3:"Enter at least 3 strengths.", errMin2:"Add at least 2 members with strengths.", errApi:"API error.", errRetry:"Error. Please try again.", authSub:"Restricted access", authTitle:"Sign in", authPassword:"Password", authPlaceholder:"Your password or access code", authLogin:"Enter →", authChecking:"Checking...", authWrong:"Invalid or expired password.", logout:"Log out", codesBtn:"🔑 Access codes", adminCodes:"Generate an access code", codeDays:"Validity (days)", generateCode:"Generate code", copyCode:"Copy", copied:"Copied ✓", codeExpires:"Valid until", codeHint:"Give this code to your client: they can sign in until the expiry date.", pair:"Pair", headerSubPair:"Pair debrief · Analyze the interaction between two people", pairRelation:"Nature of the relationship", pairRelationOptions:[{v:"peers",l:"Peers / colleagues"},{v:"manager",l:"Manager – report"},{v:"cofounders",l:"Co-founders / partners"},{v:"transverse",l:"Cross-functional"}], analyzePair:"Analyze the pair →", backPair:"← New pair", pairChatPlaceholder:"Ask about the pair's dynamic...", importPair:"📄 Drag the 2 Gallup reports here, or click", importPairDrop:"Drop the 2 PDFs here…", importPairOk:"Pair imported ✓", importPairErr:"Two readable Gallup reports are required.", statsShared:"Shared strengths", statsComplement:"Both profiles compared", statsFriction:"Potential friction points", pairNoShared:"No shared strength in the tops — two very different profiles.", pairNoFriction:"No classic tension pair detected.", errPairMin:"Enter at least 3 strengths for each of the two people.", personA:"Person A", personB:"Person B", cnv:"NVC", headerSubCnv:"Conflict-resolution tool · Nonviolent Communication (O·F·N·R)", cnvSituationLabel:"Describe the situation", cnvSituationPh:"Tell the facts and what you feel, in your own words…", cnvWithLabel:"Who is the message for", cnvWithPh:"e.g. my partner, a report, a client… (optional)", cnvGoalLabel:"What you'd like", cnvGoalPh:"what you'd want from this exchange (optional)", analyzeCnv:"Generate the NVC message →", backCnv:"← New situation", cnvChatPlaceholder:"Refine your message, try a rephrasing…", errCnvMin:"Describe the situation first." },
};

// Sécurité : renvoie TOUJOURS un objet de libellés valide.
// Si la langue est inconnue ou absente, on retombe sur le français.
// Empêche tout crash du type "Cannot read properties of undefined (reading 'goalOptions')".
function getLabels(lang) {
  return LABELS[lang] || LABELS.fr;
}

function getDomain(s) {
  for (const [d, arr] of Object.entries(DOMAINS)) if (arr.includes(s)) return d;
  return "Thinking";
}

// Classification sociodynamique (Jean-Christian Fauvet), d'après les slides 15 & 33
// du support Optimup. Chaque force tire l'équipe soit vers la SYNERGIE (énergie de
// cohésion interne / EGO : appartenance, "faire nous"), soit vers l'ANTAGONISME
// (énergie de différenciation et d'ouverture / ECO : autonomie, challenge, marché).
// Fauvet : « synergie et antagonisme ne s'opposent pas, ils se composent ». Les forces
// restantes sont neutres (hésitantes / latentes : elles suivent sans aligner ni défier).
const FAUVET = {
  synergy: ["Harmony","Positivity","Includer","Developer","Relator","Empathy","Individualization","Connectedness","Belief","Consistency","Responsibility"],
  antagonism: ["Command","Significance","Competition","Self-Assurance","Maximizer","Activator","Achiever","Focus","Analytical","Deliberative","Strategic","Futuristic","Woo","Communication"],
  // neutre (le reste) : Adaptability, Input, Learner, Context, Intellection, Ideation, Arranger, Discipline, Restorative
};
function getFauvetPole(s) {
  if (FAUVET.synergy.includes(s)) return "synergy";
  if (FAUVET.antagonism.includes(s)) return "antagonism";
  return "neutral";
}

// Nettoie le nom déduit d'un fichier Gallup : retire l'extension, les séparateurs,
// et les mots parasites courants (CliftonStrengths, ALL 34, Report, etc.).
function cleanMemberName(fileName) {
  let n = fileName.replace(/\.pdf$/i, "");
  n = n.replace(/[_-]+/g, " ");
  const junk = [
    /cliftonstrengths/ig,
    /strengthsfinder/ig,
    /signature\s*themes?\s*(report)?/ig,
    /\ball\s*34\b/ig,
    /\btop\s*\d+\b/ig,
    /\b34\b/ig,
    /\breport\b/ig,
    /\bresults?\b/ig,
    /\bprofile\b/ig,
    /\bgallup\b/ig,
  ];
  junk.forEach(re => { n = n.replace(re, " "); });
  n = n.replace(/\s+/g, " ").trim();
  return n || fileName.replace(/\.pdf$/i, "");
}

function getDomainCounts(strengths) {
  const c = { Executing:0, Influencing:0, Relationship:0, Thinking:0 };
  strengths.forEach(s => { c[getDomain(s)]++; });
  return c;
}

// Calcule le rapport chiffré complet d'une équipe.
// Pondération : 1re force = 5 pts, 2e = 4, 3e = 3, 4e = 2, 5e = 1.
// members : [{ name, strengths:[5 forces ordonnées] }]
function getTeamStats(members) {
  const WEIGHTS = [5, 4, 3, 2, 1];
  const points = {};   // force -> total de points pondérés
  const counts = {};   // force -> nombre d'occurrences
  members.forEach(m => {
    m.strengths.filter(Boolean).slice(0, 5).forEach((s, i) => {
      points[s] = (points[s] || 0) + (WEIGHTS[i] || 1);
      counts[s] = (counts[s] || 0) + 1;
    });
  });
  const totalPoints = Object.values(points).reduce((a, b) => a + b, 0) || 1;

  // Classement pondéré (toutes forces présentes, triées par points décroissants).
  const ranking = Object.entries(points)
    .map(([name, pts]) => ({
      name, pts, count: counts[name], domain: getDomain(name),
      pct: Math.round((pts / totalPoints) * 1000) / 10,
    }))
    .sort((a, b) => b.pts - a.pts || a.name.localeCompare(b.name));

  // Répartition par domaine (en points pondérés).
  const domainPts = { Executing:0, Influencing:0, Relationship:0, Thinking:0 };
  ranking.forEach(r => { domainPts[r.domain] += r.pts; });
  const domains = Object.entries(domainPts).map(([key, pts]) => ({
    key, pts,
    pct: Math.round((pts / totalPoints) * 1000) / 10,
    strengths: ranking.filter(r => r.domain === key).map(r => r.name),
  }));

  const rare = ranking.filter(r => r.count === 1);
  const absent = ALL34.filter(s => !counts[s]).map(name => ({ name, domain: getDomain(name) }));

  // Sociodynamique de Fauvet : agrège les points pondérés par pôle (synergie / antagonisme / neutre).
  const fauvetPts = { synergy: 0, antagonism: 0, neutral: 0 };
  ranking.forEach(r => { fauvetPts[getFauvetPole(r.name)] += r.pts; });
  const pct = (p) => Math.round((p / totalPoints) * 1000) / 10;
  const sociodynamics = {
    synergyPts: fauvetPts.synergy, antagonismPts: fauvetPts.antagonism, neutralPts: fauvetPts.neutral,
    synergyPct: pct(fauvetPts.synergy), antagonismPct: pct(fauvetPts.antagonism), neutralPct: pct(fauvetPts.neutral),
    synergyStrengths: ranking.filter(r => getFauvetPole(r.name) === "synergy").map(r => r.name),
    antagonismStrengths: ranking.filter(r => getFauvetPole(r.name) === "antagonism").map(r => r.name),
    neutralStrengths: ranking.filter(r => getFauvetPole(r.name) === "neutral").map(r => r.name),
  };

  return { ranking, domains, rare, absent, totalPoints, sociodynamics };
}

// Paires de tension classiques (Talent Tension Matrix, slides 31-37 du support Optimup) :
// deux forces qui, portées par deux personnes différentes, créent une friction — souvent PRODUCTIVE
// au sens de Fauvet (antagonisme = énergie de différenciation), mais à conscientiser.
const FRICTION_PAIRS = [
  ["Futuristic","Consistency","vision long terme vs pratiques éprouvées"],
  ["Maximizer","Adaptability","excellence exigeante vs souplesse contextuelle"],
  ["Competition","Relator","distinction individuelle vs cohésion du lien"],
  ["Command","Harmony","confrontation directe vs recherche de consensus"],
  ["Analytical","Activator","besoin de preuve vs besoin d'élan"],
  ["Significance","Includer","distinction vs appartenance"],
  ["Deliberative","Activator","prudence vs passage à l'action"],
  ["Strategic","Achiever","choisir la meilleure voie vs avancer coûte que coûte"],
  ["Ideation","Focus","foisonnement d'idées vs priorisation"],
  ["Command","Empathy","direction ferme vs sensibilité relationnelle"],
  ["Self-Assurance","Deliberative","confiance instinctive vs prudence analytique"],
  ["Discipline","Adaptability","structure et plan vs improvisation"],
];

// Détecte les paires de friction présentes entre deux personnes (dans un sens ou l'autre).
function getPairFrictions(aStrengths, bStrengths) {
  const out = [];
  FRICTION_PAIRS.forEach(([x, y, desc]) => {
    if (aStrengths.includes(x) && bStrengths.includes(y)) out.push({ a: x, b: y, desc });
    else if (aStrengths.includes(y) && bStrengths.includes(x)) out.push({ a: y, b: x, desc });
  });
  return out;
}

// Analyse chiffrée d'un binôme : forces communes (ressemblance), profils par domaine,
// domaines complémentaires (l'un couvre ce qui manque à l'autre), paires de friction.
function getPairStats(a, b) {
  const aS = a.filter(Boolean);
  const bS = b.filter(Boolean);
  const shared = aS.filter(s => bS.includes(s));
  const domA = getDomainCounts(aS);
  const domB = getDomainCounts(bS);
  // Complémentarité : domaines forts chez l'un et absents chez l'autre.
  const complementary = [];
  ["Executing","Influencing","Relationship","Thinking"].forEach(d => {
    if (domA[d] > 0 && domB[d] === 0) complementary.push({ domain: d, strong: "A" });
    else if (domB[d] > 0 && domA[d] === 0) complementary.push({ domain: d, strong: "B" });
  });
  const frictions = getPairFrictions(aS, bS);
  return { aS, bS, shared, domA, domB, complementary, frictions };
}

// Tableau visuel du rapport chiffré — style Optimup.
function TeamStatsTable({ stats, members, L }) {
  const domainColor = { executing:"#7C6FD6", influencing:"#C9881F", relationship:"#3E84D6", thinking:"#2E9E78" };
  const domainTint  = { executing:"#EEEBFA", influencing:"#FBF1DF", relationship:"#E6F0FB", thinking:"#E2F3EC" };
  const domainLabel = { Executing:L.executing, Influencing:L.influencing, Relationship:L.relationship, Thinking:L.thinking };
  const validMembers = members.filter(m => m.strengths.some(Boolean));
  const sortedDomains = stats.domains.slice().sort((a,b)=>b.pts-a.pts);

  const SectionTitle = ({ children }) => (
    <div style={{ background:"#3B3270", color:"#fff", fontWeight:700, fontSize:"16px", padding:"10px 18px", borderRadius:"8px", margin:"0 0 16px" }}>
      {children}
    </div>
  );

  return (
    <div style={{ marginBottom:"28px" }}>

      {/* 1. Forces par personne */}
      <SectionTitle>{L.statsByPerson}</SectionTitle>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"28px" }}>
        {validMembers.map((m, i) => (
          <div key={i} style={{ flex:"1 1 200px", minWidth:"180px", background:"#fff", border:"1px solid #ececec", borderRadius:"12px", padding:"14px 16px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ fontWeight:700, fontSize:"14px", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid #f0f0f0" }}>{m.name || `${L.member} ${i+1}`}</div>
            {m.strengths.filter(Boolean).map((s, j) => (
              <div key={j} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"3px 0", fontSize:"13px" }}>
                <span style={{ color:"#bbb", width:"14px", fontWeight:600 }}>{j+1}</span>
                <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:domainColor[getDomain(s).toLowerCase()], flexShrink:0 }}></span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 2. Répartition par domaine */}
      <SectionTitle>{L.statsByDomain}</SectionTitle>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"16px" }}>
        {sortedDomains.map((d, i) => {
          const c = domainColor[d.key.toLowerCase()];
          return (
            <div key={i} style={{ flex:"1 1 200px", minWidth:"180px", background:"#fff", border:"1px solid #ececec", borderRadius:"12px", overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ height:"6px", background:c }}></div>
              <div style={{ padding:"16px 18px" }}>
                <div style={{ fontSize:"34px", fontWeight:800, color:c, lineHeight:1 }}>{d.pct}%</div>
                <div style={{ color:"#999", fontSize:"13px", margin:"4px 0 10px" }}>{d.pts} pts</div>
                <div style={{ display:"inline-block", background:domainTint[d.key.toLowerCase()], color:c, fontWeight:700, fontSize:"13px", padding:"5px 12px", borderRadius:"8px", marginBottom:"12px" }}>{domainLabel[d.key]}</div>
                <div style={{ borderTop:"1px solid #f0f0f0", paddingTop:"10px" }}>
                  <div style={{ fontSize:"11px", fontStyle:"italic", color:"#aaa", marginBottom:"4px" }}>{L.statsPresent}</div>
                  {d.strengths.length === 0
                    ? <div style={{ color:"#ccc", fontSize:"13px" }}>—</div>
                    : d.strengths.map((s, j) => <div key={j} style={{ fontSize:"13px", padding:"1px 0" }}>{s}</div>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre de proportion horizontale */}
      <div style={{ display:"flex", height:"34px", borderRadius:"8px", overflow:"hidden", marginBottom:"10px" }}>
        {sortedDomains.filter(d => d.pct > 0).map((d, i) => (
          <div key={i} style={{ width:`${d.pct}%`, background:domainColor[d.key.toLowerCase()], color:"#fff", fontSize:"12px", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {d.pct >= 7 ? `${d.pct}%` : ""}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:"18px", flexWrap:"wrap", marginBottom:"28px", fontSize:"12px", color:"#666" }}>
        {sortedDomains.map((d, i) => (
          <span key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
            <span style={{ width:"12px", height:"12px", borderRadius:"3px", background:domainColor[d.key.toLowerCase()] }}></span>
            {domainLabel[d.key]}
          </span>
        ))}
      </div>

      {/* 3. Classement pondéré */}
      <SectionTitle>{L.statsRanking}</SectionTitle>
      <div style={{ background:"#fff", border:"1px solid #ececec", borderRadius:"12px", overflow:"hidden", marginBottom:"8px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 16px", background:"#3B3270", color:"#fff", fontWeight:700, fontSize:"12px" }}>
          <span style={{ width:"22px", textAlign:"right" }}>#</span>
          <span style={{ width:"8px" }}></span>
          <span style={{ flex:1 }}>{L.strength}</span>
          <span style={{ width:"130px" }}>{L.statsDomainCol}</span>
          <span style={{ width:"34px", textAlign:"right" }}>Pts</span>
          <span style={{ width:"48px", textAlign:"right" }}>%</span>
        </div>
        {stats.ranking.map((r, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 16px", background: i%2 ? "#faf9f7" : "#fff", fontSize:"14px" }}>
            <span style={{ color:"#bbb", width:"22px", textAlign:"right" }}>{i+1}</span>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:domainColor[r.domain.toLowerCase()], flexShrink:0 }}></span>
            <span style={{ flex:1, fontWeight:700 }}>{r.name}</span>
            <span style={{ width:"130px" }}>
              <span style={{ display:"inline-block", background:domainTint[r.domain.toLowerCase()], color:domainColor[r.domain.toLowerCase()], fontSize:"11px", fontWeight:600, padding:"3px 9px", borderRadius:"6px" }}>{domainLabel[r.domain]}</span>
            </span>
            <span style={{ fontWeight:800, width:"34px", textAlign:"right", color:domainColor[r.domain.toLowerCase()] }}>{r.pts}</span>
            <span style={{ color:"#999", width:"48px", textAlign:"right" }}>{r.pct}%</span>
          </div>
        ))}
      </div>

      {/* 4. Sociodynamique de Fauvet : synergie vs antagonisme */}
      <SectionTitle>{L.statsSocio}</SectionTitle>
      <div style={{ background:"#fff", border:"1px solid #ececec", borderRadius:"12px", padding:"16px 18px", marginBottom:"8px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
        <div style={{ fontSize:"12px", fontStyle:"italic", color:"#aaa", marginBottom:"14px" }}>{L.socioSub}</div>
        {[
          { label:L.socioSynergy, c:"#2E9E78", pct:stats.sociodynamics.synergyPct, pts:stats.sociodynamics.synergyPts, list:stats.sociodynamics.synergyStrengths },
          { label:L.socioAntagonism, c:"#C9881F", pct:stats.sociodynamics.antagonismPct, pts:stats.sociodynamics.antagonismPts, list:stats.sociodynamics.antagonismStrengths },
          { label:L.socioNeutral, c:"#b9b3a8", pct:stats.sociodynamics.neutralPct, pts:stats.sociodynamics.neutralPts, list:stats.sociodynamics.neutralStrengths },
        ].map((d, i) => (
          <div key={i} style={{ marginBottom:"12px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"5px" }}>
              <span style={{ width:"10px", height:"10px", borderRadius:"3px", background:d.c, flexShrink:0 }}></span>
              <span style={{ fontWeight:700, fontSize:"14px" }}>{d.label}</span>
              <span style={{ fontWeight:800, fontSize:"14px", color:d.c }}>{d.pct}%</span>
              <span style={{ color:"#aaa", fontSize:"12px" }}>{d.pts} pts</span>
            </div>
            <div style={{ height:"8px", borderRadius:"5px", background:"#f0efec", overflow:"hidden", marginBottom:"4px" }}>
              <div style={{ width:`${d.pct}%`, height:"100%", background:d.c }}></div>
            </div>
            {d.list.length > 0 && <div style={{ fontSize:"12px", color:"#888" }}>{d.list.join(" · ")}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}


// Tableau visuel d'un binôme : profils côte à côte, comparaison par domaine,
// forces communes (ressemblance) et paires de friction — style Optimup.
function PairStatsTable({ stats, a, b, L }) {
  const domainColor = { executing:"#7C6FD6", influencing:"#C9881F", relationship:"#3E84D6", thinking:"#2E9E78" };
  const domainLabel = { Executing:L.executing, Influencing:L.influencing, Relationship:L.relationship, Thinking:L.thinking };
  const SectionTitle = ({ children }) => (
    <div style={{ background:"#3B3270", color:"#fff", fontWeight:700, fontSize:"16px", padding:"10px 18px", borderRadius:"8px", margin:"0 0 16px" }}>{children}</div>
  );
  const nameA = a.name || `${L.member} A`, nameB = b.name || `${L.member} B`;
  const domains = ["Executing","Influencing","Relationship","Thinking"];
  const maxDom = Math.max(1, ...domains.map(d => Math.max(stats.domA[d], stats.domB[d])));

  const PersonCard = ({ name, strengths }) => (
    <div style={{ flex:"1 1 220px", minWidth:"200px", background:"#fff", border:"1px solid #ececec", borderRadius:"12px", padding:"14px 16px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
      <div style={{ fontWeight:700, fontSize:"14px", marginBottom:"10px", paddingBottom:"8px", borderBottom:"1px solid #f0f0f0" }}>{name}</div>
      {strengths.map((s, j) => (
        <div key={j} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"3px 0", fontSize:"13px" }}>
          <span style={{ color:"#bbb", width:"14px", fontWeight:600 }}>{j+1}</span>
          <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:domainColor[getDomain(s).toLowerCase()], flexShrink:0 }}></span>
          <span>{s}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ marginBottom:"28px" }}>
      <SectionTitle>{L.statsComplement}</SectionTitle>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", marginBottom:"20px" }}>
        <PersonCard name={nameA} strengths={stats.aS} />
        <PersonCard name={nameB} strengths={stats.bS} />
      </div>
      <div style={{ background:"#fff", border:"1px solid #ececec", borderRadius:"12px", padding:"16px 18px", marginBottom:"20px", boxShadow:"0 1px 3px rgba(0,0,0,0.04)" }}>
        {domains.map((d, i) => (
          <div key={i} style={{ marginBottom: i < 3 ? "12px" : "0" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"12px", fontWeight:600, marginBottom:"4px" }}>
              <span>{nameA}: {stats.domA[d]}</span>
              <span style={{ color:domainColor[d.toLowerCase()] }}>{domainLabel[d]}</span>
              <span>{stats.domB[d]} :{nameB}</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
              <div style={{ flex:1, display:"flex", justifyContent:"flex-end" }}>
                <div style={{ width:`${stats.domA[d]/maxDom*100}%`, height:"10px", borderRadius:"3px", background:domainColor[d.toLowerCase()], opacity:0.85 }}></div>
              </div>
              <div style={{ width:"1px", height:"14px", background:"#ddd" }}></div>
              <div style={{ flex:1 }}>
                <div style={{ width:`${stats.domB[d]/maxDom*100}%`, height:"10px", borderRadius:"3px", background:domainColor[d.toLowerCase()] }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>{L.statsShared}</SectionTitle>
      <div style={{ marginBottom:"20px" }}>
        {stats.shared.length === 0
          ? <div style={{ color:"#999", fontSize:"14px" }}>{L.pairNoShared}</div>
          : <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
              {stats.shared.map((s, i) => (
                <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:"6px", background:"#fff", border:"1px solid #ececec", borderRadius:"20px", padding:"6px 14px", fontSize:"13px", fontWeight:600 }}>
                  <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:domainColor[getDomain(s).toLowerCase()] }}></span>{s}
                </span>
              ))}
            </div>}
      </div>

      <SectionTitle>{L.statsFriction}</SectionTitle>
      <div>
        {stats.frictions.length === 0
          ? <div style={{ color:"#999", fontSize:"14px" }}>{L.pairNoFriction}</div>
          : <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {stats.frictions.map((f, i) => (
                <div key={i} style={{ background:"#fff", border:"1px solid #ececec", borderLeft:"3px solid #C9881F", borderRadius:"8px", padding:"10px 14px", fontSize:"13px" }}>
                  <strong>{f.a}</strong> <span style={{ color:"#C9881F" }}>↔</span> <strong>{f.b}</strong>
                  <span style={{ color:"#888" }}> — {f.desc}</span>
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
}


function DomainsBar({ strengths, L }) {
  const counts = getDomainCounts(strengths);
  const items = [
    { key:"Executing", label:L.executing, cls:"d-executing" },
    { key:"Influencing", label:L.influencing, cls:"d-influencing" },
    { key:"Relationship", label:L.relationship, cls:"d-relationship" },
    { key:"Thinking", label:L.thinking, cls:"d-thinking" },
  ];
  return (
    <div className="domains">
      {items.map(i => (
        <div key={i.key} className={`domain-card ${i.cls}`}>
          <div className="d-label">{i.label}</div>
          <div className="d-count">{counts[i.key]}</div>
        </div>
      ))}
    </div>
  );
}

// Affiche un texte avec un Markdown léger : "## Titre" devient un titre en gras,
// "**gras**" devient du gras inline. Le reste s'affiche en paragraphes.
function renderInline(text) {
  // Découpe sur **gras** et renvoie un tableau d'éléments React.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p)
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <span key={i}>{p}</span>
  );
}

function RichText({ text }) {
  const lines = (text || "").split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const t = line.trim();
        if (/^#{1,6}\s+/.test(t)) {
          const title = t.replace(/^#{1,6}\s+/, "");
          return <p key={i} className="report-title-plain">{renderInline(title)}</p>;
        }
        if (t === "") return <div key={i} className="report-gap" />;
        return <p key={i} className="report-p">{renderInline(t)}</p>;
      })}
    </>
  );
}

function ChatArea({ messages, chatAreaRef }) {
  return (
    <div className="chat-area" ref={chatAreaRef}>
      {messages.map((m, i) => (
        <div key={i} className={`msg ${m.role}`}>
          <div className={`avatar ${m.role === "ag" ? "ag" : "us"}`}>{m.role === "ag" ? "LS" : "→"}</div>
          <div className="bubble" dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g,"<br>") }} />
        </div>
      ))}
    </div>
  );
}

async function callAPI(systemPrompt, messages) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ systemPrompt, messages }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.content;
}

function buildSystem(lang, context) {
  const langName = lang === "fr" ? "French" : lang === "de" ? "German" : "English";
  return `You are an expert StrengthsFinder leadership coach writing in Philippe's voice and methodology. You produce a "Portrait de leadership" — a polished, deeply personalized leadership debrief addressed directly to the person (vouvoiement in French, first name only, never the full name). The tone is warm, confident, precise and truthful; you affirm rather than impose.

LANGUAGE: Write the ENTIRE debrief in ${langName}, including every heading, regardless of the language of these instructions.
STRENGTH NAMES: Strengths are given in English (e.g. "Achiever", "Strategic"). ALWAYS translate each into the OFFICIAL CliftonStrengths theme name in ${langName}. In French use the official French names (Achiever→Réalisateur, Strategic→Stratégique, Learner→Studieux, Self-Assurance→Assurance, Woo→Charisme, Individualization→Individualisation, Futuristic→Futuriste, Competition→Compétition, Relator→Relationnel, Ideation→Idéation, Input→Input, Deliberative→Prudent, Consistency→Équitable, Connectedness→Connexion, Harmony→Harmonie, Responsibility→Responsabilité, Discipline→Discipline, Includer→Inclusion, Developer→Développeur, Communication→Communication, Arranger→Arrangeur, Significance→Signifiance, Activator→Activateur, Analytical→Analytique, Intellection→Intellection, Restorative→Restaurateur). In English keep the standard names. NEVER invent or reorder the ranking you are given.

STRICT FIDELITY: The strengths and their order are given to you and are exact. Never contradict, reorder or invent rankings. Read the absences too: a domain that does not appear in the top is a real signal you must use (it drives sections 2 and 3).

OUTPUT FORMAT — follow this structure EXACTLY. Use light Markdown: "## " before each section heading, "**bold**" for emphasis on strength names and key phrases. No tables. The whole debrief fits roughly 1.5 A4 pages.

RESPONSIBILITY LEVEL — CRITICAL. The context gives a "Responsibility level" tagged [LEADER], [MANAGER] or [INDIVIDUAL_CONTRIBUTOR]. You MUST adapt the entire debrief to it. Never assume the person manages people unless they are LEADER or MANAGER.
- [LEADER] (executive / directs through others): full leadership framing. Section 1 closes on the value they bring to their ORGANISATION / executive team. Section 3 may use delegation, "faire grandir ses équipes", building a complementary leadership team. Section 4 silent question comes from "vos équipes" (the people and teams they lead). The leadership style formula in §1 is appropriate.
- [MANAGER] (runs a team operationally, hands-on): managerial framing. Section 1 closes on the value they bring to THEIR TEAM and its day-to-day delivery. Section 3 covers managing, developing direct reports, balancing doing vs. delegating. Section 4 silent question comes from "votre équipe" (their direct reports). The §1 formula describes a managerial style (e.g. "**management d'entraînement**"), not executive leadership.
- [INDIVIDUAL_CONTRIBUTOR] (no management responsibility): DO NOT invent a team. Section 1 closes on the value they bring to THEIR PROJECTS, their collaborations and their function — never an "équipe de direction". Section 3 is about influence WITHOUT authority, collaboration, self-leadership and personal growth — never delegation or "faire grandir ses équipes". Section 4 silent question comes from "vos collègues / vos pairs / votre entourage de travail", NOT "vos équipes". The §1 formula describes a contribution/working style (e.g. "**une façon de travailler ...**"), and you may speak of "leadership de soi" / influence, but never imply they lead a team.
Keep the SAME five-section structure and the same warm tone for every level; only the framing, examples and who-perceives-them change.


"**Comment lire ce portrait** — Ce document décrit vos forces, pas votre destin. Vos talents expliquent vos réflexes ; ils ne décident pas de vos choix. Lu avec un esprit figé, ce portrait devient une excuse : « je suis comme ça ». Lu avec un esprit de croissance, il devient un tableau de bord : des muscles puissants dont vous choisissez l'engagement, le dosage et le moment. Quant à vos risques, ce ne sont jamais des défauts — seulement vos forces, utilisées sans choix conscient."

Then the FIVE sections, each opened by a "## " heading numbered 1 to 5. Use these headings (translate to ${langName}; French shown):
"## 1. Vos forces en action"
"## 2. Vos angles morts et vos risques"
"## 3. Utiliser vos forces pour compenser vos fragilités"
"## 4. Comment les autres vous perçoivent"
"## 5. Deux questions puissantes pour avancer"

## 1 — Portrait (4 short paragraphs)
Name the person's signature talent-based style in a vivid 3–4 word formula in bold (e.g. "**leadership d'ancrage**", "**leadership de vision incarnée**", or a managerial / working-style formula appropriate to their level). Tell the story of how their talents work together as a system — not a list, a living mechanism. Group their strengths into two coherent families (the way a two-column reframe would) and show the loop between them. Close on the triple value they bring, FRAMED BY THEIR RESPONSIBILITY LEVEL (organisation for a leader, their team for a manager, their projects & collaborations for an individual contributor), with three bolded nouns. Reference their dominant strengths by name.

## 2 — Angles morts (2 paragraphs, then ONE call-out, then 1–2 paragraphs)
Every strength casts a shadow. Frame each risk as the flip side of a strength ("ce qui vous rend puissant ici peut parfois..."), never as a defect. After the first paragraph, insert ONE call-out line that starts exactly with "**Votre risque majeur** —" naming the single most important strength COMBINATION (e.g. "Activateur + Assurance") and its systemic effect, with one bolded key phrase inside. Then continue with the remaining risks, including what their UNDER-represented domains expose them to.

## 3 — Compenser (intro line + 3–4 mini-blocks + closing line)
Open with: the good news is that the antidotes are already in their profile. Then 3–4 short blocks, each titled in bold caps naming a strength or pair used as a lever (e.g. "**INPUT + STUDIEUX — VOS SUBSTITUTS STRATÉGIQUES**"), one of which is a dominant strength "RETOURNÉE / REVERSED" (turning a strength back on itself, e.g. making Achiever about what others achieve). For each, build a concrete bridge from a PRESENT strength toward an under-developed domain — never generic advice. Close with one line on complementary profiles to surround themselves with, and ONE bolded "levier de développement clé".

## 4 — Perception (1 paragraph + 3 bullets + ONE call-out)
Describe how collaborators, peers and (if relevant) the people they lead likely perceive them, grounded strictly in their real strengths. Then exactly 3 bullets starting "— **Ce qui inspire confiance :**", "— **Ce qui impressionne — et parfois ...:**", "— **Ce qui peut être mal interprété :**". End with ONE italic call-out giving the "silent question" the relevant people might be asking — choose the source by level: a leader's teams, a manager's direct reports, OR for an individual contributor their peers/colleagues (never "vos équipes"). Form: "*La question silencieuse de [vos équipes / votre équipe / vos pairs] pourrait être : « ... »* — un écart de perception que vous avez le pouvoir de combler."

## 5 — Two questions (EXACTLY two, not three)
Two powerful, open, non-yes/no questions in italics, each under its own bold label. Label 1: "**PERFORMANCE & IMPACT**" — a question that redefines success as what others accomplish without them / their real leverage. Label 2: "**CONSCIENCE DE SOI & TRANSFORMATION**" — a question about becoming the conscious master of their strengths rather than being driven by them (what does a given reflex let them avoid feeling?).

Do NOT write any closing salutation or signature — the document adds it automatically. End the text right after the second question.

Context: ${context}`;
}

// Prompt système spécifique au TEAM COACHING.
// Exploite explicitement le secteur/métier, le département et le rôle du chef d'équipe.
function buildTeamSystem(lang, context) {
  const langName = lang === "fr" ? "French" : lang === "de" ? "German" : "English";
  return `You are an expert StrengthsFinder TEAM coach writing in Philippe's voice and methodology, with a strong systemic (ORSC-inspired) lens. You analyze a TEAM as a living system — a "Troisième Entité" with its own personality — not a sum of individuals. Your reader is the coach (and often the team leader).

LANGUAGE: Write the ENTIRE output in ${langName}, every sentence and heading, regardless of the language of these instructions.
STRENGTH NAMES: Strengths are given in English. ALWAYS translate each into the OFFICIAL CliftonStrengths theme name in ${langName} (in French: Achiever→Réalisateur, Strategic→Stratégique, Learner→Studieux, Self-Assurance→Assurance, Woo→Charisme, Individualization→Individualisation, Futuristic→Futuriste, Competition→Compétition, Relator→Relationnel, Ideation→Idéation, Input→Input, Deliberative→Prudent, Consistency→Équitable, Connectedness→Connexion, Harmony→Harmonie, Responsibility→Responsabilité, Includer→Inclusion, Developer→Développeur, Arranger→Arrangeur, Significance→Signifiance, Activator→Activateur, Analytical→Analytique, Intellection→Intellection, Empathy→Empathie, Command→Commandement).

CONTEXT YOU ARE GIVEN — use ALL of it, ignore no field:
- "Nature du métier / secteur": the business sector. ADAPT every reading to the codes, pace and constraints of THIS sector. Make the sector visible — never give advice that would fit any team.
- "Département / Service": the function. Frame strengths and gaps through what THIS function must deliver, and name explicitly when the collective profile fits or misfits its mission.
- "Chef d'équipe": the member tagged [CHEF D'ÉQUIPE]. If tagged, analyze the leader–team dynamic specifically; if none is tagged, omit anything about a leader.

A precise numeric report is given in context (weighted ranking, domain distribution, rare and absent strengths, AND the exact Fauvet sociodynamics rates: synergy %, antagonism %, neutral %). It is computed exactly — NEVER recompute or contradict these numbers. The visual tables are already shown to the user; your job is INTERPRETATION and systemic insight, not listing.

REFERENCE FRAMEWORKS you must use (Philippe's methodology — use the exact vocabulary):
- Jean-Christian FAUVET (sociodynamique): « synergie et antagonisme ne s'opposent pas, ils se composent pour créer la dynamique organisationnelle ». SYNERGY = team EGO = internal cohesion, belonging, shared culture (risk: insularity / "tyrannie de la gentillesse" / faux consensus). ANTAGONISM = team ECO = openness, external responsiveness, individual autonomy, challenge (NOT conflict — it is the differentiation energy). Fauvet's OPTIMAL "zone évolutive" = HIGH synergy AND HIGH antagonism together = productive tension ("triangles d'or": engaged actors who challenge without breaking the bond). Actor positions on the grid: allié, opposant, hésitant, triangle d'or/déchiré, passif. Positions are NOT fixed — they move with recognition, involvement, and whether concerns are heard.
- Peter HAWKINS: high-performing teams master FIVE disciplines — Commissioning (mandat/raison d'être reçue des parties prenantes), Clarifying (vision, valeurs, rôles, objectifs partagés en interne), Co-creating (travailler et innover ensemble au quotidien), Connecting (engager et créer de la valeur pour les parties prenantes externes), Core Learning (réfléchir, apprendre, se renouveler).
- Patrick LENCIONI: pyramide de la performance — Confiance → Conflit constructif → Engagement/décision → Responsabilité mutuelle → Résultats. Chaque étage repose sur celui d'en dessous ; « la confiance est l'ascenseur du leadership ».

OUTPUT FORMAT — follow this EXACTLY. Light Markdown: "## " before each section heading, "**bold**" for strength names and key phrases. No tables. Roughly 2.5–3 A4 pages.

Start with a short foreword (no heading, 3–4 lines), the growth-mindset meta-point applied to the team. In French, this spirit:
"**Comment lire ce portrait d'équipe** — Ce document décrit la signature de l'équipe, pas une fatalité. Les forces collectives expliquent ses réflexes ; elles ne dictent pas ses choix. Une force partagée par tous est un atout ET un risque ; une force absente n'est pas un défaut, mais une voix que le système devra apprendre à porter consciemment."

Then EIGHT sections, each opened by a "## " heading numbered 1 to 8 (translate to ${langName}; French shown):

"## 1. La signature de l'équipe"
Open with EXACTLY 10 affirmative, vivid, unhedged sentences (flowing prose, no bullets) defining who this team-entity is, read through its four domains (Executing, Influencing, Relationship, Thinking), weighted by the domain distribution. Reference dominant strengths by name. Name a collective "signature" — a strength or domain shared by most members — and frame it as both the team's superpower and its first vulnerability (e.g. a strength shared by 5 of 6 is an efficiency signature AND a premature-convergence risk). Close on the triple value the team brings, with three bolded nouns.

"## 2. Les tensions visibles"
2 to 3 short paragraphs naming the FRICTIONS that are already observable in the room — rivalries between similar dominant profiles, pace mismatches, competing leadership reflexes. Each tension is named as belonging to the SYSTEM, not to individuals ("la tension n'appartient à personne — c'est une information que le système exprime"). Tie each to specific strengths held by specific members where the data supports it.

"## 3. Les tensions invisibles"
2 to 4 short paragraphs on what does NOT show but shapes everything: the **rôle fantôme** (ghost role) — name explicitly the most consequential ABSENT strength as a voice that haunts the system (e.g. "Le rôle fantôme de cette équipe, c'est le Prudent/Délibératif : personne ne l'incarne, mais il parle à travers les erreurs et les sur-promesses"). Include: roles carried by too few members (saturation / rôle nausea risk), false harmony masking absent real conflict, and any equity/consistency gap felt below the team. Insert ONE call-out starting exactly "**Le risque systémique majeur** —" naming the single most dangerous invisible dynamic and one bolded key phrase.

"## 4. Synergie et antagonisme — la sociodynamique de l'équipe (Fauvet)"
The exact rates are in context (FAUVET SOCIODYNAMICS). NEVER recompute them — cite them. Write EXACTLY about 20 lines of flowing prose (NO bullets) that:
- recall Fauvet's principle: synergy and antagonism do not oppose, they COMPOSE; antagonism is not conflict, it is the energy of differentiation and openness (ECO), while synergy is the energy of cohesion and belonging (EGO);
- state THIS team's synergy rate and antagonism rate (the exact %) and interpret the balance: a team tilted toward synergy/EGO is cohesive but risks insularity and "tyrannie de la gentillesse" (false consensus); a team tilted toward antagonism/ECO is autonomous and open but risks fragmentation and rivalry; name explicitly where THIS team sits;
- name the specific strengths pulling toward synergy and those pulling toward antagonism (translated names), using the lists provided;
- locate the team against Fauvet's OPTIMAL "zone évolutive" (high synergy AND high antagonism = productive tension, "triangles d'or") and say honestly how far it is from it and in which direction it must move;
- where the data supports it, suggest the actor positions (allié, opposant, hésitant, triangle d'or) that some profiles tend to occupy;
- close on movement: these positions are not fixed — they shift with recognition, involvement, and whether concerns are heard.
Insert ONE call-out starting exactly "**Le mouvement sociodynamique à provoquer** —" naming the single most useful shift for this team (e.g. converting false consensus into productive antagonism, or turning scattered autonomy into shared cohesion) with one bolded key phrase.

"## 5. Les 5 disciplines de Hawkins passées au crible"
Screen the team's collective profile through Peter Hawkins' FIVE disciplines of high-performing teams. For EACH discipline, ONE to TWO sentences: what this team's profile naturally serves, and what is missing or at risk — grounded in the domain distribution, the sociodynamics and the absent/rare strengths. Keep Hawkins' names, in this order:
1. **Commissioning (Mandat)** — clarity on the team's raison d'être and the mandate received from stakeholders;
2. **Clarifying (Clarifier)** — shared vision, values, roles and objectives internally;
3. **Co-creating (Co-créer)** — how the team works and innovates together day to day;
4. **Connecting (Connecter)** — how the team engages and creates value for its external stakeholders;
5. **Core Learning (Apprentissage)** — the team's capacity to reflect, learn and renew itself.
End with ONE sentence linking the team's WEAKEST Hawkins discipline to Lencioni's pyramid (Confiance → Conflit constructif → Engagement → Responsabilité → Résultats): name where Lencioni's chain is most likely to break FIRST for this team, and why.

"## 6. Comment cette équipe est perçue de l'extérieur"
Describe, grounded strictly in the real profile, how the team is likely seen by clients/partners/board AT FIRST (the flattering impression its dominant strengths create) and OVER TIME or under scrutiny (the misreadings and risks the same strengths produce). End with ONE italic call-out: the "silent question" outsiders or the wider organization might be asking about this team — "*La question silencieuse de l'organisation pourrait être : « ... »*".

"## 7. La relation chef–équipe"
EXACTLY 6 lines on how the tagged leader's profile fits, amplifies or compensates the collective, and the ONE concrete posture to adopt given who they lead. If NO leader is tagged, omit this entire section (do not write the heading).

"## 8. Cinq actions concrètes"
EXACTLY 5 specific, doable recommendations tied to the findings, the objective and the sector — never generic. At least one must make the ghost role (absent voice) structurally present; at least one must protect any saturated/over-relied-on member; at least one must move the team toward Fauvet's evolutionary zone (create productive antagonism if synergy dominates, or rebuild cohesion if antagonism dominates); and at least one must reinforce the team's weakest Hawkins discipline. Frame each as a conscious choice, not a personality fix.

Tone: warm, confident, truthful. Coach posture, not consultant: every shadow is the flip side of a strength, every tension a signal of something trying to emerge. Do NOT write any closing salutation or signature — the document adds it automatically.

Context: ${context}`;
}

// Prompt système du DÉBRIEF BINÔME : analyse l'interaction entre DEUX personnes
// (ressemblance, complémentarité, friction) + outil de résolution de conflit CNV/OSBD.
function buildPairSystem(lang, context) {
  const langName = lang === "fr" ? "French" : lang === "de" ? "German" : "English";
  return `You are an expert StrengthsFinder relational coach writing in Philippe's voice and methodology. You analyze the INTERACTION between TWO people (a "binôme"/dyad) through their CliftonStrengths — not two separate portraits, but the RELATIONSHIP as a third entity: where they mirror each other, where they complement each other, and where they rub.

LANGUAGE: Write the ENTIRE output in ${langName}, every heading and sentence, regardless of the language of these instructions.
STRENGTH NAMES: Strengths are given in English. ALWAYS translate each into the OFFICIAL CliftonStrengths theme name in ${langName} (in French: Achiever→Réalisateur, Strategic→Stratégique, Learner→Studieux, Self-Assurance→Assurance, Woo→Charisme, Individualization→Individualisation, Futuristic→Futuriste, Competition→Compétition, Relator→Relationnel, Ideation→Idéation, Input→Input, Deliberative→Prudent, Consistency→Équitable, Connectedness→Connexion, Harmony→Harmonie, Responsibility→Responsabilité, Discipline→Discipline, Includer→Inclusion, Developer→Développeur, Communication→Communication, Arranger→Arrangeur, Significance→Signifiance, Activator→Activateur, Analytical→Analytique, Intellection→Intellection, Empathy→Empathie, Command→Commandement, Focus→Focalisation, Restorative→Restaurateur, Positivity→Positivité, Belief→Croyance, Context→Contexte, Maximizer→Maximiseur, Adaptability→Adaptabilité).

CONTEXT YOU ARE GIVEN — use ALL of it:
- The two people, each with their ranked strengths.
- "Relation" tagged [PEERS], [MANAGER_REPORT], [COFOUNDERS] or [TRANSVERSE]. ADAPT everything to it. For [MANAGER_REPORT], the FIRST person is the manager and the SECOND the direct report: address the hierarchical asymmetry (power, direction of feedback, psychological safety) explicitly. For [PEERS]/[TRANSVERSE], treat them as equals. For [COFOUNDERS], stress complementarity of decision-making and the risk of founder friction.
- A computed report: SHARED strengths (resemblance), domain profiles, COMPLEMENTARY domains, and detected FRICTION PAIRS (from the Talent Tension Matrix). These are exact — cite them, never contradict or recompute.

FRAMEWORKS (Philippe's methodology):
- Resemblance is comfort AND blind spot: two people sharing a dominant strength create an echo chamber — they filter out the same things ("talent saturation"). Name this.
- Fauvet: friction (antagonism) is NOT conflict, it is the energy of differentiation. The goal is not to remove friction but to make it PRODUCTIVE ("tension productive", the evolutionary zone).
- Complementarity: where one covers a domain the other lacks, name the concrete gift each brings the other.

OUTPUT FORMAT — follow this EXACTLY. Light Markdown: "## " before each heading, "**bold**" for strength names and key phrases. No tables. Roughly 2 A4 pages.

Start with a short foreword (no heading, 2-3 lines): this describes the relationship, not a verdict; every friction is the flip side of a complementarity.

Then FIVE sections, each opened by "## " numbered 1 to 5 (translate to ${langName}; French shown):

"## 1. Là où ils se ressemblent"
2 short paragraphs. Name the SHARED strengths (from context) and the domains where both are strong. Say what this resemblance makes easy (instant mutual understanding, shared reflexes) AND the blind spot it creates — the same things ignored by both (echo chamber / angle mort partagé). Reference strengths by name.

"## 2. Là où ils se complètent"
2 short paragraphs. Using the COMPLEMENTARY domains and each person's distinctive strengths, name the concrete gift each brings the other (what the first gives the second, and vice-versa). Frame the pairing's combined superpower.

"## 3. Là où ça peut frotter"
2-3 paragraphs grounded in the detected FRICTION PAIRS (name them, e.g. "**Activateur** chez l'un ↔ **Prudent** chez l'autre"). For each, explain the underlying tension (pace, proof vs momentum, distinction vs belonging…) as a SYSTEM tension, never a personal fault. Insert ONE call-out starting exactly "**La tension la plus structurante** —" naming the single friction most worth working on, with one bolded key phrase, framed as productive tension to harness.

"## 4. Comment mieux travailler ensemble"
An intro line, then EXACTLY 4 concrete, doable operating agreements ("contrats de fonctionnement") tailored to THIS pair — each as a bolded lead phrase then one sentence (division of roles that plays their complementarity, communication contracts like "prévenir 24h avant", decision rules that defuse the friction pairs, rituals). Never generic. For [MANAGER_REPORT], at least one MUST address the hierarchical dynamic.

"## 5. Outil de résolution de conflit (CNV)"
Introduce Communication NonViolente in one line (Observation, Sentiment, Besoin, Demande — OSBD: state a fact without judgment, name the feeling, the underlying need, a concrete actionable request). Then give BOTH:
(a) a TAILORED example — a realistic short CNV script for the MOST LIKELY friction of THIS specific pair, written as 4 labelled lines exactly "**Observation :** …", "**Sentiment :** …", "**Besoin :** …", "**Demande :** …", spoken from one of the two toward the other, using their real dynamic;
(b) a BLANK reusable canvas — the same 4 labels each followed by a short guiding question in italics (e.g. "**Observation :** *Quel fait précis, sans interprétation ni jugement ?*"), so they can fill it for any future tension.

Tone: warm, truthful, concrete. Coach posture: every friction is the flip side of a complementarity; the aim is conscious cooperation, not fixing anyone. Do NOT write any closing salutation or signature — the document adds it automatically.

Context: ${context}`;
}

// Prompt système de l'OUTIL CNV autonome : transforme une situation de conflit
// en message structuré Observation · Sentiment · Besoin · Demande (Marshall Rosenberg).
function buildCnvSystem(lang, context) {
  const langName = lang === "fr" ? "French" : lang === "de" ? "German" : "English";
  return `You are an expert Nonviolent Communication (NVC / CNV, Marshall Rosenberg) coach writing in Philippe's voice. You help the user transform a tense or conflictual situation into a clear, respectful message using the FOUR steps of NVC: Observation, Sentiment, Besoin, Demande (OSBD).

LANGUAGE: Write the ENTIRE output in ${langName}, every heading and sentence, regardless of the language of these instructions.

STRICT DEFINITIONS — respect them exactly:
- OBSERVATION: a specific, factual description of what happened, WITHOUT judgment, interpretation or generalization (ban "toujours", "jamais", "tu es…"). Only what a camera could capture.
- SENTIMENT: the real emotion felt — NOT a thought disguised as a feeling. "Je me sens ignoré / trahi / manipulé" are interpretations, not feelings; prefer real emotions (seul, frustré, inquiet, triste, en colère, déçu).
- BESOIN: the universal human need underneath the feeling (reconnaissance, respect, clarté, sécurité, coopération, autonomie, considération…), never a strategy or a person.
- DEMANDE: a concrete, positive, actionable and NEGOTIABLE request (not a demand or ultimatum), in the present, doable now. A request the other can say no to.

OUTPUT FORMAT — follow EXACTLY. Light Markdown: "## " before each heading, "**bold**" for the four labels and key phrases. No tables.
Start with a 2-line foreword: CNV is a posture (connection), not a technique to win; the goal is to be heard AND to hear.

Then FOUR sections, each opened by "## " numbered 1 to 4 (translate to ${langName}; French shown):

"## 1. Votre message en CNV"
The ready-to-use message, tailored to THIS situation, written in the first person and ready to say aloud, as EXACTLY four labelled lines:
"**Observation :** …", "**Sentiment :** …", "**Besoin :** …", "**Demande :** …".

"## 2. Une variante (plus douce ou plus affirmée)"
A second phrasing of the same four steps — softer OR more assertive depending on what the situation seems to need — kept short, same four labels.

"## 3. Les pièges à éviter ici"
2 to 4 bullets starting with "— ", specific to THIS situation: the judgments/interpretations to turn back into observations (quote the risky phrasing and reformulate it), the false feelings to replace, any non-negotiable demand to soften into a real request.

"## 4. Votre canevas vierge"
The four labels, each followed by a short guiding question in italics, so the user can prepare their own message next time:
"**Observation :** *Quel fait précis, sans interprétation ni jugement ?*" — and the same for Sentiment (*Quelle émotion réelle, pas une pensée ?*), Besoin (*Quel besoin universel derrière l'émotion ?*), Demande (*Quelle demande concrète, positive et négociable ?*).

Tone: warm, human, concrete. Do NOT write any closing salutation or signature — the document adds it automatically.

Situation: ${context}`;
}

// Porte d'entrée : demande le mot de passe (maître ou code d'accès) avant l'app.
function LoginGate({ lang, setLang, onAuth }) {
  const L = getLabels(lang);
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function submit() {
    if (busy || !pw.trim()) return;
    setBusy(true); setErr("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      const data = await res.json();
      if (data.ok) onAuth(data.role);
      else setErr(data.error || L.authWrong);
    } catch (_) { setErr(L.authWrong); }
    setBusy(false);
  }
  return (
    <div className="page">
      <div className="top-bar">
        <div className="pill-group">
          {["fr","de","en"].map(l => (
            <button key={l} className={`pill ${lang===l?"active":""}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>
      <div className="agent-header">
        <h1>Leadership Agent — StrengthsFinder</h1>
        <p>{L.authSub}</p>
      </div>
      <div className="form-section">
        <h2>{L.authTitle}</h2>
        <div className="field-row">
          <label>{L.authPassword}</label>
          <input type="password" value={pw} autoFocus
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder={L.authPlaceholder} />
        </div>
        {err && <div className="import-msg err">{err}</div>}
        <button className="analyze-btn" onClick={submit} disabled={busy} style={{ marginTop: "8px" }}>
          {busy ? L.authChecking : L.authLogin}
        </button>
      </div>
      <div className="brand-footer">
        <span className="brand-by">by</span>
        <span className="brand-name">Optimup</span>
      </div>
    </div>
  );
}

// Panneau admin : génère un code d'accès à durée limitée à donner à un client.
function CodePanel({ lang, onClose }) {
  const L = getLabels(lang);
  const [days, setDays] = useState(7);
  const [code, setCode] = useState("");
  const [exp, setExp] = useState(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  async function gen() {
    setBusy(true); setCopied(false);
    try {
      const res = await fetch("/api/auth/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days }),
      });
      const data = await res.json();
      if (data.ok) { setCode(data.code); setExp(data.expires); }
    } catch (_) {}
    setBusy(false);
  }
  function copy() {
    if (navigator.clipboard) navigator.clipboard.writeText(code);
    setCopied(true);
  }
  return (
    <div className="code-panel">
      <div className="code-panel-head">
        <strong>{L.adminCodes}</strong>
        <button className="remove-btn" onClick={onClose}>✕</button>
      </div>
      <div className="field-row" style={{ marginBottom: "8px" }}>
        <label>{L.codeDays}</label>
        <input type="number" min="1" max="365" value={days}
          onChange={e => setDays(e.target.value)} />
      </div>
      <button className="analyze-btn" onClick={gen} disabled={busy}>
        {busy ? L.authChecking : L.generateCode}
      </button>
      {code && (
        <div className="code-result">
          <div className="code-value">{code}</div>
          <div className="code-actions">
            <button className="pill" onClick={copy}>{copied ? L.copied : L.copyCode}</button>
            <span className="code-exp">{L.codeExpires} {exp ? new Date(exp).toLocaleDateString() : ""}</span>
          </div>
          <div className="code-hint">{L.codeHint}</div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [mode, setMode] = useState("individual");
  const [coachName, setCoachName] = useState("");

  // Authentification : null = vérification en cours, sinon { authed, role }.
  const [authState, setAuthState] = useState(null);
  const [showCodes, setShowCodes] = useState(false);
  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(d => setAuthState(d.authed ? { authed: true, role: d.role } : { authed: false }))
      .catch(() => setAuthState({ authed: false }));
  }, []);
  async function logout() {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch (_) {}
    setAuthState({ authed: false });
    setShowCodes(false);
  }

  // Individual state
  const [indName, setIndName] = useState("");
  const [indRole, setIndRole] = useState("");
  const [indGoal, setIndGoal] = useState("dev");
  const [indLevel, setIndLevel] = useState("leader");
  const [indStrengths, setIndStrengths] = useState(Array(10).fill(""));
  const [indLoading, setIndLoading] = useState(false);
  const [indReport, setIndReport] = useState(null);
  const [indChatMsgs, setIndChatMsgs] = useState([]);
  const [indHistory, setIndHistory] = useState([]);
  const [indContext, setIndContext] = useState("");
  const [indChatInput, setIndChatInput] = useState("");
  const [indChatLoading, setIndChatLoading] = useState(false);
  const indChatRef = useRef(null);
  const [importStatus, setImportStatus] = useState(""); // "", "loading", "ok", "err"
  const [dragOver, setDragOver] = useState(false);

  // Team state
  const [teamName, setTeamName] = useState("");
  const [teamGoal, setTeamGoal] = useState("dynamics");
  const [teamDepartment, setTeamDepartment] = useState("");
  const [teamBusiness, setTeamBusiness] = useState("");
  const [leaderId, setLeaderId] = useState(null);
  const [members, setMembers] = useState([
    { id:1, name:"", strengths:Array(5).fill("") },
    { id:2, name:"", strengths:Array(5).fill("") },
  ]);
  const [nextId, setNextId] = useState(3);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamReport, setTeamReport] = useState(null);
  const [teamChatMsgs, setTeamChatMsgs] = useState([]);
  const [teamHistory, setTeamHistory] = useState([]);
  const [teamContext, setTeamContext] = useState("");
  const [teamChatInput, setTeamChatInput] = useState("");
  const [teamChatLoading, setTeamChatLoading] = useState(false);
  const teamChatRef = useRef(null);
  const [teamImportStatus, setTeamImportStatus] = useState(""); // "", "loading", "ok", "err"
  const [teamImportCount, setTeamImportCount] = useState(0);
  const [teamDragOver, setTeamDragOver] = useState(false);

  // Pair (binôme) state
  const [pairRelation, setPairRelation] = useState("peers");
  const [pairA, setPairA] = useState({ name:"", strengths:Array(10).fill("") });
  const [pairB, setPairB] = useState({ name:"", strengths:Array(10).fill("") });
  const [pairLoading, setPairLoading] = useState(false);
  const [pairReport, setPairReport] = useState(null);
  const [pairChatMsgs, setPairChatMsgs] = useState([]);
  const [pairHistory, setPairHistory] = useState([]);
  const [pairContext, setPairContext] = useState("");
  const [pairChatInput, setPairChatInput] = useState("");
  const [pairChatLoading, setPairChatLoading] = useState(false);
  const pairChatRef = useRef(null);
  const [pairImportStatus, setPairImportStatus] = useState("");
  const [pairDragOver, setPairDragOver] = useState(false);

  // CNV (résolution de conflit) state
  const [cnvSituation, setCnvSituation] = useState("");
  const [cnvWith, setCnvWith] = useState("");
  const [cnvGoal, setCnvGoal] = useState("");
  const [cnvLoading, setCnvLoading] = useState(false);
  const [cnvReport, setCnvReport] = useState(null);
  const [cnvChatMsgs, setCnvChatMsgs] = useState([]);
  const [cnvHistory, setCnvHistory] = useState([]);
  const [cnvContext, setCnvContext] = useState("");
  const [cnvChatInput, setCnvChatInput] = useState("");
  const [cnvChatLoading, setCnvChatLoading] = useState(false);
  const cnvChatRef = useRef(null);

  const L = getLabels(lang);

  function scrollChat(ref) {
    setTimeout(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, 50);
  }

  // Individual analysis
  // Charge pdf.js (une seule fois) pour lire le PDF Gallup côté navigateur.
  function loadPdfJs() {
    return new Promise((resolve, reject) => {
      if (window.pdfjsLib) return resolve(window.pdfjsLib);
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(window.pdfjsLib);
        } else reject(new Error("pdf.js not available"));
      };
      s.onerror = () => reject(new Error("pdf.js load failed"));
      document.head.appendChild(s);
    });
  }

  // Extrait les 10 premières forces depuis le texte de la 1re page du rapport Gallup.
  function extractTop10(pageText) {
    const found = {};
    // Capture chaque motif "N. Mot" (N de 1 à 34) et garde ceux reconnus, rangs 1-10.
    const re = /(\d{1,2})\.\s+([A-Za-zÀ-ÿ'’-]+)/g;
    let m;
    while ((m = re.exec(pageText)) !== null) {
      const num = parseInt(m[1], 10);
      if (num >= 1 && num <= 10 && !found[num]) {
        const eng = toEnglishStrength(m[2]);
        if (eng) found[num] = eng;
      }
    }
    const ordered = [];
    for (let n = 1; n <= 10; n++) if (found[n]) ordered.push(found[n]);
    return ordered;
  }

  async function importGallupPdf(file) {
    if (!file) return;
    setImportStatus("loading");
    try {
      const pdfjsLib = await loadPdfJs();
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const page = await pdf.getPage(1);
      const content = await page.getTextContent();
      const pageText = content.items.map((it) => it.str).join(" ");
      const strengths = extractTop10(pageText);
      if (strengths.length < 5) { setImportStatus("err"); return; }
      // Remplit les champs : on complète à 10 cases.
      const filled = Array(10).fill("");
      strengths.slice(0, 10).forEach((s, i) => { filled[i] = s; });
      setIndStrengths(filled);
      setImportStatus("ok");
    } catch (e) {
      console.error("Import Gallup error:", e);
      setImportStatus("err");
    }
  }

  // ÉQUIPE — lit jusqu'à 12 rapports Gallup et crée un membre par rapport (Top 5).
  async function importTeamPdfs(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type === "application/pdf").slice(0, 15);
    if (files.length === 0) return;
    if ((fileList || []).length > 15) alert(L.importTeamMax);
    setTeamImportStatus("loading");
    try {
      const pdfjsLib = await loadPdfJs();
      const newMembers = [];
      let memberId = nextId;
      for (const file of files) {
        try {
          const buf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          const page = await pdf.getPage(1);
          const content = await page.getTextContent();
          const pageText = content.items.map((it) => it.str).join(" ");
          const top10 = extractTop10(pageText);
          if (top10.length < 3) continue; // rapport illisible, on passe
          const top5 = Array(5).fill("");
          top10.slice(0, 5).forEach((s, i) => { top5[i] = s; });
          // Nom déduit du nom de fichier (sans extension, tirets/underscores en espaces).
          const guessedName = cleanMemberName(file.name);
          newMembers.push({ id: memberId++, name: guessedName, strengths: top5 });
        } catch (e) {
          console.error("Lecture rapport échouée:", file.name, e);
        }
      }
      if (newMembers.length === 0) { setTeamImportStatus("err"); return; }
      // Remplace les membres vides initiaux, garde ceux déjà remplis.
      setMembers(prev => {
        const filled = prev.filter(m => m.name || m.strengths.some(Boolean));
        return [...filled, ...newMembers];
      });
      setNextId(memberId);
      setTeamImportCount(newMembers.length);
      setTeamImportStatus("ok");
    } catch (e) {
      console.error("Import équipe échoué:", e);
      setTeamImportStatus("err");
    }
  }

  async function analyzeIndividual(langOverride) {
    // langOverride peut être un événement (onClick) : on ne le garde que si c'est une vraie langue.
    const lg = (typeof langOverride === "string" && LABELS[langOverride]) ? langOverride : lang;
    const Lg = getLabels(lg);
    const strengths = indStrengths.filter(Boolean);
    if (strengths.length < 3) { alert(Lg.errMin3); return; }
    setIndLoading(true);
    const goalLabel = Lg.goalOptions.find(g => g.v === indGoal)?.l || indGoal;
    const levelLabel = (Lg.levelOptions || []).find(g => g.v === indLevel)?.l || indLevel;
    const levelTag = indLevel === "leader" ? "LEADER" : indLevel === "manager" ? "MANAGER" : "INDIVIDUAL_CONTRIBUTOR";
    const ctx = `Name: ${indName || "Participant"}\nRole: ${indRole || "-"}\nResponsibility level: ${levelLabel} [${levelTag}]\nObjective: ${goalLabel}\nStrengths (ranked): ${strengths.map((s,i) => `${i+1}. ${s}`).join(", ")}`;
    setIndContext(ctx);
    const promptText = lg === "fr"
      ? `Rédige le « Portrait de leadership » complet de ce profil StrengthsFinder en suivant EXACTEMENT la structure de tes consignes : avant-propos « Comment lire ce portrait », puis les cinq sections numérotées (1. portrait, 2. angles morts et risques avec l'encadré « Votre risque majeur », 3. compenser ses fragilités, 4. comment les autres vous perçoivent avec la question silencieuse, 5. deux questions puissantes), puis la signature de Philippe. Objectif du debrief : ${goalLabel}.\n\nProfil : ${ctx}`
      : lg === "de"
      ? `Verfasse das vollständige „Leadership-Portrait" dieses StrengthsFinder-Profils und folge GENAU der Struktur deiner Anweisungen: Vorwort „Wie dieses Porträt zu lesen ist", dann die fünf nummerierten Abschnitte (1. Porträt, 2. blinde Flecken & Risiken mit dem Kasten „Ihr größtes Risiko", 3. Stärken nutzen, um Schwächen auszugleichen, 4. Fremdwahrnehmung mit der stillen Frage, 5. zwei kraftvolle Fragen), dann die Signatur von Philippe. Ziel des Debriefs: ${goalLabel}.\n\nProfil: ${ctx}`
      : `Write the complete "Leadership Portrait" for this StrengthsFinder profile following EXACTLY the structure in your instructions: foreword "How to read this portrait", then the five numbered sections (1. portrait, 2. blind spots & risks with the "Your major risk" call-out, 3. using strengths to compensate weaker areas, 4. how others perceive you with the silent question, 5. two powerful questions), then Philippe's signature. Debrief objective: ${goalLabel}.\n\nProfile: ${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildSystem(lg, ctx), msgs);
      setIndReport({ text: report, strengths });
      setIndHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setIndChatMsgs([{ role:"ag", text: lg==="fr" ? "Debrief généré. Posez vos questions pour approfondir." : lg==="de" ? "Debrief erstellt. Stellen Sie Ihre Fragen." : "Debrief complete. Ask your questions." }]);
    } catch(e) { alert(Lg.errApi); }
    setIndLoading(false);
  }

  async function sendIndChat() {
    if (indChatLoading || !indChatInput.trim()) return;
    const text = indChatInput.trim();
    setIndChatInput("");
    const newMsgs = [...indChatMsgs, { role:"us", text }];
    setIndChatMsgs(newMsgs);
    const newHistory = [...indHistory, { role:"user", content: text }];
    setIndHistory(newHistory);
    setIndChatLoading(true);
    scrollChat(indChatRef);
    try {
      const reply = await callAPI(buildSystem(lang, indContext), newHistory);
      setIndChatMsgs([...newMsgs, { role:"ag", text: reply }]);
      setIndHistory([...newHistory, { role:"assistant", content: reply }]);
    } catch(e) { setIndChatMsgs([...newMsgs, { role:"ag", text:L.errRetry }]); }
    setIndChatLoading(false);
    scrollChat(indChatRef);
  }

  // Team analysis
  function addMember() {
    setMembers([...members, { id:nextId, name:"", strengths:Array(5).fill("") }]);
    setNextId(nextId+1);
  }
  function removeMember(id) { setMembers(members.filter(m => m.id !== id)); if (id === leaderId) setLeaderId(null); }
  function updateMemberName(id, val) { setMembers(members.map(m => m.id===id ? {...m, name:val} : m)); }
  function updateMemberStrength(id, idx, val) { setMembers(members.map(m => m.id===id ? {...m, strengths:m.strengths.map((s,i) => i===idx ? val : s)} : m)); }

  async function analyzeTeam(langOverride) {
    // langOverride peut être un événement (onClick) : on ne le garde que si c'est une vraie langue.
    const lg = (typeof langOverride === "string" && LABELS[langOverride]) ? langOverride : lang;
    const Lg = getLabels(lg);
    const validMembers = members.filter(m => m.strengths.some(Boolean));
    if (validMembers.length < 2) { alert(Lg.errMin2); return; }
    setTeamLoading(true);
    const goalLabel = Lg.teamGoalOptions.find(g => g.v === teamGoal)?.l || teamGoal;
    const leader = members.find(m => m.id === leaderId);
    const leaderName = leader ? (leader.name || "—") : "";
    const membersDesc = validMembers.map((m,i) => {
      const tag = m.id === leaderId ? " [CHEF D'ÉQUIPE]" : "";
      return `${m.name||`Membre ${i+1}`}${tag}: ${m.strengths.filter(Boolean).join(", ")}`;
    }).join("\n");
    const ctxLines = [`Team: ${teamName||"Équipe"}`];
    if (teamDepartment.trim()) ctxLines.push(`Département / Service: ${teamDepartment.trim()}`);
    if (teamBusiness.trim()) ctxLines.push(`Nature du métier / secteur: ${teamBusiness.trim()}`);
    if (leaderName) ctxLines.push(`Chef d'équipe: ${leaderName}`);
    ctxLines.push(`Objective: ${goalLabel}`);
    ctxLines.push(`Members:\n${membersDesc}`);
    // Rapport chiffré exact (calculé par l'appli) injecté pour que l'agent s'y appuie sans recompter.
    const stats = getTeamStats(validMembers);
    const rankingTxt = stats.ranking.map((r,i) => `${i+1}. ${r.name} (${r.domain}) — ${r.pts} pts, ${r.pct}%`).join("\n");
    const domainTxt = stats.domains.slice().sort((a,b)=>b.pts-a.pts).map(d => `${d.key}: ${d.pct}% (${d.pts} pts)`).join(" | ");
    const rareTxt = stats.rare.map(r => r.name).join(", ") || "none";
    const absentTxt = stats.absent.map(r => r.name).join(", ") || "none";
    ctxLines.push(`\nWEIGHTED RANKING (exact, do not recompute):\n${rankingTxt}`);
    ctxLines.push(`\nDOMAIN DISTRIBUTION: ${domainTxt}`);
    ctxLines.push(`\nRARE strengths (only 1 person): ${rareTxt}`);
    ctxLines.push(`\nABSENT strengths (nobody): ${absentTxt}`);
    // Sociodynamique de Fauvet (taux exacts, calculés — ne pas recompter).
    const soc = stats.sociodynamics;
    ctxLines.push(`\nFAUVET SOCIODYNAMICS (exact, do not recompute): Synergy ${soc.synergyPct}% (${soc.synergyPts} pts) | Antagonism ${soc.antagonismPct}% (${soc.antagonismPts} pts) | Neutral/latent ${soc.neutralPct}% (${soc.neutralPts} pts)`);
    ctxLines.push(`Synergy strengths present (cohesion / EGO): ${soc.synergyStrengths.join(", ") || "none"}`);
    ctxLines.push(`Antagonism strengths present (challenge & openness / ECO): ${soc.antagonismStrengths.join(", ") || "none"}`);
    const ctx = ctxLines.join("\n");
    setTeamContext(ctx);
    const allStrengths = validMembers.flatMap(m => m.strengths.filter(Boolean));
    const promptText = lg === "fr"
      ? `Fais l'analyse complète de cette équipe en suivant la structure de tes consignes. Adapte tout au secteur et au département indiqués, et traite la dynamique chef–équipe si un chef est désigné. Objectif prioritaire : ${goalLabel}.\n\nÉquipe :\n${ctx}`
      : lg === "de"
      ? `Erstelle die vollständige Teamanalyse gemäß der Struktur deiner Anweisungen. Passe alles an Branche und Abteilung an und behandle die Leiter–Team-Dynamik, falls ein Leiter markiert ist. Vorrangiges Ziel: ${goalLabel}.\n\nTeam:\n${ctx}`
      : `Provide the complete team analysis following the structure in your instructions. Tailor everything to the stated sector and department, and address the leader–team dynamic if a leader is tagged. Priority objective: ${goalLabel}.\n\nTeam:\n${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildTeamSystem(lg, ctx), msgs);
      setTeamReport({ text: report, strengths: allStrengths, stats, members: validMembers });
      setTeamHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setTeamChatMsgs([{ role:"ag", text: lg==="fr" ? "Analyse générée. Posez vos questions sur l'équipe." : lg==="de" ? "Analyse erstellt." : "Analysis complete. Ask your questions." }]);
    } catch(e) { alert(Lg.errApi); }
    setTeamLoading(false);
  }

  async function sendTeamChat() {
    if (teamChatLoading || !teamChatInput.trim()) return;
    const text = teamChatInput.trim();
    setTeamChatInput("");
    const newMsgs = [...teamChatMsgs, { role:"us", text }];
    setTeamChatMsgs(newMsgs);
    const newHistory = [...teamHistory, { role:"user", content: text }];
    setTeamHistory(newHistory);
    setTeamChatLoading(true);
    scrollChat(teamChatRef);
    try {
      const reply = await callAPI(buildTeamSystem(lang, teamContext), newHistory);
      setTeamChatMsgs([...newMsgs, { role:"ag", text: reply }]);
      setTeamHistory([...newHistory, { role:"assistant", content: reply }]);
    } catch(e) { setTeamChatMsgs([...newMsgs, { role:"ag", text:L.errRetry }]); }
    setTeamChatLoading(false);
    scrollChat(teamChatRef);
  }

  // Pair (binôme) analysis
  function updatePairStrength(which, idx, val) {
    const set = which === "A" ? setPairA : setPairB;
    set(p => ({ ...p, strengths: p.strengths.map((s, i) => i === idx ? val : s) }));
  }

  // Lit jusqu'à 2 rapports Gallup et remplit personne A puis personne B.
  async function importPairPdfs(fileList) {
    const files = Array.from(fileList || []).filter(f => f.type === "application/pdf").slice(0, 2);
    if (files.length === 0) return;
    setPairImportStatus("loading");
    try {
      const pdfjsLib = await loadPdfJs();
      const people = [];
      for (const file of files) {
        try {
          const buf = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
          const page = await pdf.getPage(1);
          const content = await page.getTextContent();
          const pageText = content.items.map((it) => it.str).join(" ");
          const top10 = extractTop10(pageText);
          if (top10.length < 3) continue;
          const filled = Array(10).fill("");
          top10.slice(0, 10).forEach((s, i) => { filled[i] = s; });
          people.push({ name: cleanMemberName(file.name), strengths: filled });
        } catch (e) { console.error("Lecture rapport binôme échouée:", file.name, e); }
      }
      if (people[0]) setPairA(people[0]);
      if (people[1]) setPairB(people[1]);
      setPairImportStatus(people.length >= 2 ? "ok" : "err");
    } catch (e) {
      console.error("Import binôme échoué:", e);
      setPairImportStatus("err");
    }
  }

  async function analyzePair(langOverride) {
    const lg = (typeof langOverride === "string" && LABELS[langOverride]) ? langOverride : lang;
    const Lg = getLabels(lg);
    const aS = pairA.strengths.filter(Boolean);
    const bS = pairB.strengths.filter(Boolean);
    if (aS.length < 3 || bS.length < 3) { alert(Lg.errPairMin); return; }
    setPairLoading(true);
    const relLabel = (Lg.pairRelationOptions.find(r => r.v === pairRelation) || {}).l || pairRelation;
    const relTag = pairRelation === "manager" ? "MANAGER_REPORT" : pairRelation === "cofounders" ? "COFOUNDERS" : pairRelation === "transverse" ? "TRANSVERSE" : "PEERS";
    const stats = getPairStats(pairA.strengths, pairB.strengths);
    const nameA = pairA.name || (relTag === "MANAGER_REPORT" ? "Manager" : "Personne A");
    const nameB = pairB.name || (relTag === "MANAGER_REPORT" ? "Collaborateur" : "Personne B");
    const ctxLines = [
      `Relation: ${relLabel} [${relTag}]`,
      `Person 1${relTag === "MANAGER_REPORT" ? " (MANAGER)" : ""} — ${nameA}: ${aS.map((s, i) => `${i+1}. ${s}`).join(", ")}`,
      `Person 2${relTag === "MANAGER_REPORT" ? " (REPORT)" : ""} — ${nameB}: ${bS.map((s, i) => `${i+1}. ${s}`).join(", ")}`,
      `\nSHARED strengths (resemblance, exact): ${stats.shared.join(", ") || "none"}`,
      `DOMAIN profile ${nameA}: ${JSON.stringify(stats.domA)}`,
      `DOMAIN profile ${nameB}: ${JSON.stringify(stats.domB)}`,
      `COMPLEMENTARY domains (exact): ${stats.complementary.map(c => `${c.domain} present in ${c.strong === "A" ? nameA : nameB}, absent in the other`).join("; ") || "none"}`,
      `FRICTION PAIRS detected (Talent Tension Matrix, exact): ${stats.frictions.map(f => `${f.a} ↔ ${f.b} (${f.desc})`).join("; ") || "none"}`,
    ];
    const ctx = ctxLines.join("\n");
    setPairContext(ctx);
    const promptText = lg === "fr"
      ? `Fais le débrief complet de ce binôme en suivant EXACTEMENT la structure de tes consignes : avant-propos, puis les 5 sections (1. ressemblances, 2. complémentarités, 3. frictions avec l'encadré « La tension la plus structurante », 4. comment mieux travailler ensemble, 5. outil CNV avec un exemple sur-mesure ET un canevas vierge). Adapte tout à la nature de la relation.\n\nBinôme :\n${ctx}`
      : lg === "de"
      ? `Erstelle das vollständige Duo-Debrief GENAU gemäß der Struktur deiner Anweisungen: Vorwort, dann die 5 Abschnitte (1. Ähnlichkeiten, 2. Komplementaritäten, 3. Reibungen mit dem Kasten, 4. besser zusammenarbeiten, 5. GFK-Werkzeug mit maßgeschneidertem Beispiel UND leerer Vorlage). Passe alles an die Art der Beziehung an.\n\nDuo:\n${ctx}`
      : `Provide the complete pair debrief following EXACTLY the structure in your instructions: foreword, then the 5 sections (1. resemblances, 2. complementarities, 3. frictions with the call-out, 4. how to work better together, 5. NVC tool with a tailored example AND a blank canvas). Tailor everything to the relationship type.\n\nPair:\n${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildPairSystem(lg, ctx), msgs);
      setPairReport({ text: report, stats, a: { ...pairA, name: nameA }, b: { ...pairB, name: nameB }, strengths: [...aS, ...bS] });
      setPairHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setPairChatMsgs([{ role:"ag", text: lg==="fr" ? "Débrief du binôme généré. Posez vos questions pour approfondir." : lg==="de" ? "Duo-Debrief erstellt. Stellen Sie Ihre Fragen." : "Pair debrief complete. Ask your questions." }]);
    } catch(e) { alert(Lg.errApi); }
    setPairLoading(false);
  }

  async function sendPairChat() {
    if (pairChatLoading || !pairChatInput.trim()) return;
    const text = pairChatInput.trim();
    setPairChatInput("");
    const newMsgs = [...pairChatMsgs, { role:"us", text }];
    setPairChatMsgs(newMsgs);
    const newHistory = [...pairHistory, { role:"user", content: text }];
    setPairHistory(newHistory);
    setPairChatLoading(true);
    scrollChat(pairChatRef);
    try {
      const reply = await callAPI(buildPairSystem(lang, pairContext), newHistory);
      setPairChatMsgs([...newMsgs, { role:"ag", text: reply }]);
      setPairHistory([...newHistory, { role:"assistant", content: reply }]);
    } catch(e) { setPairChatMsgs([...newMsgs, { role:"ag", text:L.errRetry }]); }
    setPairChatLoading(false);
    scrollChat(pairChatRef);
  }

  // CNV (résolution de conflit) analysis
  async function analyzeCnv(langOverride) {
    const lg = (typeof langOverride === "string" && LABELS[langOverride]) ? langOverride : lang;
    const Lg = getLabels(lg);
    if (!cnvSituation.trim()) { alert(Lg.errCnvMin); return; }
    setCnvLoading(true);
    const ctxLines = [`Situation described by the user: ${cnvSituation.trim()}`];
    if (cnvWith.trim()) ctxLines.push(`The message is addressed to: ${cnvWith.trim()}`);
    if (cnvGoal.trim()) ctxLines.push(`What the user would like to obtain: ${cnvGoal.trim()}`);
    const ctx = ctxLines.join("\n");
    setCnvContext(ctx);
    const promptText = lg === "fr"
      ? `Transforme cette situation en message de Communication NonViolente en suivant EXACTEMENT la structure de tes consignes (message O·S·B·D prêt à dire, une variante, les pièges à éviter, puis le canevas vierge).\n\n${ctx}`
      : lg === "de"
      ? `Verwandle diese Situation GENAU gemäß der Struktur deiner Anweisungen in eine Botschaft der Gewaltfreien Kommunikation (fertige B·G·B·B-Botschaft, eine Variante, die Fallstricke, dann die leere Vorlage).\n\n${ctx}`
      : `Transform this situation into a Nonviolent Communication message following EXACTLY the structure in your instructions (ready-to-say O·F·N·R message, one variant, the pitfalls, then the blank canvas).\n\n${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildCnvSystem(lg, ctx), msgs);
      setCnvReport({ text: report });
      setCnvHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setCnvChatMsgs([{ role:"ag", text: lg==="fr" ? "Message CNV généré. Affinez-le ou testez une reformulation." : lg==="de" ? "GFK-Botschaft erstellt. Verfeinern Sie sie." : "NVC message ready. Refine it or try a rephrasing." }]);
    } catch(e) { alert(Lg.errApi); }
    setCnvLoading(false);
  }

  async function sendCnvChat() {
    if (cnvChatLoading || !cnvChatInput.trim()) return;
    const text = cnvChatInput.trim();
    setCnvChatInput("");
    const newMsgs = [...cnvChatMsgs, { role:"us", text }];
    setCnvChatMsgs(newMsgs);
    const newHistory = [...cnvHistory, { role:"user", content: text }];
    setCnvHistory(newHistory);
    setCnvChatLoading(true);
    scrollChat(cnvChatRef);
    try {
      const reply = await callAPI(buildCnvSystem(lang, cnvContext), newHistory);
      setCnvChatMsgs([...newMsgs, { role:"ag", text: reply }]);
      setCnvHistory([...newHistory, { role:"assistant", content: reply }]);
    } catch(e) { setCnvChatMsgs([...newMsgs, { role:"ag", text:L.errRetry }]); }
    setCnvChatLoading(false);
    scrollChat(cnvChatRef);
  }

  // Charge jsPDF depuis un CDN (une seule fois), avec un CDN de secours.
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("load failed: " + src));
      document.head.appendChild(s);
    });
  }

  async function loadJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    const cdns = [
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
      "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
      "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
    ];
    for (const url of cdns) {
      try {
        await loadScript(url);
        if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
      } catch (e) {
        // on essaie le CDN suivant
      }
    }
    throw new Error("jsPDF indisponible (tous les CDN ont échoué)");
  }

  async function downloadPdf(recipientName, reportText, stats, members) {
    try {
      const jsPDF = await loadJsPDF();
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageW = 210, pageH = 297;
      const marginX = 22, marginTop = 24, marginBottom = 22;
      const maxW = pageW - marginX * 2;
      let y = marginTop;

      const ensureSpace = (h) => {
        if (y + h > pageH - marginBottom) { doc.addPage(); y = marginTop; }
      };
      const writeBlock = (text, { size = 11, style = "normal", gap = 5, color = [40, 40, 40] } = {}) => {
        doc.setFont("times", style);
        doc.setFontSize(size);
        doc.setTextColor(color[0], color[1], color[2]);
        const lines = doc.splitTextToSize(text, maxW);
        lines.forEach((line) => {
          ensureSpace(size * 0.5);
          doc.text(line, marginX, y);
          y += size * 0.5;
        });
        y += gap;
      };

      writeBlock(L.pdfTitle, { size: 18, style: "bold", gap: 10, color: [20, 20, 20] });
      const greet = recipientName && recipientName.trim() ? recipientName.trim() : "";
      writeBlock(L.letterGreeting(greet), { size: 13, style: "bold", gap: 6 });
      writeBlock(L.letterIntro, { size: 11, style: "italic", gap: 8, color: [70, 70, 70] });

      // ===== RAPPORT CHIFFRÉ (équipe uniquement) =====
      if (stats && stats.ranking) {
        const DC = { Executing:[124,111,214], Influencing:[201,136,31], Relationship:[62,132,214], Thinking:[46,158,120] };
        const domLabel = { Executing:L.executing, Influencing:L.influencing, Relationship:L.relationship, Thinking:L.thinking };

        // Bandeau de section violet.
        const sectionBanner = (label) => {
          ensureSpace(12);
          doc.setFillColor(59, 50, 112);
          doc.roundedRect(marginX, y, maxW, 8, 1.5, 1.5, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(11);
          doc.setTextColor(255, 255, 255);
          doc.text(label, marginX + 4, y + 5.5);
          y += 13;
        };

        // 1. Forces par personne (en premier).
        const mems = (members || []).filter(m => m.strengths.some(Boolean));
        if (mems.length > 0) {
          sectionBanner(L.statsByPerson);
          // Disposition en 2 colonnes de cartes.
          const colW = (maxW - 6) / 2;
          let col = 0, rowStartY = y;
          mems.forEach((m, idx) => {
            const cardX = marginX + col * (colW + 6);
            const cardLines = m.strengths.filter(Boolean).length;
            const cardH = 8 + cardLines * 5 + 3;
            if (col === 0) { ensureSpace(cardH); rowStartY = y; }
            const cx = cardX, cy = rowStartY;
            doc.setDrawColor(230, 230, 230);
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(cx, cy - 4, colW, cardH, 1.5, 1.5, "FD");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(40, 40, 40);
            doc.text(m.name || `${L.member} ${idx+1}`, cx + 4, cy + 1);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            m.strengths.filter(Boolean).forEach((s, j) => {
              const c = DC[getDomain(s)] || [120,120,120];
              const ly = cy + 6 + j * 5;
              doc.setTextColor(180, 180, 180);
              doc.text(`${j+1}`, cx + 4, ly);
              doc.setFillColor(c[0], c[1], c[2]);
              doc.circle(cx + 8.5, ly - 1, 1, "F");
              doc.setTextColor(50, 50, 50);
              doc.text(s, cx + 11, ly);
            });
            if (col === 1) { y = rowStartY + cardH + 4; col = 0; }
            else { col = 1; if (idx === mems.length - 1) y = rowStartY + cardH + 4; }
          });
          y += 4;
        }

        // 2. Répartition par domaine (lignes avec barre proportionnelle).
        sectionBanner(L.statsByDomain);
        const sorted = stats.domains.slice().sort((a,b)=>b.pts-a.pts);
        sorted.forEach((d) => {
          ensureSpace(8);
          const c = DC[d.key] || [120,120,120];
          doc.setFillColor(c[0], c[1], c[2]);
          doc.circle(marginX + 1.5, y - 1, 1.3, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(40, 40, 40);
          doc.text(`${domLabel[d.key]}`, marginX + 5, y);
          doc.setTextColor(c[0], c[1], c[2]);
          doc.text(`${d.pct}%`, marginX + 55, y);
          doc.setTextColor(150, 150, 150);
          doc.setFont("helvetica", "normal");
          doc.text(`${d.pts} pts`, marginX + 72, y);
          // Barre proportionnelle.
          const barX = marginX + 90, barMaxW = maxW - 90;
          doc.setFillColor(238, 238, 238);
          doc.roundedRect(barX, y - 3, barMaxW, 3.5, 0.8, 0.8, "F");
          doc.setFillColor(c[0], c[1], c[2]);
          doc.roundedRect(barX, y - 3, barMaxW * d.pct / 100, 3.5, 0.8, 0.8, "F");
          y += 7;
        });
        y += 4;

        // 3. Classement pondéré (tableau).
        sectionBanner(L.statsRanking);
        doc.setFontSize(9);
        stats.ranking.forEach((r, i) => {
          ensureSpace(6.5);
          if (i % 2 === 1) {
            doc.setFillColor(250, 249, 247);
            doc.rect(marginX, y - 4, maxW, 6, "F");
          }
          const c = DC[r.domain] || [120,120,120];
          doc.setTextColor(170, 170, 170);
          doc.setFont("helvetica", "normal");
          doc.text(`${i+1}`, marginX + 1, y);
          doc.setFillColor(c[0], c[1], c[2]);
          doc.circle(marginX + 8, y - 1, 1.1, "F");
          doc.setTextColor(40, 40, 40);
          doc.setFont("helvetica", "bold");
          doc.text(r.name, marginX + 12, y);
          doc.setTextColor(c[0], c[1], c[2]);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text(domLabel[r.domain], marginX + 95, y);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.text(`${r.pts}`, marginX + 150, y, { align: "right" });
          doc.setTextColor(150, 150, 150);
          doc.setFont("helvetica", "normal");
          doc.text(`${r.pct}%`, marginX + 166, y, { align: "right" });
          y += 6;
        });
        y += 6;

        // 4. Sociodynamique de Fauvet (synergie / antagonisme / neutre), lignes à barre.
        sectionBanner(L.statsSocio);
        const soc = stats.sociodynamics;
        [
          { label:L.socioSynergy, c:[46,158,120], pct:soc.synergyPct, pts:soc.synergyPts },
          { label:L.socioAntagonism, c:[201,136,31], pct:soc.antagonismPct, pts:soc.antagonismPts },
          { label:L.socioNeutral, c:[185,179,168], pct:soc.neutralPct, pts:soc.neutralPts },
        ].forEach((d) => {
          ensureSpace(8);
          doc.setFillColor(d.c[0], d.c[1], d.c[2]);
          doc.circle(marginX + 1.5, y - 1, 1.3, "F");
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(40, 40, 40);
          doc.text(d.label, marginX + 5, y);
          doc.setTextColor(d.c[0], d.c[1], d.c[2]);
          doc.text(`${d.pct}%`, marginX + 55, y);
          doc.setTextColor(150, 150, 150);
          doc.setFont("helvetica", "normal");
          doc.text(`${d.pts} pts`, marginX + 72, y);
          const barX = marginX + 90, barMaxW = maxW - 90;
          doc.setFillColor(238, 238, 238);
          doc.roundedRect(barX, y - 3, barMaxW, 3.5, 0.8, 0.8, "F");
          doc.setFillColor(d.c[0], d.c[1], d.c[2]);
          doc.roundedRect(barX, y - 3, barMaxW * d.pct / 100, 3.5, 0.8, 0.8, "F");
          y += 7;
        });
        y += 4;

        // Nouvelle page pour le débrief texte, plus aéré.
        doc.addPage();
        y = marginTop;
      }

      // Écrit le débrief en interprétant le Markdown léger : "## Titre" -> titre gras.
      (reportText || "").split("\n").forEach((raw) => {
        const t = raw.trim();
        if (t === "") { y += 2; return; }
        const clean = t.replace(/\*\*(.+?)\*\*/g, "$1"); // retire le gras inline
        if (/^#{1,6}\s+/.test(t)) {
          const title = clean.replace(/^#{1,6}\s+/, "");
          y += 3;
          writeBlock(title, { size: 11, style: "normal", gap: 3 });
        } else {
          writeBlock(clean, { size: 11, style: "normal", gap: 4 });
        }
      });
      y += 4;

      ensureSpace(20);
      writeBlock(L.letterClose, { size: 11, style: "normal", gap: 3 });
      writeBlock(coachName && coachName.trim() ? coachName.trim() : "", { size: 12, style: "bold", gap: 0 });

      // Signature de marque "by [logo Optimup]", centrée en pied de page.
      const logoW = 34;                       // largeur du logo en mm
      const logoH = logoW * OPTIMUP_LOGO_RATIO; // hauteur proportionnelle
      const byText = "by";
      doc.setFont("times", "italic");
      doc.setFontSize(10);
      doc.setTextColor(130, 130, 130);
      const byW = doc.getTextWidth(byText);
      const gap = 2;                          // espace entre "by" et le logo
      const totalW = byW + gap + logoW;
      const startX = (pageW - totalW) / 2;
      const baseY = pageH - 14;               // ligne de pied de page
      doc.text(byText, startX, baseY);
      try {
        doc.addImage(OPTIMUP_LOGO, "JPEG", startX + byW + gap, baseY - logoH + 2, logoW, logoH);
      } catch (imgErr) {
        // Si l'image échoue, on retombe sur le texte.
        doc.text("Optimup", startX + byW + gap, baseY);
      }

      const safeName = (greet || "debrief").replace(/[^a-z0-9]/gi, "_");
      doc.save(`debrief_${safeName}.pdf`);
    } catch (e) {
      alert("PDF — détail de l'erreur : " + (e && e.message ? e.message : String(e)));
      console.error("PDF error:", e);
    }
  }


  // Charge la lib docx depuis un CDN (une seule fois), avec CDN de secours.
  async function loadDocx() {
    if (window.docx) return window.docx;
    const urls = [
      "https://cdnjs.cloudflare.com/ajax/libs/docx/8.5.0/index.umd.js",
      "https://unpkg.com/docx@8.5.0/build/index.umd.js",
      "https://cdn.jsdelivr.net/npm/docx@8.5.0/build/index.umd.js",
    ];
    for (const src of urls) {
      try {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = src; s.onload = resolve; s.onerror = reject;
          document.head.appendChild(s);
        });
        if (window.docx) return window.docx;
      } catch (_) { /* essaie le CDN suivant */ }
    }
    throw new Error("docx indisponible (tous les CDN ont échoué)");
  }

  // Génère un .docx à la charte Optimup (Arial, orange #E8590C, encadrés à filet gauche).
  // recipientName : prénom ; reportText : markdown léger du débrief ; subtitle : rôle/poste ou nom d'équipe.
  async function downloadWord(recipientName, reportText, subtitle, headStrengths) {
    try {
      const D = await loadDocx();
      const {
        Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Footer, AlignmentType, LevelFormat, TabStopType, BorderStyle,
        WidthType, ShadingType, PageNumber, ImageRun,
      } = D;

      const FONT = "Arial";
      const ACCENT = "E8590C", DARK = "1F2933", GREY = "6B7280", LIGHT = "FDF1E7", LIGHT2 = "F7F8FA";
      const noB = { top:{style:BorderStyle.NONE}, bottom:{style:BorderStyle.NONE}, left:{style:BorderStyle.NONE}, right:{style:BorderStyle.NONE}, insideHorizontal:{style:BorderStyle.NONE}, insideVertical:{style:BorderStyle.NONE} };

      // Convertit "**gras**" et "*italique*" d'une ligne en runs TextRun.
      function inlineRuns(text, base = {}) {
        // On retire d'abord les astérisques d'italique encadrant toute la ligne, puis on gère le gras inline.
        let s = String(text);
        const wholeItalic = /^\*([^*].*[^*])\*$/.test(s) && !s.includes("**");
        if (wholeItalic) s = s.replace(/^\*(.*)\*$/, "$1");
        const italics = base.italics || wholeItalic;
        const parts = s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return parts.map((p) => {
          const m = p.match(/^\*\*([^*]+)\*\*$/);
          const clean = (m ? m[1] : p).replace(/\*/g, ""); // nettoie tout astérisque résiduel
          return new TextRun({ text: clean, bold: m ? true : (base.bold || false), italics, font: FONT, size: base.size || 22, color: base.color || DARK });
        });
      }
      function bodyPara(text, opts = {}) {
        return new Paragraph({ spacing:{ after:160, line:300 }, alignment:AlignmentType.JUSTIFIED, children: inlineRuns(text, opts) });
      }
      // Encadré à filet gauche orange (pour "risque majeur" et "question silencieuse").
      function calloutBox(text, italics) {
        return new Table({
          width:{ size:9026, type:WidthType.DXA }, columnWidths:[9026],
          borders:{ ...noB, left:{ style:BorderStyle.SINGLE, size:24, color:ACCENT } },
          rows:[ new TableRow({ children:[ new TableCell({
            width:{ size:9026, type:WidthType.DXA },
            shading:{ fill:LIGHT, type:ShadingType.CLEAR },
            margins:{ top:160, bottom:160, left:240, right:240 },
            borders:{ ...noB, left:{ style:BorderStyle.SINGLE, size:24, color:ACCENT } },
            children:[ new Paragraph({ spacing:{ after:0, line:300 }, children: inlineRuns(text, { size:23, italics: !!italics }) }) ],
          }) ] }) ],
        });
      }
      function sectionTitle(line) {
        // line ex. "## 1. Vos forces en action" ou "## La signature de l'équipe"
        const clean = line.replace(/^#{1,6}\s+/, "");
        const m = clean.match(/^(\d+\.)\s*(.*)$/);
        const num = m ? m[1] : "", rest = m ? m[2] : clean;
        return new Paragraph({
          spacing:{ before:320, after:160 },
          border:{ bottom:{ style:BorderStyle.SINGLE, size:10, color:ACCENT, space:6 } },
          children:[
            ...(num ? [new TextRun({ text:num + "  ", font:FONT, size:26, bold:true, color:ACCENT })] : []),
            new TextRun({ text: rest.toUpperCase(), font:FONT, size:24, bold:true, color:DARK, characterSpacing:20 }),
          ],
        });
      }

      // Tableau des 10 forces en deux colonnes (si on a la liste).
      function strengthsTable(list) {
        const col1 = list.slice(0,5), col2 = list.slice(5,10);
        const mkCol = (arr, offset) => new TableCell({
          width:{ size:4513, type:WidthType.DXA }, borders:noB,
          shading:{ fill:LIGHT2, type:ShadingType.CLEAR },
          margins:{ top:160, bottom:160, left:240, right:240 },
          children: arr.map((s, j) => new Paragraph({ spacing:{ after:40 }, children:[
            new TextRun({ text:String(offset+j+1).padStart(2,"0")+"  ", font:FONT, size:19, bold:true, color:ACCENT }),
            new TextRun({ text:s, font:FONT, size:21, bold:true, color:DARK }),
          ]})),
        });
        return new Table({ width:{ size:9026, type:WidthType.DXA }, columnWidths:[4513,4513], borders:noB,
          rows:[ new TableRow({ children:[ mkCol(col1,0), mkCol(col2,5) ] }) ] });
      }

      // ---- Construit le corps à partir du markdown léger du rapport ----
      const children = [
        new Paragraph({ spacing:{ after:60 }, children:[ new TextRun({ text:"Portrait de talents", font:FONT, size:52, bold:true, color:DARK }) ] }),
        new Paragraph({ spacing:{ after:280 }, border:{ bottom:{ style:BorderStyle.SINGLE, size:12, color:ACCENT, space:8 } },
          children:[ new TextRun({ text: (subtitle ? recipientName + "  ·  " + subtitle : recipientName), font:FONT, size:26, color:GREY }) ] }),
      ];

      if (Array.isArray(headStrengths) && headStrengths.length >= 3) {
        children.push(new Paragraph({ spacing:{ after:120 }, children:[ new TextRun({ text:"VOS 10 FORCES DOMINANTES", font:FONT, size:20, bold:true, color:DARK, characterSpacing:30 }) ] }));
        children.push(strengthsTable(headStrengths));
        children.push(new Paragraph({ spacing:{ after:120 }, children:[] }));
      }

      const lines = String(reportText || "").split("\n");
      for (let raw of lines) {
        const t = raw.trim();
        if (t === "") continue;
        if (/^#{1,6}\s+/.test(t)) { children.push(sectionTitle(t)); continue; }
        const low = t.toLowerCase();
        // Encadrés : risque majeur / risque systémique / question silencieuse
        if (/^\*?\*?(votre risque majeur|le risque systémique)/i.test(t) || low.includes("question silencieuse")) {
          children.push(calloutBox(t, low.includes("question silencieuse")));
          continue;
        }
        // Puces "— " ou "- "
        if (/^[—-]\s+/.test(t)) {
          children.push(new Paragraph({ numbering:{ reference:"bullets", level:0 }, spacing:{ after:80, line:300 },
            children: inlineRuns(t.replace(/^[—-]\s+/, "")) }));
          continue;
        }
        children.push(bodyPara(t));
      }

      children.push(new Paragraph({ spacing:{ before:480, after:60 }, children:[ new TextRun({ text:"Avec toute ma confiance,", font:FONT, italics:true, color:GREY }) ] }));
      children.push(new Paragraph({ children:[ new TextRun({ text: (coachName && coachName.trim()) ? coachName.trim() : "Philippe", font:FONT, size:26, bold:true }) ] }));

      const doc = new Document({
        styles:{ default:{ document:{ run:{ font:FONT, size:22, color:DARK } } } },
        numbering:{ config:[{ reference:"bullets", levels:[{ level:0, format:LevelFormat.BULLET, text:"—", alignment:AlignmentType.LEFT, style:{ paragraph:{ indent:{ left:360, hanging:360 } } } }] }] },
        sections:[{
          properties:{ page:{ size:{ width:11906, height:16838 }, margin:{ top:1280, right:1440, bottom:1280, left:1440 } } },
          footers:{ default: new Footer({ children:[
            // Logo Optimup centré
            new Paragraph({ alignment:AlignmentType.CENTER, spacing:{ after:40 }, children:[
              new ImageRun({
                data: Uint8Array.from(atob(OPTIMUP_LOGO.split(",")[1]), c => c.charCodeAt(0)),
                transformation:{ width:110, height:Math.round(110 * OPTIMUP_LOGO_RATIO) },
              }),
            ] }),
            // Ligne contact en orange
            new Paragraph({ alignment:AlignmentType.CENTER, spacing:{ after:60 }, children:[
              new TextRun({ text:"Débrief des forces et talents par Optimup! · Rue Pedro Meylan 1, 1205 Genève · pkassenbeck@optimup.ch", font:FONT, size:15, color:ACCENT }),
            ] }),
            // Numéro de page
            new Paragraph({ tabStops:[{ type:TabStopType.RIGHT, position:9026 }], children:[
              new TextRun({ text:"\t", font:FONT }),
              new TextRun({ children:[PageNumber.CURRENT], font:FONT, size:16, color:GREY }),
            ] }),
          ] }) },
          children,
        }],
      });

      const blob = await Packer.toBlob(doc);
      const safeName = (recipientName || "debrief").replace(/[^a-z0-9]/gi, "_");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `debrief_${safeName}.docx`;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (e) {
      alert("Word — détail de l'erreur : " + (e && e.message ? e.message : String(e)));
      console.error("Word error:", e);
    }
  }

  // Change la langue ; si un débrief est déjà affiché, le régénère dans la nouvelle langue.
  function changeLang(newLang) {
    if (!LABELS[newLang]) return; // ignore toute langue inconnue
    if (newLang === lang) return;
    setLang(newLang);
    if (mode === "individual" && indReport) {
      analyzeIndividual(newLang);
    } else if (mode === "team" && teamReport) {
      analyzeTeam(newLang);
    } else if (mode === "pair" && pairReport) {
      analyzePair(newLang);
    } else if (mode === "cnv" && cnvReport) {
      analyzeCnv(newLang);
    }
  }

  // Porte d'authentification : rien tant qu'on vérifie, puis login si non connecté.
  if (authState === null) {
    return <div className="page"><div className="agent-header"><p>{L.authChecking}</p></div></div>;
  }
  if (!authState.authed) {
    return <LoginGate lang={lang} setLang={setLang} onAuth={(role) => setAuthState({ authed: true, role })} />;
  }

  return (
    <div className="page">
      {/* Datalist */}
      <datalist id="sf-list">
        {ALL34.map(s => <option key={s} value={s} />)}
      </datalist>

      {/* Top bar */}
      <div className="top-bar">
        <div className="pill-group">
          {["fr","de","en"].map(l => (
            <button key={l} className={`pill ${lang===l?"active":""}`} onClick={() => changeLang(l)}>{l.toUpperCase()}</button>
          ))}
        </div>
        <div className="pill-group">
          <button className={`mode-pill ${mode==="individual"?"active":""}`} onClick={() => setMode("individual")}>{L.individual}</button>
          <button className={`mode-pill ${mode==="team"?"active":""}`} onClick={() => setMode("team")}>{L.team}</button>
          <button className={`mode-pill ${mode==="pair"?"active":""}`} onClick={() => setMode("pair")}>{L.pair}</button>
          <button className={`mode-pill ${mode==="cnv"?"active":""}`} onClick={() => setMode("cnv")}>{L.cnv}</button>
        </div>
        <div className="pill-group" style={{ marginLeft: "auto" }}>
          {authState.role === "admin" && (
            <button className={`pill ${showCodes ? "active" : ""}`} onClick={() => setShowCodes(v => !v)}>{L.codesBtn}</button>
          )}
          <button className="pill" onClick={logout}>{L.logout}</button>
        </div>
      </div>

      {authState.role === "admin" && showCodes && (
        <CodePanel lang={lang} onClose={() => setShowCodes(false)} />
      )}

      {/* Header */}
      <div className="agent-header">
        <h1>Leadership Agent — StrengthsFinder</h1>
        <p>{mode==="individual" ? L.headerSub : mode==="team" ? L.headerSubTeam : mode==="pair" ? L.headerSubPair : L.headerSubCnv}</p>
      </div>

      {/* INDIVIDUAL MODE */}
      {mode === "individual" && !indReport && (
        <div>
          <div className="form-section">
            <h2>{L.identity}</h2>
            <div className="field-row">
              <label>{L.name}</label>
              <input type="text" value={indName} onChange={e => setIndName(e.target.value)} placeholder={L.phName} />
            </div>
            <div className="field-row">
              <label>{L.role}</label>
              <input type="text" value={indRole} onChange={e => setIndRole(e.target.value)} placeholder={L.phRole} />
            </div>
            <div className="field-row">
              <label>{L.coachName}</label>
              <input type="text" value={coachName} onChange={e => setCoachName(e.target.value)} placeholder={L.phCoach} />
            </div>
          </div>
          <div className="form-section">
            <label
              className={`import-btn${dragOver ? " dragover" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
              onDrop={e => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files && e.dataTransfer.files[0];
                if (f) importGallupPdf(f);
              }}
            >
              <input type="file" accept="application/pdf"
                onChange={e => importGallupPdf(e.target.files && e.target.files[0])}
                style={{ display: "none" }} />
              {importStatus === "loading" ? L.importing : (dragOver ? L.importDrop : L.importPdf)}
            </label>
            {importStatus === "ok" && <div className="import-msg ok">{L.importOk}</div>}
            {importStatus === "err" && <div className="import-msg err">{L.importErr}</div>}
          </div>
          <div className="form-section">
            <h2>{L.top5}</h2>
            <div className="strengths-grid">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="strength-field">
                  <div className="rank-badge">{i+1}</div>
                  <input type="text" list="sf-list" value={indStrengths[i]} onChange={e => setIndStrengths(indStrengths.map((s,j) => j===i ? e.target.value : s))} placeholder={`${L.strength} ${i+1}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="form-section">
            <h2>{L.top10}</h2>
            <div className="strengths-grid">
              {[5,6,7,8,9].map(i => (
                <div key={i} className="strength-field">
                  <div className="rank-badge">{i+1}</div>
                  <input type="text" list="sf-list" value={indStrengths[i]} onChange={e => setIndStrengths(indStrengths.map((s,j) => j===i ? e.target.value : s))} placeholder={`${L.strength} ${i+1} (${L.optional})`} />
                </div>
              ))}
            </div>
          </div>
          <div className="form-section">
            <h2>{L.context}</h2>
            <div className="field-row">
              <label>{L.level}</label>
              <select value={indLevel} onChange={e => setIndLevel(e.target.value)}>
                {(L.levelOptions || []).map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </div>
            <div className="field-row">
              <label>{L.goal}</label>
              <select value={indGoal} onChange={e => setIndGoal(e.target.value)}>
                {L.goalOptions.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </div>
          </div>
          <button className="analyze-btn" onClick={analyzeIndividual} disabled={indLoading}>
            {indLoading ? L.analyzing : L.analyze}
          </button>
        </div>
      )}

      {mode === "individual" && indReport && (
        <div>
          <button className="back-btn" onClick={() => { setIndReport(null); setIndChatMsgs([]); setIndHistory([]); }}>{L.back}</button>
          <DomainsBar strengths={indReport.strengths} L={L} />
          <div className="report-area">
            <div className="report-content"><RichText text={indReport.text} /></div>
          </div>
          <button className="pdf-btn" onClick={() => downloadPdf(indName, indReport.text)}>{L.downloadPdf}</button>
          <button className="pdf-btn" onClick={() => downloadWord(indName, indReport.text, indRole, indReport.strengths)}>{L.downloadWord}</button>
          <ChatArea messages={indChatMsgs} chatAreaRef={indChatRef} />
          <div className="chat-input-row">
            <textarea rows={2} value={indChatInput} onChange={e => setIndChatInput(e.target.value)}
              placeholder={L.chatPlaceholder}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendIndChat();} }} />
            <button className="send-btn" onClick={sendIndChat} disabled={indChatLoading}>↑</button>
          </div>
        </div>
      )}

      {/* TEAM MODE */}
      {mode === "team" && !teamReport && (
        <div>
          <div className="form-section">
            <h2>{L.teamName}</h2>
            <div className="field-row">
              <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder={L.phTeam} />
            </div>
            <div className="field-row" style={{marginTop:"8px"}}>
              <label>{L.teamGoal}</label>
              <select value={teamGoal} onChange={e => setTeamGoal(e.target.value)}>
                {L.teamGoalOptions.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </div>
            <div className="field-row" style={{marginTop:"8px"}}>
              <label>{L.department}</label>
              <input type="text" value={teamDepartment} onChange={e => setTeamDepartment(e.target.value)} placeholder={L.phDepartment} />
            </div>
            <div className="field-row" style={{marginTop:"8px"}}>
              <label>{L.business}</label>
              <input type="text" value={teamBusiness} onChange={e => setTeamBusiness(e.target.value)} placeholder={L.phBusiness} />
            </div>
          </div>
          <div className="form-section">
            <label
              className={`import-btn${teamDragOver ? " dragover" : ""}`}
              onDragOver={e => { e.preventDefault(); setTeamDragOver(true); }}
              onDragLeave={e => { e.preventDefault(); setTeamDragOver(false); }}
              onDrop={e => {
                e.preventDefault();
                setTeamDragOver(false);
                importTeamPdfs(e.dataTransfer.files);
              }}
            >
              <input type="file" accept="application/pdf" multiple
                onChange={e => importTeamPdfs(e.target.files)}
                style={{ display: "none" }} />
              {teamImportStatus === "loading" ? L.importingTeam : (teamDragOver ? L.importTeamDrop : L.importTeam)}
            </label>
            {teamImportStatus === "ok" && <div className="import-msg ok">{L.importTeamOk(teamImportCount)}</div>}
            {teamImportStatus === "err" && <div className="import-msg err">{L.importTeamErr}</div>}
          </div>
          <div className="form-section">
            <h2>{L.members}</h2>
            <p style={{fontSize:"13px",color:"#8a8a8a",marginTop:"-4px",marginBottom:"12px"}}>{L.teamLeaderHint}</p>
            {members.map((m, idx) => (
              <div key={m.id} className="member-card">
                <div className="member-header">
                  <span>{L.members} {idx+1}{m.id === leaderId ? ` · ${L.teamLeader} ⭐` : ""}</span>
                  <span>
                    <button
                      className="remove-btn"
                      title={L.teamLeader}
                      onClick={() => setLeaderId(m.id === leaderId ? null : m.id)}
                      style={{ color: m.id === leaderId ? "#C9A96E" : "#cccccc", marginRight: members.length > 2 ? "6px" : "0" }}
                    >
                      {m.id === leaderId ? "★" : "☆"}
                    </button>
                    {members.length > 2 && <button className="remove-btn" onClick={() => removeMember(m.id)}>✕</button>}
                  </span>
                </div>
                <div className="field-row" style={{marginBottom:"8px"}}>
                  <input type="text" value={m.name} onChange={e => updateMemberName(m.id, e.target.value)} placeholder={L.name} />
                </div>
                <div className="strengths-grid">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="strength-field">
                      <div className="rank-badge">{i+1}</div>
                      <input type="text" list="sf-list" value={m.strengths[i]} onChange={e => updateMemberStrength(m.id, i, e.target.value)} placeholder={`${L.strength} ${i+1}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="add-member-btn" onClick={addMember}>{L.addMember}</button>
          </div>
          <button className="analyze-btn" onClick={analyzeTeam} disabled={teamLoading}>
            {teamLoading ? L.analyzing : L.analyzeTeam}
          </button>
        </div>
      )}

      {mode === "team" && teamReport && (
        <div>
          <button className="back-btn" onClick={() => { setTeamReport(null); setTeamChatMsgs([]); setTeamHistory([]); }}>{L.backTeam}</button>
          <DomainsBar strengths={teamReport.strengths} L={L} />
          {teamReport.stats && <TeamStatsTable stats={teamReport.stats} members={teamReport.members} L={L} />}
          <div className="report-area">
            <div className="report-content"><RichText text={teamReport.text} /></div>
          </div>
          <button className="pdf-btn" onClick={() => downloadPdf(teamName, teamReport.text, teamReport.stats, teamReport.members)}>{L.downloadPdf}</button>
          <button className="pdf-btn" onClick={() => downloadWord(teamName, teamReport.text, teamName)}>{L.downloadWord}</button>
          <ChatArea messages={teamChatMsgs} chatAreaRef={teamChatRef} />
          <div className="chat-input-row">
            <textarea rows={2} value={teamChatInput} onChange={e => setTeamChatInput(e.target.value)}
              placeholder={L.teamChatPlaceholder}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendTeamChat();} }} />
            <button className="send-btn" onClick={sendTeamChat} disabled={teamChatLoading}>↑</button>
          </div>
        </div>
      )}

      {/* PAIR MODE */}
      {mode === "pair" && !pairReport && (
        <div>
          <div className="form-section">
            <h2>{L.pair}</h2>
            <div className="field-row">
              <label>{L.pairRelation}</label>
              <select value={pairRelation} onChange={e => setPairRelation(e.target.value)}>
                {L.pairRelationOptions.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-section">
            <label
              className={`import-btn${pairDragOver ? " dragover" : ""}`}
              onDragOver={e => { e.preventDefault(); setPairDragOver(true); }}
              onDragLeave={e => { e.preventDefault(); setPairDragOver(false); }}
              onDrop={e => { e.preventDefault(); setPairDragOver(false); importPairPdfs(e.dataTransfer.files); }}
            >
              <input type="file" accept="application/pdf" multiple
                onChange={e => importPairPdfs(e.target.files)} style={{ display:"none" }} />
              {pairImportStatus === "loading" ? L.importingTeam : (pairDragOver ? L.importPairDrop : L.importPair)}
            </label>
            {pairImportStatus === "ok" && <div className="import-msg ok">{L.importPairOk}</div>}
            {pairImportStatus === "err" && <div className="import-msg err">{L.importPairErr}</div>}
          </div>
          {[
            { p: pairA, set: setPairA, which: "A", label: L.personA, tag: pairRelation === "manager" ? " · manager" : "" },
            { p: pairB, set: setPairB, which: "B", label: L.personB, tag: pairRelation === "manager" ? " · collaborateur" : "" },
          ].map((it) => (
            <div key={it.which} className="member-card">
              <div className="member-header"><span>{it.label}{it.tag}</span></div>
              <div className="field-row" style={{ marginBottom:"8px" }}>
                <input type="text" value={it.p.name} onChange={e => it.set({ ...it.p, name: e.target.value })} placeholder={L.name} />
              </div>
              <div className="strengths-grid">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="strength-field">
                    <div className="rank-badge">{i+1}</div>
                    <input type="text" list="sf-list" value={it.p.strengths[i]} onChange={e => updatePairStrength(it.which, i, e.target.value)} placeholder={`${L.strength} ${i+1}`} />
                  </div>
                ))}
              </div>
              <div className="strengths-grid" style={{ marginTop:"8px" }}>
                {[5,6,7,8,9].map(i => (
                  <div key={i} className="strength-field">
                    <div className="rank-badge">{i+1}</div>
                    <input type="text" list="sf-list" value={it.p.strengths[i]} onChange={e => updatePairStrength(it.which, i, e.target.value)} placeholder={`${L.strength} ${i+1} (${L.optional})`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button className="analyze-btn" onClick={analyzePair} disabled={pairLoading}>
            {pairLoading ? L.analyzing : L.analyzePair}
          </button>
        </div>
      )}

      {mode === "pair" && pairReport && (
        <div>
          <button className="back-btn" onClick={() => { setPairReport(null); setPairChatMsgs([]); setPairHistory([]); }}>{L.backPair}</button>
          <DomainsBar strengths={pairReport.strengths} L={L} />
          <PairStatsTable stats={pairReport.stats} a={pairReport.a} b={pairReport.b} L={L} />
          <div className="report-area">
            <div className="report-content"><RichText text={pairReport.text} /></div>
          </div>
          <button className="pdf-btn" onClick={() => downloadPdf(`${pairReport.a.name} & ${pairReport.b.name}`, pairReport.text)}>{L.downloadPdf}</button>
          <button className="pdf-btn" onClick={() => downloadWord(`${pairReport.a.name} & ${pairReport.b.name}`, pairReport.text, L.pair)}>{L.downloadWord}</button>
          <ChatArea messages={pairChatMsgs} chatAreaRef={pairChatRef} />
          <div className="chat-input-row">
            <textarea rows={2} value={pairChatInput} onChange={e => setPairChatInput(e.target.value)}
              placeholder={L.pairChatPlaceholder}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendPairChat();} }} />
            <button className="send-btn" onClick={sendPairChat} disabled={pairChatLoading}>↑</button>
          </div>
        </div>
      )}

      {/* CNV MODE */}
      {mode === "cnv" && !cnvReport && (
        <div>
          <div className="form-section">
            <h2>{L.cnv}</h2>
            <label style={{ display:"block", fontSize:"13px", fontWeight:600, marginBottom:"6px" }}>{L.cnvSituationLabel}</label>
            <textarea rows={5} value={cnvSituation} onChange={e => setCnvSituation(e.target.value)} placeholder={L.cnvSituationPh}
              style={{ width:"100%", boxSizing:"border-box", fontFamily:"inherit", fontSize:"14px", padding:"10px 12px", borderRadius:"10px", border:"1px solid #ddd", resize:"vertical" }} />
            <div className="field-row" style={{ marginTop:"12px" }}>
              <label>{L.cnvWithLabel}</label>
              <input type="text" value={cnvWith} onChange={e => setCnvWith(e.target.value)} placeholder={L.cnvWithPh} />
            </div>
            <div className="field-row" style={{ marginTop:"8px" }}>
              <label>{L.cnvGoalLabel}</label>
              <input type="text" value={cnvGoal} onChange={e => setCnvGoal(e.target.value)} placeholder={L.cnvGoalPh} />
            </div>
          </div>
          <button className="analyze-btn" onClick={analyzeCnv} disabled={cnvLoading}>
            {cnvLoading ? L.analyzing : L.analyzeCnv}
          </button>
        </div>
      )}

      {mode === "cnv" && cnvReport && (
        <div>
          <button className="back-btn" onClick={() => { setCnvReport(null); setCnvChatMsgs([]); setCnvHistory([]); }}>{L.backCnv}</button>
          <div className="report-area">
            <div className="report-content"><RichText text={cnvReport.text} /></div>
          </div>
          <button className="pdf-btn" onClick={() => downloadPdf(cnvWith || L.cnv, cnvReport.text)}>{L.downloadPdf}</button>
          <button className="pdf-btn" onClick={() => downloadWord(cnvWith || L.cnv, cnvReport.text, L.cnv)}>{L.downloadWord}</button>
          <ChatArea messages={cnvChatMsgs} chatAreaRef={cnvChatRef} />
          <div className="chat-input-row">
            <textarea rows={2} value={cnvChatInput} onChange={e => setCnvChatInput(e.target.value)}
              placeholder={L.cnvChatPlaceholder}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendCnvChat();} }} />
            <button className="send-btn" onClick={sendCnvChat} disabled={cnvChatLoading}>↑</button>
          </div>
        </div>
      )}

      {/* Pied de page : by Optimup (texte, aligné à droite) */}
      <div className="brand-footer">
        <span className="brand-by">by</span>
        <span className="brand-name">Optimup</span>
      </div>
    </div>
  );
}
