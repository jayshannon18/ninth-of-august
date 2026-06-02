import { useState } from "react";

// ─── Your Photos ───────────────────────────────────────────────
const IMG1 = "/photo1.png";
const IMG2 = "/photo2.png";
const IMG3 = "/photo3.png";
const IMG4 = "/photo4.jpg";
const IMG5 = "/photo5.jpg";
const IMG6 = "/photo6.jpg";
const IMG7 = "/photo7.png";

// Photo metadata — edit labels/categories to match your actual work
const PORTFOLIO = [
  { id: 1, src: IMG1, category: "Portrait", label: "Studio Editorial", client: "Personal Project", aspect: "portrait" },
  { id: 2, src: IMG2, category: "Lifestyle", label: "Outdoor Lifestyle", client: "Brand Shoot", aspect: "landscape" },
  { id: 3, src: IMG3, category: "Lifestyle", label: "Lifestyle Series", client: "Brand Shoot", aspect: "portrait" },
  { id: 4, src: IMG4, category: "Product", label: "Product Detail", client: "The Bean Guys", aspect: "square" },
  { id: 5, src: IMG5, category: "Product", label: "Product Collection", client: "The Bean Guys", aspect: "square" },
  { id: 6, src: IMG6, category: "Product", label: "Food & Beverage", client: "Restaurant Client", aspect: "landscape" },
  { id: 7, src: IMG7, category: "Portrait", label: "Urban Editorial", client: "Fashion Client", aspect: "portrait" },
];

const CATEGORIES = ["All", "Portrait", "Lifestyle", "Product"];

const STEPS = ["Project Type", "Style & Budget", "Location", "Match"];
const PROJECT_TYPES = ["Brand Campaign", "Portrait Session", "Product Shoot", "Lifestyle Content", "Corporate Event", "Music Video"];
const STYLES = ["Editorial", "Cinematic", "Lifestyle", "Documentary", "Bold & Vibrant", "Minimalist"];

const CREATORS = [
  { id: 1, name: "Maya Chen", type: "Photographer", style: "Editorial", location: "Los Angeles, CA", rating: 4.9, reviews: 127, price: 350, available: true, tags: ["Fashion", "Brand", "Portrait"], initials: "MC" },
  { id: 2, name: "Jordan Ellis", type: "Videographer", style: "Cinematic", location: "New York, NY", rating: 5.0, reviews: 89, price: 650, available: true, tags: ["Wedding", "Commercial", "Documentary"], initials: "JE" },
  { id: 3, name: "Sofia Reyes", type: "Photographer", style: "Lifestyle", location: "Miami, FL", rating: 4.8, reviews: 214, price: 275, available: false, tags: ["Lifestyle", "Events", "Product"], initials: "SR" },
  { id: 4, name: "Zara Okonkwo", type: "Photographer", style: "Bold & Vibrant", location: "Austin, TX", rating: 4.9, reviews: 178, price: 420, available: true, tags: ["Portrait", "Fashion", "Art"], initials: "ZO" },
];

// ─── Subcomponents ──────────────────────────────────────────────

function LoadingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 5, alignItems: "center" }}>
      {[0,1,2].map(i => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a1a1a", display: "inline-block",
          animation: "dotPulse 1.2s ease-in-out infinite", animationDelay: `${i*0.2}s` }} />
      ))} 
    </span>
  );
}

