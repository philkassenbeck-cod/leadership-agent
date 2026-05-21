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
  fr: { identity:"Identité", name:"Nom", role:"Rôle / Poste", top5:"Top 5 forces (obligatoire)", top10:"Forces 6–10 (optionnel)", context:"Contexte", goal:"Objectif du debrief", teamName:"Nom de l'équipe", teamGoal:"Objectif du debrief", teamLeader:"Chef d'équipe", teamLeaderHint:"Cliquez ⭐ sur le membre qui dirige l'équipe", statsByPerson:"Les 5 forces par personne", statsByDomain:"Répartition par domaine de forces", statsRanking:"Classement pondéré des forces", statsPresent:"Talents présents", statsDomainCol:"Domaine", department:"Département / Service", phDepartment:"ex. Marketing, Direction générale, Production...", business:"Nature du métier / secteur", phBusiness:"ex. Luxe, Industrie, Services financiers...", members:"Membres", addMember:"+ Ajouter un membre", analyze:"Analyser →", analyzeTeam:"Analyser l'équipe →", back:"← Nouveau debrief", backTeam:"← Nouvelle analyse", individual:"Individuel", team:"Équipe", headerSub:"Debrief individuel · Saisissez le top 5 ou top 10", headerSubTeam:"Analyse d'équipe · Ajoutez les membres et leurs forces", executing:"Exécution", influencing:"Influence", relationship:"Relation", thinking:"Pensée stratégique", chatPlaceholder:"Approfondissez une force, posez une question...", teamChatPlaceholder:"Posez une question sur la dynamique d'équipe...", goalOptions:[{v:"dev",l:"Développement personnel"},{v:"lead",l:"Leadership"},{v:"team",l:"Intégration équipe"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], teamGoalOptions:[{v:"dynamics",l:"Dynamiques d'équipe"},{v:"collab",l:"Améliorer la collaboration"},{v:"blind",l:"Identifier les angles morts"},{v:"perf",l:"Performance collective"}], coachName:"Votre nom (coach)", downloadPdf:"⬇ Télécharger en PDF", importPdf:"📄 Glissez votre rapport Gallup ici, ou cliquez", importDrop:"Déposez le PDF ici…", importing:"Lecture du PDF...", importOk:"Forces importées ✓", importErr:"Lecture impossible. Vérifiez que c'est bien le PDF Gallup, ou saisissez à la main.", importTeam:"📄 Glissez jusqu'à 12 rapports Gallup ici, ou cliquez", importTeamDrop:"Déposez les PDF ici…", importingTeam:"Lecture des rapports...", importTeamOk:(n)=>`${n} membre(s) importé(s) ✓`, importTeamErr:"Aucun rapport lisible. Vérifiez que ce sont bien des PDF Gallup.", importTeamMax:"12 rapports maximum.", letterGreeting:(n)=>`Cher(e) ${n},`, letterIntro:"Voici le débrief de tes forces, fruit de notre échange. Prends le temps de le lire, d'y revenir, et de laisser ces mots résonner.", letterClose:"Avec toute ma confiance,", pdfTitle:"Débrief StrengthsFinder", phName:"Prénom Nom", phRole:"ex. CEO, Chef de projet...", phCoach:"ex. Philippe Kassenbeck", phTeam:"ex. Board, Équipe Marketing...", strength:"Force", optional:"optionnel", member:"Membre", analyzing:"Analyse en cours...", errMin3:"Saisissez au moins 3 forces.", errMin2:"Ajoutez au moins 2 membres avec des forces.", errApi:"Erreur API.", errRetry:"Erreur. Réessayez." },
  de: { identity:"Identität", name:"Name", role:"Rolle / Position", top5:"Top 5 Stärken (Pflicht)", top10:"Stärken 6–10 (optional)", context:"Kontext", goal:"Ziel des Debriefs", teamName:"Teamname", teamGoal:"Ziel des Debriefs", teamLeader:"Teamleiter", teamLeaderHint:"Klicken Sie ⭐ beim Mitglied, das das Team leitet", statsByPerson:"Die 5 Stärken pro Person", statsByDomain:"Verteilung nach Stärkenbereich", statsRanking:"Gewichtetes Stärken-Ranking", statsPresent:"Vorhandene Talente", statsDomainCol:"Bereich", department:"Abteilung / Bereich", phDepartment:"z. B. Marketing, Geschäftsführung, Produktion...", business:"Branche / Tätigkeitsbereich", phBusiness:"z. B. Luxus, Industrie, Finanzdienstleistungen...", members:"Mitglieder", addMember:"+ Mitglied hinzufügen", analyze:"Analysieren →", analyzeTeam:"Team analysieren →", back:"← Neues Debrief", backTeam:"← Neue Analyse", individual:"Individuell", team:"Team", headerSub:"Individuelles Debrief · Geben Sie die Top 5 oder Top 10 ein", headerSubTeam:"Teamanalyse · Fügen Sie Mitglieder und Stärken hinzu", executing:"Ausführung", influencing:"Einfluss", relationship:"Beziehung", thinking:"Strategisches Denken", chatPlaceholder:"Vertiefen Sie eine Stärke...", teamChatPlaceholder:"Fragen zur Teamdynamik...", goalOptions:[{v:"dev",l:"Persönliche Entwicklung"},{v:"lead",l:"Leadership"},{v:"team",l:"Teamintegration"},{v:"perf",l:"Performance"},{v:"collab",l:"Zusammenarbeit"}], teamGoalOptions:[{v:"dynamics",l:"Teamdynamiken"},{v:"collab",l:"Zusammenarbeit verbessern"},{v:"blind",l:"Blinde Flecken erkennen"},{v:"perf",l:"Kollektive Performance"}], coachName:"Ihr Name (Coach)", downloadPdf:"⬇ Als PDF herunterladen", importPdf:"📄 Gallup-Bericht hierher ziehen oder klicken", importDrop:"PDF hier ablegen…", importing:"PDF wird gelesen...", importOk:"Stärken importiert ✓", importErr:"Lesen nicht möglich. Bitte prüfen Sie das Gallup-PDF oder geben Sie manuell ein.", importTeam:"📄 Bis zu 12 Gallup-Berichte hierher ziehen oder klicken", importTeamDrop:"PDFs hier ablegen…", importingTeam:"Berichte werden gelesen...", importTeamOk:(n)=>`${n} Mitglied(er) importiert ✓`, importTeamErr:"Keine lesbaren Berichte. Bitte prüfen Sie die Gallup-PDFs.", importTeamMax:"Maximal 12 Berichte.", letterGreeting:(n)=>`Liebe(r) ${n},`, letterIntro:"Hier ist das Debrief deiner Stärken, das Ergebnis unseres Gesprächs. Nimm dir Zeit, es zu lesen und nachwirken zu lassen.", letterClose:"Mit vollem Vertrauen,", pdfTitle:"StrengthsFinder Debrief", phName:"Vor- und Nachname", phRole:"z. B. CEO, Projektleiter...", phCoach:"z. B. Philippe Kassenbeck", phTeam:"z. B. Vorstand, Marketing-Team...", strength:"Stärke", optional:"optional", member:"Mitglied", analyzing:"Analyse läuft...", errMin3:"Geben Sie mindestens 3 Stärken ein.", errMin2:"Fügen Sie mindestens 2 Mitglieder mit Stärken hinzu.", errApi:"API-Fehler.", errRetry:"Fehler. Bitte erneut versuchen." },
  en: { identity:"Identity", name:"Name", role:"Role / Position", top5:"Top 5 strengths (required)", top10:"Strengths 6–10 (optional)", context:"Context", goal:"Debrief objective", teamName:"Team name", teamGoal:"Debrief objective", teamLeader:"Team leader", teamLeaderHint:"Click ⭐ on the member who leads the team", statsByPerson:"The 5 strengths per person", statsByDomain:"Distribution by strength domain", statsRanking:"Weighted strengths ranking", statsPresent:"Present talents", statsDomainCol:"Domain", department:"Department / Unit", phDepartment:"e.g. Marketing, Executive board, Production...", business:"Business / industry", phBusiness:"e.g. Luxury, Industry, Financial services...", members:"Members", addMember:"+ Add member", analyze:"Analyze →", analyzeTeam:"Analyze team →", back:"← New debrief", backTeam:"← New analysis", individual:"Individual", team:"Team", headerSub:"Individual debrief · Enter top 5 or top 10", headerSubTeam:"Team analysis · Add members and their strengths", executing:"Executing", influencing:"Influencing", relationship:"Relationship", thinking:"Strategic Thinking", chatPlaceholder:"Dive deeper into a strength...", teamChatPlaceholder:"Ask about team dynamics...", goalOptions:[{v:"dev",l:"Personal development"},{v:"lead",l:"Leadership"},{v:"team",l:"Team integration"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], teamGoalOptions:[{v:"dynamics",l:"Team dynamics"},{v:"collab",l:"Improve collaboration"},{v:"blind",l:"Identify blind spots"},{v:"perf",l:"Collective performance"}], coachName:"Your name (coach)", downloadPdf:"⬇ Download PDF", importPdf:"📄 Drag your Gallup report here, or click", importDrop:"Drop the PDF here…", importing:"Reading PDF...", importOk:"Strengths imported ✓", importErr:"Could not read it. Check it's the Gallup PDF, or enter manually.", importTeam:"📄 Drag up to 12 Gallup reports here, or click", importTeamDrop:"Drop the PDFs here…", importingTeam:"Reading reports...", importTeamOk:(n)=>`${n} member(s) imported ✓`, importTeamErr:"No readable reports. Check they are Gallup PDFs.", importTeamMax:"12 reports maximum.", letterGreeting:(n)=>`Dear ${n},`, letterIntro:"Here is the debrief of your strengths, the fruit of our conversation. Take the time to read it, return to it, and let these words resonate.", letterClose:"With all my confidence,", pdfTitle:"StrengthsFinder Debrief", phName:"First and last name", phRole:"e.g. CEO, Project manager...", phCoach:"e.g. Philippe Kassenbeck", phTeam:"e.g. Board, Marketing team...", strength:"Strength", optional:"optional", member:"Member", analyzing:"Analyzing...", errMin3:"Enter at least 3 strengths.", errMin2:"Add at least 2 members with strengths.", errApi:"API error.", errRetry:"Error. Please try again." },
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
  return `You are an expert StrengthsFinder leadership coach working with Philippe's methodology.

DEBRIEF FORMAT — always follow this structure, fits about one A4 page.
The debrief has FOUR parts, each introduced by ONE heading (no "Section" word, no numbering).
Use the heading in the SAME language as the debrief (${langName}):
- If French: "Toutes vos forces en action" / "Quelle vigilance avoir par rapport à vos forces ?" / "Activer vos forces pour combler vos zones moins développées" / "Trois questions pour aller de l'avant"
- If English: "All your strengths in action" / "What to watch out for with your strengths" / "Using your strengths to grow your weaker areas" / "Three questions to keep growing"
Reproduce the chosen heading exactly as written above for that language.

Heading 1 (then ~20 lines)
Write a flowing narrative about this person's profile. Show how the talents dance together — not a list, a story. Celebrate what is extraordinary. Use vivid, precise language. Show the person who they are at their best. The tone is warm, confident, and truthful.

Heading 2 (then ~15 lines)
Name the blind spots and potential tensions — but in a style that affirms rather than imposes. Never "you have a problem with X". Instead: "The very thing that makes you powerful here can sometimes..." Frame every shadow as the other side of a strength. Firm but respectful.

Heading 3 (then ~10 lines)
Show how this person can USE their PRESENT strengths to compensate for or develop the domains where they are weaker. This is the most actionable part. For each gap, propose a concrete bridge built from an existing strength. Example of the reasoning to follow: someone with a very strong relationship domain but little Influencing can lean on their relational depth to gradually build their circle of influence at work — using trusted one-on-one relationships as a springboard, rather than trying to force a public, charismatic style that isn't natural to them. Do this for the person's real profile: pick their dominant strengths and show how each can serve as a lever toward an under-represented domain. Concrete, specific, encouraging — not generic advice.

Heading 4
Ask exactly 3 questions designed to accelerate self-discovery. Rules:
- One question must always be about how this person can become the MASTER of their strengths instead of being guided by them
- Questions open doors, they don't close them
- No yes/no questions

LANGUAGE: You MUST write the ENTIRE debrief in ${langName}, including the headings. Every sentence must be in ${langName}, regardless of the language of these instructions.
STRENGTH NAMES: The strengths are given to you in English (e.g. "Achiever", "Strategic"). In your debrief, ALWAYS translate each strength name into the OFFICIAL CliftonStrengths theme name in ${langName}. If ${langName} is French, use the official French names (e.g. Achiever→Réalisateur, Strategic→Stratégique, Learner→Studieux, Self-Assurance→Assurance, Woo→Charisme, Individualization→Individualisation, Futuristic→Futuriste, Competition→Compétition, Relator→Relationnel, Ideation→Idéation, Input→Input). If ${langName} is English, keep the standard English names.
LENGTH: Keep it tight and readable, roughly one to one-and-a-half A4 pages with the four parts. Not more.

Context: ${context}`;
}

// Prompt système spécifique au TEAM COACHING.
// Exploite explicitement le secteur/métier, le département et le rôle du chef d'équipe.
function buildTeamSystem(lang, context) {
  const langName = lang === "fr" ? "French" : lang === "de" ? "German" : "English";
  return `You are an expert StrengthsFinder TEAM coach working with Philippe's methodology.
You analyze a TEAM, not an individual. Your reader is the coach (and often the team leader).

LANGUAGE: You MUST write the ENTIRE output in ${langName}. Every sentence, including headings, in ${langName}.
STRENGTH NAMES: Strengths are given in English. ALWAYS translate each into the OFFICIAL CliftonStrengths theme name in ${langName} (e.g. in French: Achiever→Réalisateur, Strategic→Stratégique, Learner→Studieux, Self-Assurance→Assurance, Woo→Charisme, Individualization→Individualisation, Futuristic→Futuriste, Competition→Compétition, Relator→Relationnel, Ideation→Idéation, Input→Input).

CONTEXT YOU ARE GIVEN — use ALL of it, do not ignore any field:
- "Nature du métier / secteur": the business sector. ADAPT every recommendation to the codes, pace and constraints of THIS sector. A board in luxury, a marketing team in industry and a finance department do not face the same stakes. Make the sector visible in your analysis — never give generic advice that would fit any team.
- "Département / Service": the function within the organization. Frame strengths and blind spots through what THIS function is expected to deliver (e.g. a marketing team needs Influencing/Ideation; a production unit needs Executing/Discipline). Name explicitly when the team's collective profile fits or misfits its mission.
- "Chef d'équipe": the member tagged [CHEF D'ÉQUIPE]. Analyze the leader–team dynamic specifically: how the leader's top strengths shape the team, where the leader amplifies or compensates the collective profile, and one concrete leadership posture to adopt given who they lead. If no leader is tagged, skip this and say nothing about it.

A precise numeric report is given to you in the context (weighted ranking, domain distribution, rare and absent strengths). It is computed exactly — NEVER recompute or contradict these numbers. The visual tables are already shown to the user, so your job is INTERPRETATION, not listing.

OUTPUT STRUCTURE (use clear headings in ${langName}, no numbering word like "Section", no Markdown tables):

1. Team framing — open with EXACTLY 10 affirmative sentences (flowing prose, no bullets) defining who this team is, read through its four domains: Executing, Influencing, Relationship, Thinking. Weight the sentences by how present each domain is (use the domain distribution). Each sentence is a firm, vivid statement — never hedged. Reference dominant strengths by name. Style example to match (tone and confidence):
"Cette équipe pense avant d'agir. Avec Analytical, Learner, Intellection et Strategic dominants, elle décortique, questionne, cherche la logique avant de s'engager. Le risque d'over-analyse existe — mais quand elle décide, c'est solide. Le socle relationnel est massif : Relator en tête, accompagné d'Individualization et Harmony..."

2. Blind spots (rare & absent strengths) — write 2 to 4 short "Zone aveugle" paragraphs, each naming a specific gap and its consequence. Match this exact style:
"Zone aveugle relationnelle — Empathy, Includer, Connectedness sont tous absents. Ce groupe perçoit les individus avec finesse (Relator, Individualization forts) mais peut manquer de radar émotionnel collectif et de vigilance à la marginalisation."
"Zone aveugle influence publique — Woo et Significance absents. Ce collectif ne cherche pas naturellement la visibilité ni le contact avec les inconnus — critique si leur rôle implique du développement commercial ou de la représentation externe."
Base these strictly on the RARE and ABSENT lists given in context.

3. Leader–team relationship — EXACTLY 6 lines on the global dynamic between the tagged leader and the team: how the leader's profile fits, amplifies or compensates the collective, and the posture to adopt. Only if a leader is tagged; otherwise omit this section entirely.

4. Five concrete actions — propose EXACTLY 5 concrete, actionable recommendations to make the team work better, each tied to the findings above and to the stated objective and sector. Each action is specific and doable, not generic advice.

Tone: warm, confident, truthful. Coach posture, not consultant: frame shadows as the flip side of strengths. Keep it tight and usable.

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
    const ctx = `Name: ${indName || "Participant"}\nRole: ${indRole || "-"}\nObjective: ${goalLabel}\nStrengths (ranked): ${strengths.map((s,i) => `${i+1}. ${s}`).join(", ")}`;
    setIndContext(ctx);
    const promptText = lg === "fr"
      ? `Fais un debrief complet de ce profil StrengthsFinder. Structure:\n1. SYNTHÈSE DU PROFIL (3-4 phrases sur l'identité)\n2. FORCES EN DÉTAIL (analyse des 3 premières forces dominantes)\n3. DYNAMIQUES ET INTERACTIONS (synergies et tensions)\n4. ANGLES MORTS (2-3 risques)\n5. RECOMMANDATIONS CONCRÈTES (3 actions liées à: ${goalLabel})\n\nProfil: ${ctx}`
      : lg === "de"
      ? `Erstelle ein vollständiges Debrief dieses StrengthsFinder-Profils. Struktur:\n1. PROFILZUSAMMENFASSUNG\n2. STÄRKEN IM DETAIL (Top 3)\n3. DYNAMIKEN UND INTERAKTIONEN\n4. BLINDE FLECKEN\n5. KONKRETE EMPFEHLUNGEN (3 Maßnahmen für: ${goalLabel})\n\nProfil: ${ctx}`
      : `Provide a complete StrengthsFinder debrief. Structure:\n1. PROFILE SUMMARY\n2. KEY STRENGTHS (top 3 in detail)\n3. DYNAMICS AND INTERACTIONS\n4. BLIND SPOTS\n5. CONCRETE RECOMMENDATIONS (3 actions for: ${goalLabel})\n\nProfile: ${ctx}`;
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
