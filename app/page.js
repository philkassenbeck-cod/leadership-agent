"use client";
import { useState, useRef } from "react";
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
  fr: { identity:"Identité", name:"Nom", role:"Rôle / Poste", top5:"Top 5 forces (obligatoire)", top10:"Forces 6–10 (optionnel)", context:"Contexte", goal:"Objectif du debrief", teamName:"Nom de l'équipe", teamGoal:"Objectif du debrief", teamLeader:"Chef d'équipe", teamLeaderHint:"Cliquez ⭐ sur le membre qui dirige l'équipe", statsByPerson:"Les 5 forces par personne", statsByDomain:"Répartition par domaine de forces", statsRanking:"Classement pondéré des forces", statsPresent:"Talents présents", statsDomainCol:"Domaine", department:"Département / Service", phDepartment:"ex. Marketing, Direction générale, Production...", business:"Nature du métier / secteur", phBusiness:"ex. Luxe, Industrie, Services financiers...", members:"Membres", addMember:"+ Ajouter un membre", analyze:"Analyser →", analyzeTeam:"Analyser l'équipe →", back:"← Nouveau debrief", backTeam:"← Nouvelle analyse", individual:"Individuel", team:"Équipe", headerSub:"Debrief individuel · Saisissez le top 5 ou top 10", headerSubTeam:"Analyse d'équipe · Ajoutez les membres et leurs forces", executing:"Exécution", influencing:"Influence", relationship:"Relation", thinking:"Pensée stratégique", chatPlaceholder:"Approfondissez une force, posez une question...", teamChatPlaceholder:"Posez une question sur la dynamique d'équipe...", goalOptions:[{v:"dev",l:"Développement personnel"},{v:"team",l:"Intégration dans une équipe"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], level:"Niveau de responsabilité", levelOptions:[{v:"leader",l:"Dirigeant·e / leader"},{v:"manager",l:"Manager / encadrant·e"},{v:"ic",l:"Sans responsabilité d'encadrement"}], teamGoalOptions:[{v:"dynamics",l:"Dynamiques d'équipe"},{v:"collab",l:"Améliorer la collaboration"},{v:"blind",l:"Identifier les angles morts"},{v:"perf",l:"Performance collective"}], coachName:"Votre nom (coach)", downloadPdf:"⬇ Télécharger en PDF", downloadWord:"⬇ Télécharger en Word", importPdf:"📄 Glissez votre rapport Gallup ici, ou cliquez", importDrop:"Déposez le PDF ici…", importing:"Lecture du PDF...", importOk:"Forces importées ✓", importErr:"Lecture impossible. Vérifiez que c'est bien le PDF Gallup, ou saisissez à la main.", importTeam:"📄 Glissez jusqu'à 12 rapports Gallup ici, ou cliquez", importTeamDrop:"Déposez les PDF ici…", importingTeam:"Lecture des rapports...", importTeamOk:(n)=>`${n} membre(s) importé(s) ✓`, importTeamErr:"Aucun rapport lisible. Vérifiez que ce sont bien des PDF Gallup.", importTeamMax:"12 rapports maximum.", letterGreeting:(n)=>`Cher(e) ${n},`, letterIntro:"Voici le débrief de tes forces, fruit de notre échange. Prends le temps de le lire, d'y revenir, et de laisser ces mots résonner.", letterClose:"Avec toute ma confiance,", pdfTitle:"Débrief StrengthsFinder", phName:"Prénom Nom", phRole:"ex. CEO, Chef de projet...", phCoach:"ex. Philippe Kassenbeck", phTeam:"ex. Board, Équipe Marketing...", strength:"Force", optional:"optionnel", member:"Membre", analyzing:"Analyse en cours...", errMin3:"Saisissez au moins 3 forces.", errMin2:"Ajoutez au moins 2 membres avec des forces.", errApi:"Erreur API.", errRetry:"Erreur. Réessayez." },
  de: { identity:"Identität", name:"Name", role:"Rolle / Position", top5:"Top 5 Stärken (Pflicht)", top10:"Stärken 6–10 (optional)", context:"Kontext", goal:"Ziel des Debriefs", teamName:"Teamname", teamGoal:"Ziel des Debriefs", teamLeader:"Teamleiter", teamLeaderHint:"Klicken Sie ⭐ beim Mitglied, das das Team leitet", statsByPerson:"Die 5 Stärken pro Person", statsByDomain:"Verteilung nach Stärkenbereich", statsRanking:"Gewichtetes Stärken-Ranking", statsPresent:"Vorhandene Talente", statsDomainCol:"Bereich", department:"Abteilung / Bereich", phDepartment:"z. B. Marketing, Geschäftsführung, Produktion...", business:"Branche / Tätigkeitsbereich", phBusiness:"z. B. Luxus, Industrie, Finanzdienstleistungen...", members:"Mitglieder", addMember:"+ Mitglied hinzufügen", analyze:"Analysieren →", analyzeTeam:"Team analysieren →", back:"← Neues Debrief", backTeam:"← Neue Analyse", individual:"Individuell", team:"Team", headerSub:"Individuelles Debrief · Geben Sie die Top 5 oder Top 10 ein", headerSubTeam:"Teamanalyse · Fügen Sie Mitglieder und Stärken hinzu", executing:"Ausführung", influencing:"Einfluss", relationship:"Beziehung", thinking:"Strategisches Denken", chatPlaceholder:"Vertiefen Sie eine Stärke...", teamChatPlaceholder:"Fragen zur Teamdynamik...", goalOptions:[{v:"dev",l:"Persönliche Entwicklung"},{v:"team",l:"Teamintegration"},{v:"perf",l:"Performance"},{v:"collab",l:"Zusammenarbeit"}], level:"Verantwortungsebene", levelOptions:[{v:"leader",l:"Führungskraft / Leader"},{v:"manager",l:"Manager / Teamleiter"},{v:"ic",l:"Ohne Führungsverantwortung"}], teamGoalOptions:[{v:"dynamics",l:"Teamdynamiken"},{v:"collab",l:"Zusammenarbeit verbessern"},{v:"blind",l:"Blinde Flecken erkennen"},{v:"perf",l:"Kollektive Performance"}], coachName:"Ihr Name (Coach)", downloadPdf:"⬇ Als PDF herunterladen", downloadWord:"⬇ Als Word herunterladen", importPdf:"📄 Gallup-Bericht hierher ziehen oder klicken", importDrop:"PDF hier ablegen…", importing:"PDF wird gelesen...", importOk:"Stärken importiert ✓", importErr:"Lesen nicht möglich. Bitte prüfen Sie das Gallup-PDF oder geben Sie manuell ein.", importTeam:"📄 Bis zu 12 Gallup-Berichte hierher ziehen oder klicken", importTeamDrop:"PDFs hier ablegen…", importingTeam:"Berichte werden gelesen...", importTeamOk:(n)=>`${n} Mitglied(er) importiert ✓`, importTeamErr:"Keine lesbaren Berichte. Bitte prüfen Sie die Gallup-PDFs.", importTeamMax:"Maximal 12 Berichte.", letterGreeting:(n)=>`Liebe(r) ${n},`, letterIntro:"Hier ist das Debrief deiner Stärken, das Ergebnis unseres Gesprächs. Nimm dir Zeit, es zu lesen und nachwirken zu lassen.", letterClose:"Mit vollem Vertrauen,", pdfTitle:"StrengthsFinder Debrief", phName:"Vor- und Nachname", phRole:"z. B. CEO, Projektleiter...", phCoach:"z. B. Philippe Kassenbeck", phTeam:"z. B. Vorstand, Marketing-Team...", strength:"Stärke", optional:"optional", member:"Mitglied", analyzing:"Analyse läuft...", errMin3:"Geben Sie mindestens 3 Stärken ein.", errMin2:"Fügen Sie mindestens 2 Mitglieder mit Stärken hinzu.", errApi:"API-Fehler.", errRetry:"Fehler. Bitte erneut versuchen." },
  en: { identity:"Identity", name:"Name", role:"Role / Position", top5:"Top 5 strengths (required)", top10:"Strengths 6–10 (optional)", context:"Context", goal:"Debrief objective", teamName:"Team name", teamGoal:"Debrief objective", teamLeader:"Team leader", teamLeaderHint:"Click ⭐ on the member who leads the team", statsByPerson:"The 5 strengths per person", statsByDomain:"Distribution by strength domain", statsRanking:"Weighted strengths ranking", statsPresent:"Present talents", statsDomainCol:"Domain", department:"Department / Unit", phDepartment:"e.g. Marketing, Executive board, Production...", business:"Business / industry", phBusiness:"e.g. Luxury, Industry, Financial services...", members:"Members", addMember:"+ Add member", analyze:"Analyze →", analyzeTeam:"Analyze team →", back:"← New debrief", backTeam:"← New analysis", individual:"Individual", team:"Team", headerSub:"Individual debrief · Enter top 5 or top 10", headerSubTeam:"Team analysis · Add members and their strengths", executing:"Executing", influencing:"Influencing", relationship:"Relationship", thinking:"Strategic Thinking", chatPlaceholder:"Dive deeper into a strength...", teamChatPlaceholder:"Ask about team dynamics...", goalOptions:[{v:"dev",l:"Personal development"},{v:"team",l:"Team integration"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], level:"Level of responsibility", levelOptions:[{v:"leader",l:"Executive / leader"},{v:"manager",l:"Manager / team lead"},{v:"ic",l:"No management responsibility"}], teamGoalOptions:[{v:"dynamics",l:"Team dynamics"},{v:"collab",l:"Improve collaboration"},{v:"blind",l:"Identify blind spots"},{v:"perf",l:"Collective performance"}], coachName:"Your name (coach)", downloadPdf:"⬇ Download PDF", downloadWord:"⬇ Download Word", importPdf:"📄 Drag your Gallup report here, or click", importDrop:"Drop the PDF here…", importing:"Reading PDF...", importOk:"Strengths imported ✓", importErr:"Could not read it. Check it's the Gallup PDF, or enter manually.", importTeam:"📄 Drag up to 12 Gallup reports here, or click", importTeamDrop:"Drop the PDFs here…", importingTeam:"Reading reports...", importTeamOk:(n)=>`${n} member(s) imported ✓`, importTeamErr:"No readable reports. Check they are Gallup PDFs.", importTeamMax:"12 reports maximum.", letterGreeting:(n)=>`Dear ${n},`, letterIntro:"Here is the debrief of your strengths, the fruit of our conversation. Take the time to read it, return to it, and let these words resonate.", letterClose:"With all my confidence,", pdfTitle:"StrengthsFinder Debrief", phName:"First and last name", phRole:"e.g. CEO, Project manager...", phCoach:"e.g. Philippe Kassenbeck", phTeam:"e.g. Board, Marketing team...", strength:"Strength", optional:"optional", member:"Member", analyzing:"Analyzing...", errMin3:"Enter at least 3 strengths.", errMin2:"Add at least 2 members with strengths.", errApi:"API error.", errRetry:"Error. Please try again." },
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

  return { ranking, domains, rare, absent, totalPoints };
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
"## 1. Votre portrait de leadership"
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

A precise numeric report is given in context (weighted ranking, domain distribution, rare and absent strengths). It is computed exactly — NEVER recompute or contradict these numbers. The visual tables are already shown to the user; your job is INTERPRETATION and systemic insight, not listing.

OUTPUT FORMAT — follow this EXACTLY. Light Markdown: "## " before each section heading, "**bold**" for strength names and key phrases. No tables. Roughly 1.5–2 A4 pages.

Start with a short foreword (no heading, 3–4 lines), the growth-mindset meta-point applied to the team. In French, this spirit:
"**Comment lire ce portrait d'équipe** — Ce document décrit la signature de l'équipe, pas une fatalité. Les forces collectives expliquent ses réflexes ; elles ne dictent pas ses choix. Une force partagée par tous est un atout ET un risque ; une force absente n'est pas un défaut, mais une voix que le système devra apprendre à porter consciemment."

Then SIX sections, each opened by a "## " heading numbered 1 to 6 (translate to ${langName}; French shown):

"## 1. La signature de l'équipe"
Open with EXACTLY 10 affirmative, vivid, unhedged sentences (flowing prose, no bullets) defining who this team-entity is, read through its four domains (Executing, Influencing, Relationship, Thinking), weighted by the domain distribution. Reference dominant strengths by name. Name a collective "signature" — a strength or domain shared by most members — and frame it as both the team's superpower and its first vulnerability (e.g. a strength shared by 5 of 6 is an efficiency signature AND a premature-convergence risk). Close on the triple value the team brings, with three bolded nouns.

"## 2. Les tensions visibles"
2 to 3 short paragraphs naming the FRICTIONS that are already observable in the room — rivalries between similar dominant profiles, pace mismatches, competing leadership reflexes. Each tension is named as belonging to the SYSTEM, not to individuals ("la tension n'appartient à personne — c'est une information que le système exprime"). Tie each to specific strengths held by specific members where the data supports it.

"## 3. Les tensions invisibles"
2 to 4 short paragraphs on what does NOT show but shapes everything: the **rôle fantôme** (ghost role) — name explicitly the most consequential ABSENT strength as a voice that haunts the system (e.g. "Le rôle fantôme de cette équipe, c'est le Prudent/Délibératif : personne ne l'incarne, mais il parle à travers les erreurs et les sur-promesses"). Include: roles carried by too few members (saturation / rôle nausea risk), false harmony masking absent real conflict, and any equity/consistency gap felt below the team. Insert ONE call-out starting exactly "**Le risque systémique majeur** —" naming the single most dangerous invisible dynamic and one bolded key phrase.

"## 4. Comment cette équipe est perçue de l'extérieur"
Describe, grounded strictly in the real profile, how the team is likely seen by clients/partners/board AT FIRST (the flattering impression its dominant strengths create) and OVER TIME or under scrutiny (the misreadings and risks the same strengths produce). End with ONE italic call-out: the "silent question" outsiders or the wider organization might be asking about this team — "*La question silencieuse de l'organisation pourrait être : « ... »*".

"## 5. La relation chef–équipe"
EXACTLY 6 lines on how the tagged leader's profile fits, amplifies or compensates the collective, and the ONE concrete posture to adopt given who they lead. If NO leader is tagged, omit this entire section (do not write the heading).

"## 6. Cinq actions concrètes"
EXACTLY 5 specific, doable recommendations tied to the findings, the objective and the sector — never generic. At least one must make the ghost role (absent voice) structurally present, and at least one must protect any saturated/over-relied-on member. Frame each as conscious choice, not personality fix.

Tone: warm, confident, truthful. Coach posture, not consultant: every shadow is the flip side of a strength, every tension a signal of something trying to emerge. Do NOT write any closing salutation or signature — the document adds it automatically.

Context: ${context}`;
}

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [mode, setMode] = useState("individual");
  const [coachName, setCoachName] = useState("");

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
    const files = Array.from(fileList || []).filter(f => f.type === "application/pdf").slice(0, 12);
    if (files.length === 0) return;
    if ((fileList || []).length > 12) alert(L.importTeamMax);
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
        WidthType, ShadingType, PageNumber,
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
        // line ex. "## 1. Votre portrait de leadership" ou "## La signature de l'équipe"
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
        new Paragraph({ spacing:{ after:40 }, children:[ new TextRun({ text:"DÉBRIEF STRENGTHSFINDER", font:FONT, size:20, bold:true, color:ACCENT, characterSpacing:40 }) ] }),
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
          footers:{ default: new Footer({ children:[ new Paragraph({ tabStops:[{ type:TabStopType.RIGHT, position:9026 }], children:[
            new TextRun({ text:"Débrief StrengthsFinder — Confidentiel", font:FONT, size:16, color:GREY, italics:true }),
            new TextRun({ text:"\t", font:FONT }),
            new TextRun({ children:[PageNumber.CURRENT], font:FONT, size:16, color:GREY }),
          ] }) ] }) },
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
    }
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
        </div>
      </div>

      {/* Header */}
      <div className="agent-header">
        <h1>Leadership Agent — StrengthsFinder</h1>
        <p>{mode==="individual" ? L.headerSub : L.headerSubTeam}</p>
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

      {/* Pied de page : by Optimup (texte, aligné à droite) */}
      <div className="brand-footer">
        <span className="brand-by">by</span>
        <span className="brand-name">Optimup</span>
      </div>
    </div>
  );
}