function CreatorCard({ creator, featured }) {
  const [booked, setBooked] = useState(false);
  return (
    <div style={{
      background: "#fff", border: featured ? "2px solid #1a1a1a" : "1px solid #e8e3dc",
      borderRadius: 12, padding: 24, position: "relative",
      transition: "transform 0.2s, box-shadow 0.2s",
      boxShadow: featured ? "4px 4px 0 #1a1a1a" : "none",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = featured ? "6px 6px 0 #1a1a1a" : "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = featured ? "4px 4px 0 #1a1a1a" : "none"; }}
    >
      {featured && (
        <div style={{ position: "absolute", top: -12, left: 20, background: "#1a1a1a", color: "#f5f0e8", fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: "3px 12px", borderRadius: 20, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          Best Match
        </div>
      )}
      <div style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#f5f0e8", fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>
          {creator.initials}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a", fontFamily: "'Cormorant Garamond', serif" }}>{creator.name}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{creator.type} · {creator.style}</div>
          <div style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>📍 {creator.location}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#1a1a1a", fontFamily: "'DM Mono', monospace" }}>${creator.price}</div>
          <div style={{ fontSize: 10, color: "#aaa" }}>/ day</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 16 }}>
        {creator.tags.map(t => (
          <span key={t} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, background: "#f5f0e8", color: "#666", fontFamily: "'DM Mono', monospace", border: "1px solid #e8e3dc" }}>{t}</span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "#666" }}>★ {creator.rating} <span style={{ color: "#bbb" }}>({creator.reviews})</span></div>
        <button onClick={() => creator.available && setBooked(b => !b)} style={{
          padding: "8px 18px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: creator.available ? "pointer" : "not-allowed",
          border: booked ? "1px solid #4a8a4a" : "1px solid #1a1a1a",
          background: booked ? "#f0faf0" : featured ? "#1a1a1a" : "#fff",
          color: booked ? "#4a8a4a" : featured ? "#f5f0e8" : "#1a1a1a",
          opacity: creator.available ? 1 : 0.4, fontFamily: "'DM Mono', monospace", transition: "all 0.15s",
        }}>
          {booked ? "✓ Sent" : creator.available ? "Book" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────
export default function NinthOfAugustApp() {
  const [view, setView] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [step, setStep] = useState(0);
  const [projectType, setProjectType] = useState("");
  const [creatorType, setCreatorType] = useState("");
  const [budget, setBudget] = useState(500);
  const [style, setStyle] = useState("");
  const [city, setCity] = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [matches, setMatches] = useState(null);
  const [aiNote, setAiNote] = useState("");

  const filtered = activeCategory === "All" ? PORTFOLIO : PORTFOLIO.filter(p => p.category === activeCategory);

  async function runAIMatch() {
    setAiThinking(true);
    setStep(3);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: `You are a creative talent matchmaker for 9th of August, a premium photography and videography booking platform.
Client needs:
- Project: ${projectType}
- Creator type: ${creatorType || "Either"}
- Style: ${style || "No preference"}
- Budget: up to $${budget}/day
- Location: ${city || "Anywhere"}
Creators: ${CREATORS.map(c => `ID ${c.id}: ${c.name} (${c.type}, ${c.style}, ${c.location}, $${c.price}/day, available: ${c.available})`).join("; ")}
Return ONLY JSON: {"topMatchIds": [1-3 IDs], "note": "1-2 warm sentences about why these are great picks"}` }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setMatches(parsed.topMatchIds || []);
      setAiNote(parsed.note || "Here are your top matches.");
    } catch {
      setMatches([1, 4]);
      setAiNote("These creators are an excellent fit for your project style and budget.");
    }
    setAiThinking(false);
  }

  const matchedCreators = matches ? CREATORS.filter(c => matches.includes(c.id)).sort((a, b) => matches.indexOf(a.id) - matches.indexOf(b.id)) : [];

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #f5f0e8; color: #1a1a1a; }
    @keyframes dotPulse { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
    @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
    @keyframes scaleIn { from{opacity:0;transform:scale(.96)} to{opacity:1;transform:scale(1)} }
    .fade-in { animation: fadeIn .5s ease forwards; }
    .scale-in { animation: scaleIn .4s ease forwards; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-thumb { background: #ccc; }
    input[type=range] { accent-color: #1a1a1a; }
  `;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{css}</style>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 24 }}>
          <img src={PORTFOLIO[lightbox].src} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4 }} onClick={e => e.stopPropagation()} />
          <div style={{ position: "absolute", bottom: 32, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
            {PORTFOLIO[lightbox].client} — {PORTFOLIO[lightbox].label}
          </div>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 24, right: 24, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 20, width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          {lightbox > 0 && <button onClick={e => { e.stopPropagation(); setLightbox(l => l - 1); }} style={{ position: "absolute", left: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 22, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}>‹</button>}
          {lightbox < PORTFOLIO.length - 1 && <button onClick={e => { e.stopPropagation(); setLightbox(l => l + 1); }} style={{ position: "absolute", right: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", fontSize: 22, width: 44, height: 44, borderRadius: "50%", cursor: "pointer" }}>›</button>}
        </div>
      )}

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0d8cc", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f0e8", fontSize: 16 }}>◈</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: "#1a1a1a", letterSpacing: 0.5 }}>9th of August</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[["Work", "portfolio"], ["Book", "wizard"]].map(([label, v]) => (
            <button key={v} onClick={() => { setView(v); setStep(0); setMatches(null); }} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: view === v ? "#1a1a1a" : "transparent", color: view === v ? "#f5f0e8" : "#666", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{label}</button>
          ))}
        </div>
      </nav>

      {/* ── HOME ── */}
      {view === "home" && (
        <div className="fade-in">

          {/* Hero — full bleed split */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "92vh" }}>
            {/* Left: text */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 64px", borderRight: "1px solid #e0d8cc" }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 32 }}>
                Photography & Videography
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(52px, 5.5vw, 84px)", fontWeight: 300, lineHeight: 1.05, color: "#1a1a1a", marginBottom: 32 }}>
                We make<br /><em style={{ fontStyle: "italic", fontWeight: 600 }}>your brand</em><br />unforgettable.
              </h1>
              <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, maxWidth: 420, marginBottom: 48, fontWeight: 300 }}>
                Clean, confident visuals for brands, artists, and moments that matter. Nationwide network, AI-matched to your exact project.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setView("wizard")} style={{ padding: "14px 32px", borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, transition: "opacity 0.15s" }} onMouseEnter={e=>e.target.style.opacity=.8} onMouseLeave={e=>e.target.style.opacity=1}>
                  Get Matched →
                </button>
                <button onClick={() => setView("portfolio")} style={{ padding: "14px 32px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 14, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                  See Work
                </button>
              </div>
            </div>
            {/* Right: hero image */}
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={IMG7} alt="Editorial portrait" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(245,240,232,0.08), transparent)" }} />
            </div>
          </div>

          {/* Marquee strip */}
          <div style={{ borderTop: "1px solid #e0d8cc", borderBottom: "1px solid #e0d8cc", padding: "14px 0", overflow: "hidden", background: "#1a1a1a" }}>
            <div style={{ display: "flex", gap: 48, color: "#f5f0e8", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 2, whiteSpace: "nowrap", opacity: 0.6 }}>
              {Array(6).fill(["PORTRAIT", "LIFESTYLE", "PRODUCT", "BRAND", "EDITORIAL", "NATIONWIDE"]).flat().map((t, i) => (
                <span key={i}>{t} ·</span>
              ))}
            </div>
          </div>

          {/* Featured Video Section */}
          <div style={{ padding: "80px 48px", borderBottom: "1px solid #e0d8cc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Featured Work</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 400 }}>Behind the Lens</h2>
              </div>
              <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono', monospace", fontStyle: "italic" }}>Brand · Lifestyle · Product</div>
            </div>
            {/* YouTube embed — 16:9 responsive */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 10, overflow: "hidden", background: "#0e0e0e", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
              <iframe
                src="https://www.youtube-nocookie.com/embed/wSTDuA39ors?autoplay=0&color=white&controls=0&modestbranding=1&iv_load_policy=3&rel=0"
                title="9th of August — Featured Work"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: "absolute", top: "-10%", left: 0, width: "100%", height: "120%", border: "none" }}
              />
              {/* Mask the YouTube title bar that appears at the top on hover */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "12%", background: "#0e0e0e", zIndex: 1, pointerEvents: "none" }} />
            </div>
          </div>

          {/* Work preview — 3-up grid */}
          <div style={{ padding: "80px 48px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Selected Work</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 400 }}>Recent Projects</h2>
              </div>
              <button onClick={() => setView("portfolio")} style={{ fontSize: 13, color: "#1a1a1a", background: "none", border: "1px solid #1a1a1a", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>View All →</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 3 }}>
              {/* Featured large */}
              <div onClick={() => setLightbox(0)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", gridRow: "span 2", aspectRatio: "3/4" }}>
                <img src={IMG1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 20px", background: "linear-gradient(transparent, rgba(0,0,0,0.55))", color: "#fff" }}>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8, marginBottom: 4 }}>PORTRAIT</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400 }}>Studio Editorial</div>
                </div>
              </div>
              {/* Top right */}
              <div onClick={() => setLightbox(6)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                <img src={IMG7} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>LIFESTYLE</div>
                </div>
              </div>
              {/* Bottom right */}
              <div onClick={() => setLightbox(3)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                <img src={IMG4} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>PRODUCT</div>
                </div>
              </div>
              {/* Bottom right 2 */}
              <div onClick={() => setLightbox(2)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                <img src={IMG3} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>LIFESTYLE</div>
                </div>
              </div>
              <div onClick={() => setLightbox(4)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                <img src={IMG5} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                  <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>PRODUCT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Story / emotional section */}
          <div style={{ borderTop: "1px solid #e0d8cc" }}>
            {/* Image — wide cinematic crop */}
            <div style={{ width: "100%", aspectRatio: "16/7", overflow: "hidden", position: "relative" }}>
              <img src={IMG1} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(26,26,26,0.18))" }} />
            </div>
            {/* Text panel below, full width dark */}
            <div style={{ background: "#1a1a1a", color: "#f5f0e8", padding: "72px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 24 }}>Our Approach</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 4vw, 64px)", fontWeight: 300, lineHeight: 1.05 }}>
                  Every frame<br />tells <em style={{ fontStyle: "italic" }}>your</em> story.
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
                  We don't just take photos — we study your brand, your audience, and the feeling you want to leave behind. The result is imagery that resonates long after the shoot ends.
                </p>
                <p style={{ fontSize: 16, color: "#777", lineHeight: 1.8, fontWeight: 300, marginBottom: 36 }}>
                  From intimate portrait sessions to full brand campaigns, our vetted network of creatives brings the same level of intention to every project.
                </p>
                <button onClick={() => setView("wizard")} style={{ padding: "14px 28px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, background: "transparent", color: "#f5f0e8", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }} onMouseEnter={e=>{e.target.style.background="rgba(255,255,255,0.1)"}} onMouseLeave={e=>{e.target.style.background="transparent"}}>
                  Start Your Project →
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #e0d8cc", borderBottom: "1px solid #e0d8cc" }}>
            {[["4,000+","Shoots Completed"],["50","States Covered"],["500+","Vetted Creators"],["4.9 ★","Avg Rating"]].map(([num, label], i) => (
              <div key={i} style={{ padding: "40px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid #e0d8cc" : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{num}</div>
                <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ padding: "100px 48px", textAlign: "center", background: "#f5f0e8" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 24 }}>Ready when you are</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 300, marginBottom: 20, lineHeight: 1.1 }}>
              Let's make something<br /><em style={{ fontStyle: "italic", fontWeight: 600 }}>worth remembering.</em>
            </h2>
            <p style={{ fontSize: 17, color: "#888", marginBottom: 48, fontWeight: 300 }}>Match with a creator in minutes. No back-and-forth, no guesswork.</p>
            <button onClick={() => setView("wizard")} style={{ padding: "18px 48px", border: "none", borderRadius: 6, background: "#1a1a1a", color: "#f5f0e8", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>
              Find My Match →
            </button>
          </div>
        </div>
      )}

      {/* ── PORTFOLIO ── */}
      {view === "portfolio" && (
        <div className="fade-in" style={{ padding: "60px 48px" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>Portfolio</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 400, marginBottom: 32 }}>Selected Work</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid", borderColor: activeCategory === cat ? "#1a1a1a" : "#ddd", background: activeCategory === cat ? "#1a1a1a" : "transparent", color: activeCategory === cat ? "#f5f0e8" : "#666", fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ columns: "3 280px", gap: 6 }}>
            {filtered.map((photo, idx) => (
              <div key={photo.id} onClick={() => setLightbox(PORTFOLIO.findIndex(p => p.id === photo.id))} className="scale-in" style={{ breakInside: "avoid", marginBottom: 6, position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in" }}>
                <img src={photo.src} alt={photo.label} style={{ width: "100%", display: "block", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px 16px" }}
                  onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.35)"; e.currentTarget.querySelector(".meta").style.opacity=1;}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(0,0,0,0)"; e.currentTarget.querySelector(".meta").style.opacity=0;}}>
                  <div className="meta" style={{ opacity: 0, transition: "opacity 0.2s", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8, marginBottom: 3 }}>{photo.category.toUpperCase()}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18 }}>{photo.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>{photo.client}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── WIZARD ── */}
      {view === "wizard" && (
        <div className="fade-in" style={{ maxWidth: 640, margin: "0 auto", padding: "60px 24px" }}>
          {step < 3 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {STEPS.slice(0,3).map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= step ? "#1a1a1a" : "#ddd", transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Mono', monospace" }}>Step {step + 1} of 3 — {STEPS[step]}</div>
            </div>
          )}

          {step === 0 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, marginBottom: 8 }}>What's the project?</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>Help us understand what you're creating.</p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Project Type</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PROJECT_TYPES.map(p => (
                    <button key={p} onClick={() => setProjectType(p)} style={{ padding: "10px 18px", borderRadius: 6, border: "1px solid", borderColor: projectType === p ? "#1a1a1a" : "#ddd", background: projectType === p ? "#1a1a1a" : "#fff", color: projectType === p ? "#f5f0e8" : "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{p}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>I need a…</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {["Photographer", "Videographer", "Both"].map(t => (
                    <button key={t} onClick={() => setCreatorType(t)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid", borderColor: creatorType === t ? "#1a1a1a" : "#ddd", background: creatorType === t ? "#1a1a1a" : "#fff", color: creatorType === t ? "#f5f0e8" : "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{t}</button>
                  ))}
                </div>
              </div>
              <button disabled={!projectType} onClick={() => setStep(1)} style={{ width: "100%", padding: 16, borderRadius: 6, border: "none", background: projectType ? "#1a1a1a" : "#e8e3dc", color: projectType ? "#f5f0e8" : "#aaa", fontSize: 14, fontWeight: 600, cursor: projectType ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", transition: "all 0.2s" }}>Continue →</button>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, marginBottom: 8 }}>Style & Budget</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>What look are you going for?</p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Visual Style</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {STYLES.map(s => (
                    <button key={s} onClick={() => setStyle(s)} style={{ padding: "10px 18px", borderRadius: 6, border: "1px solid", borderColor: style === s ? "#1a1a1a" : "#ddd", background: style === s ? "#1a1a1a" : "#fff", color: style === s ? "#f5f0e8" : "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{s}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 40 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>Daily Budget</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 20, fontWeight: 500, color: "#1a1a1a" }}>${budget}</div>
                </div>
                <input type="range" min={150} max={1200} step={50} value={budget} onChange={e => setBudget(Number(e.target.value))} style={{ width: "100%", cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#bbb", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>
                  <span>$150</span><span>$1,200</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#666", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>← Back</button>
                <button onClick={() => setStep(2)} style={{ flex: 2, padding: 14, borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600 }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, marginBottom: 8 }}>Where's the shoot?</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>We'll find creatives near you or available to travel.</p>
              <input type="text" placeholder="City, State (e.g. Los Angeles, CA)" value={city} onChange={e => setCity(e.target.value)} style={{ width: "100%", padding: "16px 18px", border: "1px solid #ddd", borderRadius: 6, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", marginBottom: 40, background: "#fff", color: "#1a1a1a" }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#666", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>← Back</button>
                <button onClick={runAIMatch} style={{ flex: 2, padding: 14, borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600 }}>✦ Find My Match</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              {aiThinking ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 22, color: "#f5f0e8" }}>◈</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 12 }}>Finding your match</h3>
                  <p style={{ color: "#aaa", marginBottom: 24, fontWeight: 300 }}>Reviewing your criteria against our creator network…</p>
                  <LoadingDots />
                </div>
              ) : (
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 20, background: "#f0faf0", border: "1px solid #c0dcc0", color: "#4a8a4a", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>✓ Match Complete</div>
                  <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, marginBottom: 12 }}>Your Top Matches</h2>
                  <p style={{ color: "#666", lineHeight: 1.7, padding: "14px 18px", background: "#fff", borderRadius: 8, border: "1px solid #e8e3dc", fontSize: 14, marginBottom: 28 }}>{aiNote}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {matchedCreators.map((c, i) => <CreatorCard key={c.id} creator={c} featured={i === 0} />)}
                  </div>
                  <button onClick={() => { setStep(0); setMatches(null); setProjectType(""); setCreatorType(""); setStyle(""); setCity(""); }} style={{ width: "100%", marginTop: 24, padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#888", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>← Start Over</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0d8cc", padding: "40px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f5f0e8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f0e8", fontSize: 14 }}>◈</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600 }}>9th of August</span>
        </div>
        <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>© 2026 · AI-Powered Creative Booking</div>
      </footer>
    </div>
  );
}
