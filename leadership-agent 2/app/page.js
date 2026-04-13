"use client";
import { useState, useRef } from "react";

const ALL34 = ["Achiever","Activator","Adaptability","Analytical","Arranger","Belief","Command","Communication","Competition","Connectedness","Consistency","Context","Deliberative","Developer","Discipline","Empathy","Focus","Futuristic","Harmony","Ideation","Includer","Individualization","Input","Intellection","Learner","Maximizer","Positivity","Relator","Responsibility","Restorative","Self-Assurance","Significance","Strategic","Woo"];

const DOMAINS = {
  Executing: ["Achiever","Arranger","Belief","Consistency","Deliberative","Discipline","Focus","Responsibility","Restorative"],
  Influencing: ["Activator","Command","Communication","Competition","Maximizer","Self-Assurance","Significance","Woo"],
  Relationship: ["Adaptability","Connectedness","Developer","Empathy","Harmony","Includer","Individualization","Positivity","Relator"],
  Thinking: ["Analytical","Context","Futuristic","Ideation","Input","Intellection","Learner","Strategic"],
};

const LABELS = {
  fr: { identity:"Identité", name:"Nom", role:"Rôle / Poste", top5:"Top 5 forces (obligatoire)", top10:"Forces 6–10 (optionnel)", context:"Contexte", goal:"Objectif du debrief", teamName:"Nom de l'équipe", teamGoal:"Objectif du debrief", members:"Membres", addMember:"+ Ajouter un membre", analyze:"Analyser →", analyzeTeam:"Analyser l'équipe →", back:"← Nouveau debrief", backTeam:"← Nouvelle analyse", individual:"Individuel", team:"Équipe", headerSub:"Debrief individuel · Saisissez le top 5 ou top 10", headerSubTeam:"Analyse d'équipe · Ajoutez les membres et leurs forces", executing:"Exécution", influencing:"Influence", relationship:"Relation", thinking:"Réflexion", chatPlaceholder:"Approfondissez une force, posez une question...", teamChatPlaceholder:"Posez une question sur la dynamique d'équipe...", goalOptions:[{v:"dev",l:"Développement personnel"},{v:"lead",l:"Leadership"},{v:"team",l:"Intégration équipe"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], teamGoalOptions:[{v:"dynamics",l:"Dynamiques d'équipe"},{v:"collab",l:"Améliorer la collaboration"},{v:"blind",l:"Identifier les angles morts"},{v:"perf",l:"Performance collective"}] },
  de: { identity:"Identität", name:"Name", role:"Rolle / Position", top5:"Top 5 Stärken (Pflicht)", top10:"Stärken 6–10 (optional)", context:"Kontext", goal:"Ziel des Debriefs", teamName:"Teamname", teamGoal:"Ziel des Debriefs", members:"Mitglieder", addMember:"+ Mitglied hinzufügen", analyze:"Analysieren →", analyzeTeam:"Team analysieren →", back:"← Neues Debrief", backTeam:"← Neue Analyse", individual:"Individuell", team:"Team", headerSub:"Individuelles Debrief · Geben Sie die Top 5 oder Top 10 ein", headerSubTeam:"Teamanalyse · Fügen Sie Mitglieder und Stärken hinzu", executing:"Ausführung", influencing:"Einfluss", relationship:"Beziehung", thinking:"Denken", chatPlaceholder:"Vertiefen Sie eine Stärke...", teamChatPlaceholder:"Fragen zur Teamdynamik...", goalOptions:[{v:"dev",l:"Persönliche Entwicklung"},{v:"lead",l:"Leadership"},{v:"team",l:"Teamintegration"},{v:"perf",l:"Performance"},{v:"collab",l:"Zusammenarbeit"}], teamGoalOptions:[{v:"dynamics",l:"Teamdynamiken"},{v:"collab",l:"Zusammenarbeit verbessern"},{v:"blind",l:"Blinde Flecken erkennen"},{v:"perf",l:"Kollektive Performance"}] },
  en: { identity:"Identity", name:"Name", role:"Role / Position", top5:"Top 5 strengths (required)", top10:"Strengths 6–10 (optional)", context:"Context", goal:"Debrief objective", teamName:"Team name", teamGoal:"Debrief objective", members:"Members", addMember:"+ Add member", analyze:"Analyze →", analyzeTeam:"Analyze team →", back:"← New debrief", backTeam:"← New analysis", individual:"Individual", team:"Team", headerSub:"Individual debrief · Enter top 5 or top 10", headerSubTeam:"Team analysis · Add members and their strengths", executing:"Executing", influencing:"Influencing", relationship:"Relationship", thinking:"Thinking", chatPlaceholder:"Dive deeper into a strength...", teamChatPlaceholder:"Ask about team dynamics...", goalOptions:[{v:"dev",l:"Personal development"},{v:"lead",l:"Leadership"},{v:"team",l:"Team integration"},{v:"perf",l:"Performance"},{v:"collab",l:"Collaboration"}], teamGoalOptions:[{v:"dynamics",l:"Team dynamics"},{v:"collab",l:"Improve collaboration"},{v:"blind",l:"Identify blind spots"},{v:"perf",l:"Collective performance"}] },
};

function getDomain(s) {
  for (const [d, arr] of Object.entries(DOMAINS)) if (arr.includes(s)) return d;
  return "Thinking";
}

function getDomainCounts(strengths) {
  const c = { Executing:0, Influencing:0, Relationship:0, Thinking:0 };
  strengths.forEach(s => { c[getDomain(s)]++; });
  return c;
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
  return `You are an expert StrengthsFinder leadership coach and organizational psychologist. You have deep knowledge of all 34 CliftonStrengths themes, their interactions, blind spots, and how to develop them for leadership, team performance, and individual growth.\n\nAlways respond in ${langName}. Style: warm but direct, evidence-based, practical. Concrete examples and actionable recommendations. Never be generic.\n\nContext:\n${context}`;
}

export default function Home() {
  const [lang, setLang] = useState("fr");
  const [mode, setMode] = useState("individual");

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

  // Team state
  const [teamName, setTeamName] = useState("");
  const [teamGoal, setTeamGoal] = useState("dynamics");
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

  const L = LABELS[lang];

  function scrollChat(ref) {
    setTimeout(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, 50);
  }

  // Individual analysis
  async function analyzeIndividual() {
    const strengths = indStrengths.filter(Boolean);
    if (strengths.length < 3) { alert("Saisissez au moins 3 forces."); return; }
    setIndLoading(true);
    const goalLabel = L.goalOptions.find(g => g.v === indGoal)?.l || indGoal;
    const ctx = `Name: ${indName || "Participant"}\nRole: ${indRole || "-"}\nObjective: ${goalLabel}\nStrengths (ranked): ${strengths.map((s,i) => `${i+1}. ${s}`).join(", ")}`;
    setIndContext(ctx);
    const promptText = lang === "fr"
      ? `Fais un debrief complet de ce profil StrengthsFinder. Structure:\n1. SYNTHÈSE DU PROFIL (3-4 phrases sur l'identité)\n2. FORCES EN DÉTAIL (analyse des 3 premières forces dominantes)\n3. DYNAMIQUES ET INTERACTIONS (synergies et tensions)\n4. ANGLES MORTS (2-3 risques)\n5. RECOMMANDATIONS CONCRÈTES (3 actions liées à: ${goalLabel})\n\nProfil: ${ctx}`
      : lang === "de"
      ? `Erstelle ein vollständiges Debrief dieses StrengthsFinder-Profils. Struktur:\n1. PROFILZUSAMMENFASSUNG\n2. STÄRKEN IM DETAIL (Top 3)\n3. DYNAMIKEN UND INTERAKTIONEN\n4. BLINDE FLECKEN\n5. KONKRETE EMPFEHLUNGEN (3 Maßnahmen für: ${goalLabel})\n\nProfil: ${ctx}`
      : `Provide a complete StrengthsFinder debrief. Structure:\n1. PROFILE SUMMARY\n2. KEY STRENGTHS (top 3 in detail)\n3. DYNAMICS AND INTERACTIONS\n4. BLIND SPOTS\n5. CONCRETE RECOMMENDATIONS (3 actions for: ${goalLabel})\n\nProfile: ${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildSystem(lang, ctx), msgs);
      setIndReport({ text: report, strengths });
      setIndHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setIndChatMsgs([{ role:"ag", text: lang==="fr" ? "Debrief généré. Posez vos questions pour approfondir." : lang==="de" ? "Debrief erstellt. Stellen Sie Ihre Fragen." : "Debrief complete. Ask your questions." }]);
    } catch(e) { alert("Erreur API."); }
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
    } catch(e) { setIndChatMsgs([...newMsgs, { role:"ag", text:"Erreur. Réessayez." }]); }
    setIndChatLoading(false);
    scrollChat(indChatRef);
  }

  // Team analysis
  function addMember() {
    setMembers([...members, { id:nextId, name:"", strengths:Array(5).fill("") }]);
    setNextId(nextId+1);
  }
  function removeMember(id) { setMembers(members.filter(m => m.id !== id)); }
  function updateMemberName(id, val) { setMembers(members.map(m => m.id===id ? {...m, name:val} : m)); }
  function updateMemberStrength(id, idx, val) { setMembers(members.map(m => m.id===id ? {...m, strengths:m.strengths.map((s,i) => i===idx ? val : s)} : m)); }

  async function analyzeTeam() {
    const validMembers = members.filter(m => m.strengths.some(Boolean));
    if (validMembers.length < 2) { alert("Ajoutez au moins 2 membres avec des forces."); return; }
    setTeamLoading(true);
    const goalLabel = L.teamGoalOptions.find(g => g.v === teamGoal)?.l || teamGoal;
    const membersDesc = validMembers.map((m,i) => `${m.name||`Membre ${i+1}`}: ${m.strengths.filter(Boolean).join(", ")}`).join("\n");
    const ctx = `Team: ${teamName||"Équipe"}\nObjective: ${goalLabel}\nMembers:\n${membersDesc}`;
    setTeamContext(ctx);
    const allStrengths = validMembers.flatMap(m => m.strengths.filter(Boolean));
    const promptText = lang === "fr"
      ? `Fais une analyse complète de cette équipe selon StrengthsFinder. Structure:\n1. IDENTITÉ COLLECTIVE (3-4 phrases)\n2. FORCES DOMINANTES (les 3 plus représentées et leur impact)\n3. COMPLÉMENTARITÉS (qui se complète et comment)\n4. ANGLES MORTS COLLECTIFS\n5. TENSIONS POTENTIELLES\n6. RECOMMANDATIONS (3 actions pour: ${goalLabel})\n\nÉquipe: ${ctx}`
      : lang === "de"
      ? `Erstelle eine vollständige Teamanalyse. Struktur:\n1. KOLLEKTIVE IDENTITÄT\n2. DOMINANTE STÄRKEN\n3. KOMPLEMENTARITÄTEN\n4. KOLLEKTIVE BLINDE FLECKEN\n5. POTENZIELLE SPANNUNGEN\n6. EMPFEHLUNGEN (3 für: ${goalLabel})\n\nTeam: ${ctx}`
      : `Provide a complete team StrengthsFinder analysis. Structure:\n1. COLLECTIVE IDENTITY\n2. DOMINANT STRENGTHS\n3. COMPLEMENTARITIES\n4. COLLECTIVE BLIND SPOTS\n5. POTENTIAL TENSIONS\n6. RECOMMENDATIONS (3 for: ${goalLabel})\n\nTeam: ${ctx}`;
    try {
      const msgs = [{ role:"user", content: promptText }];
      const report = await callAPI(buildSystem(lang, ctx), msgs);
      setTeamReport({ text: report, strengths: allStrengths });
      setTeamHistory([{ role:"user", content: promptText }, { role:"assistant", content: report }]);
      setTeamChatMsgs([{ role:"ag", text: lang==="fr" ? "Analyse générée. Posez vos questions sur l'équipe." : lang==="de" ? "Analyse erstellt." : "Analysis complete. Ask your questions." }]);
    } catch(e) { alert("Erreur API."); }
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
      const reply = await callAPI(buildSystem(lang, teamContext), newHistory);
      setTeamChatMsgs([...newMsgs, { role:"ag", text: reply }]);
      setTeamHistory([...newHistory, { role:"assistant", content: reply }]);
    } catch(e) { setTeamChatMsgs([...newMsgs, { role:"ag", text:"Erreur. Réessayez." }]); }
    setTeamChatLoading(false);
    scrollChat(teamChatRef);
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
            <button key={l} className={`pill ${lang===l?"active":""}`} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
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
              <input type="text" value={indName} onChange={e => setIndName(e.target.value)} placeholder="Prénom Nom" />
            </div>
            <div className="field-row">
              <label>{L.role}</label>
              <input type="text" value={indRole} onChange={e => setIndRole(e.target.value)} placeholder="ex. CEO, Chef de projet..." />
            </div>
          </div>
          <div className="form-section">
            <h2>{L.top5}</h2>
            <div className="strengths-grid">
              {[0,1,2,3,4].map(i => (
                <div key={i} className="strength-field">
                  <div className="rank-badge">{i+1}</div>
                  <input type="text" list="sf-list" value={indStrengths[i]} onChange={e => setIndStrengths(indStrengths.map((s,j) => j===i ? e.target.value : s))} placeholder={`Force ${i+1}`} />
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
                  <input type="text" list="sf-list" value={indStrengths[i]} onChange={e => setIndStrengths(indStrengths.map((s,j) => j===i ? e.target.value : s))} placeholder={`Force ${i+1} (optionnel)`} />
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
            {indLoading ? "Analyse en cours..." : L.analyze}
          </button>
        </div>
      )}

      {mode === "individual" && indReport && (
        <div>
          <button className="back-btn" onClick={() => { setIndReport(null); setIndChatMsgs([]); setIndHistory([]); }}>{L.back}</button>
          <DomainsBar strengths={indReport.strengths} L={L} />
          <div className="report-area">
            <div className="report-content">{indReport.text}</div>
          </div>
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
              <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="ex. Board, Équipe Marketing..." />
            </div>
            <div className="field-row" style={{marginTop:"8px"}}>
              <label>{L.teamGoal}</label>
              <select value={teamGoal} onChange={e => setTeamGoal(e.target.value)}>
                {L.teamGoalOptions.map(g => <option key={g.v} value={g.v}>{g.l}</option>)}
              </select>
            </div>
          </div>
          <div className="form-section">
            <h2>{L.members}</h2>
            {members.map((m, idx) => (
              <div key={m.id} className="member-card">
                <div className="member-header">
                  <span>{L.members} {idx+1}</span>
                  {members.length > 2 && <button className="remove-btn" onClick={() => removeMember(m.id)}>✕</button>}
                </div>
                <div className="field-row" style={{marginBottom:"8px"}}>
                  <input type="text" value={m.name} onChange={e => updateMemberName(m.id, e.target.value)} placeholder={L.name} />
                </div>
                <div className="strengths-grid">
                  {[0,1,2,3,4].map(i => (
                    <div key={i} className="strength-field">
                      <div className="rank-badge">{i+1}</div>
                      <input type="text" list="sf-list" value={m.strengths[i]} onChange={e => updateMemberStrength(m.id, i, e.target.value)} placeholder={`Force ${i+1}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="add-member-btn" onClick={addMember}>{L.addMember}</button>
          </div>
          <button className="analyze-btn" onClick={analyzeTeam} disabled={teamLoading}>
            {teamLoading ? "Analyse en cours..." : L.analyzeTeam}
          </button>
        </div>
      )}

      {mode === "team" && teamReport && (
        <div>
          <button className="back-btn" onClick={() => { setTeamReport(null); setTeamChatMsgs([]); setTeamHistory([]); }}>{L.backTeam}</button>
          <DomainsBar strengths={teamReport.strengths} L={L} />
          <div className="report-area">
            <div className="report-content">{teamReport.text}</div>
          </div>
          <ChatArea messages={teamChatMsgs} chatAreaRef={teamChatRef} />
          <div className="chat-input-row">
            <textarea rows={2} value={teamChatInput} onChange={e => setTeamChatInput(e.target.value)}
              placeholder={L.teamChatPlaceholder}
              onKeyDown={e => { if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendTeamChat();} }} />
            <button className="send-btn" onClick={sendTeamChat} disabled={teamChatLoading}>↑</button>
          </div>
        </div>
      )}
    </div>
  );
}
