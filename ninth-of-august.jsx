import { useState, useEffect, useRef } from "react";

// ─── UPDATE THESE ──────────────────────────────────────────────
const CONTACT_PHONE = "(870) 636-1283"; // your phone number
const CONTACT_EMAIL_DISPLAY = "shop@9thofaugust.com"; // your email
const CONTACT_LOCATION = "Frisco, TX · Dallas–Fort Worth";

// ─── Your Photos ───────────────────────────────────────────────
const IMG1 = "/photo1.png";
const IMG2 = "/photo2.png";
const IMG3 = "/photo3.png";
const IMG4 = "/photo4.jpg";
const IMG5 = "/photo5.jpg";
const IMG6 = "/photo6.jpg";
const IMG7 = "/photo7.png";

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

const SERVICES = [
  { title: "Brand Campaigns", desc: "Full photo + video production for product launches, identity campaigns, and advertising.", price: "Starting at $2,400" },
  { title: "Music Videos", desc: "Concept-to-delivery video production with creative direction, filming, and post-production.", price: "Starting at $2,000" },
  { title: "Product Photography", desc: "High-resolution stills for e-commerce, advertising, and print — consistent and on-brand.", price: "Starting at $800" },
  { title: "Portrait Sessions", desc: "Individual, executive, and editorial portrait photography for personal and brand use.", price: "Starting at $600" },
  { title: "Event Coverage", desc: "Professional photo and video documentation for corporate events, launches, and live shows.", price: "Starting at $1,500" },
  { title: "Weddings", desc: "Full-day photo and video storytelling — from getting ready through the final dance.", price: "Custom quote" },
];

const TESTIMONIALS = [
  {
    quote: "Working with 9th of August transformed how our brand shows up visually. They understood our aesthetic from day one and delivered campaign assets that doubled our engagement.",
    name: "Marcus T.",
    role: "Creative Director",
    company: "FORM Studio",
  },
  {
    quote: "The music video exceeded every expectation. Professional, fast, and genuinely creative. I've already booked three more projects with this team.",
    name: "Keisha M.",
    role: "Recording Artist",
    company: "",
  },
  {
    quote: "We needed 200+ product images for a catalog launch on a tight deadline. 9th of August delivered in 5 days — every shot clean, consistent, and exactly on-brand.",
    name: "Jordan R.",
    role: "Marketing Manager",
    company: "The Bean Guys",
  },
];

const SHOOT_TYPES = ["Brand Campaign", "Portrait Session", "Product Shoot", "Lifestyle Content", "Event Coverage", "Music Video", "Wedding"];
const MEDIA_TYPES = ["Photography", "Videography", "Both"];
const DURATIONS = [
  { label: "2 Hours", desc: "Quick session — headshots, simple product" },
  { label: "4 Hours (Half Day)", desc: "Most portrait & product shoots" },
  { label: "8 Hours (Full Day)", desc: "Brand campaigns, events, full production" },
  { label: "2 Days", desc: "Multi-look campaigns, extended coverage" },
  { label: "3+ Days", desc: "Large-scale productions, destination shoots" },
];

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

export default function NinthOfAugustApp() {
  const [view, setView] = useState("home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState(null);
  const [step, setStep] = useState(0);
  const [shootType, setShootType] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [duration, setDuration] = useState(null);
  const [clientCity, setClientCity] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [quoting, setQuoting] = useState(false);
  const [quote, setQuote] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactProjectType, setContactProjectType] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactError, setContactError] = useState(null);
  const contactRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const filtered = activeCategory === "All" ? PORTFOLIO : PORTFOLIO.filter(p => p.category === activeCategory);

  function resetQuote() {
    setStep(0); setQuote(null); setShootType(""); setMediaType(""); setDuration(null); setClientCity(""); setClientEmail("");
  }

  function goToContact() {
    if (view !== "home") {
      setView("home");
      setTimeout(() => contactRef.current?.scrollIntoView({ behavior: 'smooth' }), 80);
    } else {
      contactRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  async function getQuote() {
    setQuoting(true);
    setStep(3);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shootType, mediaType, duration, location: clientCity, email: clientEmail }),
      });
      const data = await res.json();
      setQuote(data);
    } catch {
      setQuote({ error: true });
    }
    setQuoting(false);
  }

  async function submitContact(e) {
    e.preventDefault();
    setContactSending(true);
    setContactError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, phone: contactPhone, projectType: contactProjectType, message: contactMessage }),
      });
      const data = await res.json();
      if (data.sent) {
        setContactSent(true);
      } else {
        setContactError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setContactError("Network error. Please try again.");
    }
    setContactSending(false);
  }

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
    input:focus, textarea:focus, select:focus { border-color: #1a1a1a !important; }
    .service-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.07) !important; transform: translateY(-2px); }
    .service-card { transition: box-shadow 0.2s, transform 0.2s; }
  `;

  const m = isMobile;

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
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,240,232,0.96)", backdropFilter: "blur(12px)", borderBottom: "1px solid #e0d8cc", padding: m ? "0 16px" : "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => setView("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f0e8", fontSize: 16 }}>◈</div>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 18 : 22, fontWeight: 600, color: "#1a1a1a", letterSpacing: 0.5 }}>9th of August</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[["Work", "portfolio"], ["Pricing", "wizard"]].map(([label, v]) => (
            <button key={v} onClick={() => { setView(v); setStep(0); setQuote(null); }} style={{ padding: m ? "8px 10px" : "8px 16px", borderRadius: 6, border: "none", background: view === v ? "#1a1a1a" : "transparent", color: view === v ? "#f5f0e8" : "#666", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{label}</button>
          ))}
          <button onClick={goToContact} style={{ padding: m ? "8px 10px" : "8px 16px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s", marginLeft: 4 }}>Contact</button>
        </div>
      </nav>

      {/* ── HOME ── */}
      {view === "home" && (
        <div className="fade-in">

          {/* Hero */}
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", minHeight: m ? "auto" : "92vh" }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: m ? "60px 24px 48px" : "80px 64px", borderRight: m ? "none" : "1px solid #e0d8cc" }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 24 }}>
                Video Production & Commercial Photography · Frisco, TX
              </div>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(44px, 5.5vw, 84px)", fontWeight: 300, lineHeight: 1.05, color: "#1a1a1a", marginBottom: 32 }}>
                We make<br /><em style={{ fontStyle: "italic", fontWeight: 600 }}>your brand</em><br />unforgettable.
              </h1>
              <p style={{ fontSize: 17, color: "#666", lineHeight: 1.7, maxWidth: 420, marginBottom: 48, fontWeight: 300 }}>
                Professional video production agency and commercial photography studio. Brand campaigns, music videos, and product photography — nationwide coverage from Frisco, TX.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button onClick={() => setView("wizard")} style={{ padding: "14px 32px", borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>
                  Get a Custom Quote →
                </button>
                <button onClick={goToContact} style={{ padding: "14px 32px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 14, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                  Start a Project
                </button>
              </div>
            </div>
            {!m && (
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img src={IMG7} alt="Professional photography by 9th of August" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(245,240,232,0.08), transparent)" }} />
              </div>
            )}
          </div>

          {/* Marquee */}
          <div style={{ borderTop: "1px solid #e0d8cc", borderBottom: "1px solid #e0d8cc", padding: "14px 0", overflow: "hidden", background: "#1a1a1a" }}>
            <div style={{ display: "flex", gap: 48, color: "#f5f0e8", fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: 2, whiteSpace: "nowrap", opacity: 0.6 }}>
              {Array(6).fill(["VIDEO PRODUCTION", "BRAND CAMPAIGNS", "MUSIC VIDEOS", "PRODUCT PHOTOGRAPHY", "COMMERCIAL PHOTO", "NATIONWIDE"]).flat().map((t, i) => (
                <span key={i}>{t} ·</span>
              ))}
            </div>
          </div>

          {/* Featured Video */}
          <div style={{ padding: m ? "48px 20px" : "80px 48px", borderBottom: "1px solid #e0d8cc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Featured Work</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 32 : 42, fontWeight: 400 }}>Behind the Lens</h2>
              </div>
              <div style={{ fontSize: 13, color: "#999", fontFamily: "'DM Mono', monospace", fontStyle: "italic" }}>Brand · Lifestyle · Product</div>
            </div>
            <div style={{ width: "100%", borderRadius: 10, overflow: "hidden", background: "#0e0e0e", boxShadow: "0 24px 64px rgba(0,0,0,0.15)" }}>
              <video controls muted autoPlay loop playsInline style={{ display: "block", width: "100%", background: "#0e0e0e", borderRadius: 10 }}>
                <source src="https://res.cloudinary.com/dgcjboqtu/video/upload/v1780434560/cdee_drink_mp4_dtbcgl.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

          {/* Work preview */}
          <div style={{ padding: m ? "48px 20px" : "80px 48px", borderBottom: "1px solid #e0d8cc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Selected Work</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 32 : 42, fontWeight: 400 }}>Recent Projects</h2>
              </div>
              <button onClick={() => setView("portfolio")} style={{ fontSize: 13, color: "#1a1a1a", background: "none", border: "1px solid #1a1a1a", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>View All →</button>
            </div>
            {m ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                {[
                  { src: IMG2, idx: 1, pos: "center" },
                  { src: IMG1, idx: 0, pos: "center top" },
                  { src: IMG7, idx: 6, pos: "center top" },
                  { src: IMG3, idx: 2, pos: "center top" },
                ].map(item => (
                  <div key={item.idx} onClick={() => setLightbox(item.idx)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "1" }}>
                    <img src={item.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.pos }} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 3 }}>
                <div onClick={() => setLightbox(0)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", gridRow: "span 2", aspectRatio: "3/4" }}>
                  <img src={IMG1} alt="Studio editorial portrait photography" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 20px 20px", background: "linear-gradient(transparent, rgba(0,0,0,0.55))", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8, marginBottom: 4 }}>PORTRAIT</div>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 400 }}>Studio Editorial</div>
                  </div>
                </div>
                <div onClick={() => setLightbox(6)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                  <img src={IMG7} alt="Urban editorial photography" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>LIFESTYLE</div>
                  </div>
                </div>
                <div onClick={() => setLightbox(3)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                  <img src={IMG4} alt="Product photography" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>PRODUCT</div>
                  </div>
                </div>
                <div onClick={() => setLightbox(2)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                  <img src={IMG3} alt="Lifestyle photography" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>LIFESTYLE</div>
                  </div>
                </div>
                <div onClick={() => setLightbox(4)} style={{ position: "relative", overflow: "hidden", borderRadius: 4, cursor: "zoom-in", aspectRatio: "4/3" }}>
                  <img src={IMG5} alt="Product collection photography" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s" }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 16px 12px", background: "linear-gradient(transparent, rgba(0,0,0,0.5))", color: "#fff" }}>
                    <div style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", letterSpacing: 2, opacity: 0.8 }}>PRODUCT</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Services / Packages */}
          <div style={{ padding: m ? "48px 20px" : "80px 48px", borderBottom: "1px solid #e0d8cc", background: "#faf8f4" }}>
            <div style={{ textAlign: "center", marginBottom: m ? 36 : 56 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>What We Do</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 48, fontWeight: 400, marginBottom: 16 }}>Services & Packages</h2>
              <p style={{ fontSize: 16, color: "#888", maxWidth: 480, margin: "0 auto", fontWeight: 300, lineHeight: 1.6 }}>Every project is custom-quoted. Use our pricing tool for an instant estimate, or reach out directly.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(3, 1fr)", gap: m ? 12 : 20, marginBottom: 40 }}>
              {SERVICES.map((s, i) => (
                <div key={i} className="service-card" style={{ padding: m ? "20px 16px" : "28px 24px", border: "1px solid #e8e3dc", borderRadius: 10, background: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ fontSize: m ? 12 : 13, fontWeight: 600, color: "#1a1a1a", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>{s.title}</div>
                  <p style={{ fontSize: m ? 12 : 13, color: "#888", lineHeight: 1.6, flex: 1 }}>{s.desc}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid #f0ece6", flexWrap: "wrap", gap: 6 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#1a1a1a", fontWeight: 500 }}>{s.price}</span>
                    <button onClick={() => setView("wizard")} style={{ fontSize: 11, color: "#888", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", padding: 0 }}>Quote →</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={() => setView("wizard")} style={{ padding: "14px 36px", borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, marginRight: 12 }}>
                Get an Instant Quote →
              </button>
              <button onClick={goToContact} style={{ padding: "14px 28px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 14, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                Talk to Us
              </button>
            </div>
          </div>

          {/* Story section */}
          <div style={{ borderTop: "1px solid #e0d8cc" }}>
            <div style={{ width: "100%", aspectRatio: m ? "4/3" : "16/7", overflow: "hidden", position: "relative" }}>
              <img src={IMG1} alt="Professional photography session by 9th of August" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 60%, rgba(26,26,26,0.18))" }} />
            </div>
            <div style={{ background: "#1a1a1a", color: "#f5f0e8", padding: m ? "48px 24px" : "72px 48px", display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 32 : 64, alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 24 }}>Our Approach</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 64px)", fontWeight: 300, lineHeight: 1.05 }}>
                  Every frame<br />tells <em style={{ fontStyle: "italic" }}>your</em> story.
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "#aaa", lineHeight: 1.8, fontWeight: 300, marginBottom: 24 }}>
                  We don't just take photos — we study your brand, your audience, and the feeling you want to leave behind. The result is imagery that resonates long after the shoot ends.
                </p>
                <p style={{ fontSize: 16, color: "#777", lineHeight: 1.8, fontWeight: 300, marginBottom: 36 }}>
                  From intimate portrait sessions to full brand campaigns and music video productions, our creative team brings the same level of intention to every project — nationwide.
                </p>
                <button onClick={goToContact} style={{ padding: "14px 28px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6, background: "transparent", color: "#f5f0e8", fontSize: 13, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                  Start Your Project →
                </button>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4, 1fr)", borderTop: "1px solid #e0d8cc", borderBottom: "1px solid #e0d8cc" }}>
            {[["4,000+","Shoots Completed"],["50","States Covered"],["500+","Vetted Creators"],["4.9 ★","Avg Rating"]].map(([num, label], i) => (
              <div key={i} style={{ padding: m ? "28px 16px" : "40px 24px", textAlign: "center", borderRight: m ? (i % 2 === 0 ? "1px solid #e0d8cc" : "none") : (i < 3 ? "1px solid #e0d8cc" : "none"), borderBottom: m && i < 2 ? "1px solid #e0d8cc" : "none" }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 32 : 40, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{num}</div>
                <div style={{ fontSize: 10, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div style={{ padding: m ? "48px 20px" : "80px 48px", background: "#f8f6f2", borderBottom: "1px solid #e0d8cc" }}>
            <div style={{ textAlign: "center", marginBottom: m ? 36 : 56 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>Client Stories</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 48, fontWeight: 400 }}>What our clients say</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3, 1fr)", gap: m ? 16 : 20 }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} style={{ background: "#fff", border: "1px solid #e8e3dc", borderRadius: 10, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ color: "#c8a060", fontSize: 14, letterSpacing: 2 }}>★★★★★</div>
                  <p style={{ fontSize: 15, color: "#444", lineHeight: 1.75, fontStyle: "italic", flex: 1 }}>"{t.quote}"</p>
                  <div style={{ borderTop: "1px solid #f0ece6", paddingTop: 16 }}>
                    <div style={{ fontWeight: 500, fontSize: 14, color: "#1a1a1a" }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#999", fontFamily: "'DM Mono', monospace", marginTop: 3 }}>
                      {t.role}{t.company ? ` · ${t.company}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ padding: m ? "64px 24px" : "100px 48px", textAlign: "center", background: "#f5f0e8" }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 24 }}>Ready when you are</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300, marginBottom: 20, lineHeight: 1.1 }}>
              Let's make something<br /><em style={{ fontStyle: "italic", fontWeight: 600 }}>worth remembering.</em>
            </h2>
            <p style={{ fontSize: 17, color: "#888", marginBottom: 48, fontWeight: 300 }}>Professional video production and commercial photography. Get a custom quote in minutes.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setView("wizard")} style={{ padding: "18px 48px", border: "none", borderRadius: 6, background: "#1a1a1a", color: "#f5f0e8", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>
                Get an Instant Quote →
              </button>
              <button onClick={goToContact} style={{ padding: "18px 36px", border: "1px solid #1a1a1a", borderRadius: 6, background: "transparent", color: "#1a1a1a", fontSize: 15, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
                Contact Us
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div ref={contactRef} id="contact" style={{ padding: m ? "48px 20px" : "80px 48px", background: "#1a1a1a", color: "#f5f0e8" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1.3fr", gap: m ? 48 : 80 }}>

              {/* Left: info */}
              <div>
                <div style={{ fontSize: 11, letterSpacing: 3, color: "#888", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>Get in Touch</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 40 : 56, fontWeight: 300, lineHeight: 1.1, marginBottom: 24 }}>
                  Start your<br /><em style={{ fontStyle: "italic", fontWeight: 600 }}>project.</em>
                </h2>
                <p style={{ fontSize: 15, color: "#aaa", lineHeight: 1.7, marginBottom: 44, maxWidth: 360 }}>
                  Tell us about your vision and we'll get back to you within 24 hours with a custom approach and quote.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  {[
                    { icon: "☏", label: "Phone", value: CONTACT_PHONE, href: `tel:${CONTACT_PHONE.replace(/\D/g,"")}` },
                    { icon: "✉", label: "Email", value: CONTACT_EMAIL_DISPLAY, href: `mailto:${CONTACT_EMAIL_DISPLAY}` },
                    { icon: "◎", label: "Based in", value: CONTACT_LOCATION, sub: "Available nationwide" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f0e8", fontSize: 18, flexShrink: 0 }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: 10, color: "#666", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} style={{ fontSize: 15, color: "#f5f0e8", textDecoration: "none", fontWeight: 500 }}>{item.value}</a>
                        ) : (
                          <div style={{ fontSize: 15, color: "#f5f0e8", fontWeight: 500 }}>{item.value}</div>
                        )}
                        {item.sub && <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div>
                {contactSent ? (
                  <div style={{ textAlign: "center", padding: "64px 32px", background: "rgba(255,255,255,0.05)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ width: 56, height: 56, borderRadius: 12, background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 24 }}>✓</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, marginBottom: 12 }}>Message sent!</h3>
                    <p style={{ color: "#888", fontSize: 15 }}>We'll be in touch within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={submitContact} style={{ background: "#fff", borderRadius: 12, padding: m ? "28px 20px" : "36px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Name *</label>
                        <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Your name" style={{ width: "100%", padding: "14px 16px", border: "1px solid #e0d8cc", borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", background: "#fafaf8" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Email *</label>
                        <input type="email" required value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="you@company.com" style={{ width: "100%", padding: "14px 16px", border: "1px solid #e0d8cc", borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", background: "#fafaf8" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: 14 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Phone</label>
                        <input type="tel" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="(000) 000-0000" style={{ width: "100%", padding: "14px 16px", border: "1px solid #e0d8cc", borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", background: "#fafaf8" }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Project Type</label>
                        <select value={contactProjectType} onChange={e => setContactProjectType(e.target.value)} style={{ width: "100%", padding: "14px 16px", border: "1px solid #e0d8cc", borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: contactProjectType ? "#1a1a1a" : "#aaa", background: "#fafaf8" }}>
                          <option value="">Select type...</option>
                          <option>Brand Campaign</option>
                          <option>Music Video</option>
                          <option>Product Photography</option>
                          <option>Portrait Session</option>
                          <option>Event Coverage</option>
                          <option>Wedding</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 1, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Tell us about your project *</label>
                      <textarea required value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Share your vision, timeline, and any other details..." rows={5} style={{ width: "100%", padding: "14px 16px", border: "1px solid #e0d8cc", borderRadius: 6, fontSize: 14, outline: "none", fontFamily: "'DM Sans', sans-serif", color: "#1a1a1a", background: "#fafaf8", resize: "vertical", lineHeight: 1.6 }} />
                    </div>
                    {contactError && (
                      <div style={{ padding: "12px 16px", background: "#fff8f0", border: "1px solid #f0d8b0", borderRadius: 8, fontSize: 13, color: "#996600", fontFamily: "'DM Mono', monospace" }}>
                        {contactError}
                      </div>
                    )}
                    <button type="submit" disabled={contactSending} style={{ width: "100%", padding: 16, borderRadius: 6, border: "none", background: contactSending ? "#888" : "#1a1a1a", color: "#f5f0e8", fontSize: 14, fontWeight: 600, cursor: contactSending ? "not-allowed" : "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, transition: "background 0.2s" }}>
                      {contactSending ? "Sending..." : "Send Message →"}
                    </button>
                    <p style={{ fontSize: 11, color: "#aaa", textAlign: "center", fontFamily: "'DM Mono', monospace" }}>We respond within 24 hours · No commitment required</p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PORTFOLIO ── */}
      {view === "portfolio" && (
        <div className="fade-in" style={{ padding: m ? "40px 16px" : "60px 48px" }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: 3, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 16 }}>Portfolio</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 40 : 52, fontWeight: 400, marginBottom: 8 }}>Selected Work</h2>
            <p style={{ fontSize: 15, color: "#888", marginBottom: 32, fontWeight: 300 }}>Commercial photography and video production by 9th of August.</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "8px 18px", borderRadius: 20, border: "1px solid", borderColor: activeCategory === cat ? "#1a1a1a" : "#ddd", background: activeCategory === cat ? "#1a1a1a" : "transparent", color: activeCategory === cat ? "#f5f0e8" : "#666", fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{cat}</button>
              ))}
            </div>
          </div>
          <div style={{ columns: m ? 2 : "3 280px", gap: 6 }}>
            {filtered.map((photo) => (
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
          <div style={{ textAlign: "center", marginTop: 64, padding: "48px 24px", background: "#f8f6f2", borderRadius: 12, border: "1px solid #e8e3dc" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 28 : 36, marginBottom: 12 }}>Ready to create something like this?</h3>
            <p style={{ color: "#888", marginBottom: 28, fontWeight: 300 }}>Get a custom quote in minutes — we'll calculate everything including travel to your location.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => setView("wizard")} style={{ padding: "14px 32px", borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>Get a Custom Quote →</button>
              <button onClick={goToContact} style={{ padding: "14px 28px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 14, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>Contact Us</button>
            </div>
          </div>
        </div>
      )}

      {/* ── WIZARD ── */}
      {view === "wizard" && (
        <div className="fade-in" style={{ maxWidth: 600, margin: "0 auto", padding: m ? "40px 16px" : "60px 24px" }}>

          {step < 3 && (
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= step ? "#1a1a1a" : "#ddd", transition: "background 0.3s" }} />
                ))}
              </div>
              <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Mono', monospace" }}>
                Step {step + 1} of 3 — {["Shoot Details", "Duration", "Location & Contact"][step]}
              </div>
            </div>
          )}

          {step === 0 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 42, marginBottom: 8 }}>What are you creating?</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>Tell us about the project and we'll build a custom quote.</p>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Type of shoot</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {SHOOT_TYPES.map(t => (
                    <button key={t} onClick={() => setShootType(t)} style={{ padding: "10px 18px", borderRadius: 6, border: "1px solid", borderColor: shootType === t ? "#1a1a1a" : "#ddd", background: shootType === t ? "#1a1a1a" : "#fff", color: shootType === t ? "#f5f0e8" : "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{t}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12 }}>Services needed</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {MEDIA_TYPES.map(me => (
                    <button key={me} onClick={() => setMediaType(me)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid", borderColor: mediaType === me ? "#1a1a1a" : "#ddd", background: mediaType === me ? "#1a1a1a" : "#fff", color: mediaType === me ? "#f5f0e8" : "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Mono', monospace", transition: "all 0.15s" }}>{me}</button>
                  ))}
                </div>
              </div>
              <button disabled={!shootType || !mediaType} onClick={() => setStep(1)} style={{ width: "100%", padding: 16, borderRadius: 6, border: "none", background: (shootType && mediaType) ? "#1a1a1a" : "#e8e3dc", color: (shootType && mediaType) ? "#f5f0e8" : "#aaa", fontSize: 14, fontWeight: 600, cursor: (shootType && mediaType) ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", transition: "all 0.2s" }}>Continue →</button>
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 42, marginBottom: 8 }}>How long do you need us?</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>Select the coverage that fits your project.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
                {DURATIONS.map(d => (
                  <button key={d.label} onClick={() => setDuration(d.label)} style={{ padding: "18px 20px", borderRadius: 8, border: "1px solid", borderColor: duration === d.label ? "#1a1a1a" : "#e8e3dc", background: duration === d.label ? "#1a1a1a" : "#fff", color: duration === d.label ? "#f5f0e8" : "#1a1a1a", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500 }}>{d.label}</div>
                      <div style={{ fontSize: 12, opacity: 0.55, marginTop: 3 }}>{d.desc}</div>
                    </div>
                    {duration === d.label && <span>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(0)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#666", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>← Back</button>
                <button disabled={!duration} onClick={() => setStep(2)} style={{ flex: 2, padding: 14, borderRadius: 6, border: "none", background: duration ? "#1a1a1a" : "#e8e3dc", color: duration ? "#f5f0e8" : "#aaa", cursor: duration ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 36 : 42, marginBottom: 8 }}>Almost there.</h2>
              <p style={{ color: "#888", marginBottom: 36, fontWeight: 300 }}>We'll calculate travel from our Frisco, TX base and send you the full breakdown.</p>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>Shoot location</div>
                <input type="text" placeholder="City, State (e.g. Nashville, TN)" value={clientCity} onChange={e => setClientCity(e.target.value)} style={{ width: "100%", padding: "16px 18px", border: "1px solid #ddd", borderRadius: 6, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "#fff", color: "#1a1a1a" }} />
              </div>
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 11, letterSpacing: 2, color: "#999", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 10 }}>Your email</div>
                <input type="email" placeholder="you@example.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={{ width: "100%", padding: "16px 18px", border: "1px solid #ddd", borderRadius: 6, fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", background: "#fff", color: "#1a1a1a" }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#666", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>← Back</button>
                <button disabled={!clientCity || !clientEmail} onClick={getQuote} style={{ flex: 2, padding: 14, borderRadius: 6, border: "none", background: (clientCity && clientEmail) ? "#1a1a1a" : "#e8e3dc", color: (clientCity && clientEmail) ? "#f5f0e8" : "#aaa", cursor: (clientCity && clientEmail) ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>✦ Get My Quote</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              {quoting ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 22, color: "#f5f0e8" }}>◈</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, marginBottom: 12 }}>Building your quote</h3>
                  <p style={{ color: "#aaa", marginBottom: 24, fontWeight: 300 }}>Calculating creative fees and travel from Frisco, TX…</p>
                  <LoadingDots />
                </div>
              ) : quote && !quote.error ? (
                <div className="fade-in">
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 14px", borderRadius: 20, background: "#f0faf0", border: "1px solid #c0dcc0", color: "#4a8a4a", fontSize: 11, fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>✓ Quote Ready</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: m ? 44 : 56, fontWeight: 300, color: "#1a1a1a", lineHeight: 1, marginBottom: 6 }}>
                    ${quote.totalMin?.toLocaleString()} – ${quote.totalMax?.toLocaleString()}
                  </div>
                  <div style={{ color: "#aaa", fontSize: 12, fontFamily: "'DM Mono', monospace", marginBottom: 36 }}>estimated total · {shootType} · {duration}</div>
                  <div style={{ background: "#fff", border: "1px solid #e8e3dc", borderRadius: 10, padding: "6px 24px", marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #f0ece6" }}>
                      <span style={{ fontSize: 14, color: "#666" }}>Creative fee</span>
                      <span style={{ fontSize: 14, fontFamily: "'DM Mono', monospace" }}>${quote.creativeFeeMin?.toLocaleString()} – ${quote.creativeFeeMax?.toLocaleString()}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0" }}>
                      <span style={{ fontSize: 14, color: "#666" }}>Travel ({clientCity})</span>
                      <span style={{ fontSize: 14, fontFamily: "'DM Mono', monospace", color: quote.travelFreeZone ? "#4a8a4a" : "#1a1a1a" }}>
                        {quote.travelFreeZone ? "No charge ✓" : `$${quote.travelFee?.toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                  {quote.travelNote && (
                    <div style={{ padding: "13px 16px", background: "#f8f6f2", borderRadius: 8, fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.65 }}>
                      {quote.travelNote}
                    </div>
                  )}
                  {quote.turnaround && (
                    <div style={{ fontSize: 12, color: "#aaa", fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>
                      Delivery: {quote.turnaround}
                    </div>
                  )}
                  {quote.emailSent ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", background: "#f0faf0", border: "1px solid #c0dcc0", borderRadius: 8, fontSize: 12, color: "#4a8a4a", fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>
                      ✓ Full breakdown sent to {clientEmail}
                    </div>
                  ) : (
                    <div style={{ padding: "12px 16px", background: "#fff8f0", border: "1px solid #f0d8b0", borderRadius: 8, fontSize: 12, color: "#996600", fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>
                      Email not sent{quote.emailError ? `: ${quote.emailError}` : " — check your RESEND_API_KEY env var"}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    <button onClick={goToContact} style={{ flex: 1, padding: 14, borderRadius: 6, border: "none", background: "#1a1a1a", color: "#f5f0e8", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 600 }}>Book This Project →</button>
                  </div>
                  <button onClick={resetQuote} style={{ width: "100%", padding: 14, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#888", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>← Start Over</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <p style={{ color: "#888", marginBottom: 20 }}>Something went wrong. Please try again.</p>
                  <button onClick={() => setStep(2)} style={{ padding: "12px 24px", borderRadius: 6, border: "1px solid #ddd", background: "#fff", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>← Go Back</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e0d8cc", padding: m ? "40px 20px" : "56px 48px", background: "#f5f0e8" }}>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr 1fr", gap: m ? 32 : 48, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5f0e8", fontSize: 14 }}>◈</div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600 }}>9th of August</span>
            </div>
            <p style={{ fontSize: 13, color: "#888", lineHeight: 1.7, maxWidth: 260 }}>Professional video production agency and commercial photography studio based in Frisco, TX.</p>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Services</div>
            {["Brand Campaigns", "Music Videos", "Product Photography", "Portrait Sessions", "Event Coverage", "Weddings"].map(s => (
              <button key={s} onClick={() => setView("wizard")} style={{ display: "block", fontSize: 13, color: "#666", background: "none", border: "none", cursor: "pointer", padding: "4px 0", textAlign: "left", lineHeight: 1.6 }}>{s}</button>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#999", fontFamily: "'DM Mono', monospace", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`tel:${CONTACT_PHONE.replace(/\D/g,"")}`} style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>{CONTACT_PHONE}</a>
              <a href={`mailto:${CONTACT_EMAIL_DISPLAY}`} style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>{CONTACT_EMAIL_DISPLAY}</a>
              <span style={{ fontSize: 13, color: "#888" }}>{CONTACT_LOCATION}</span>
              <button onClick={goToContact} style={{ marginTop: 8, padding: "10px 20px", borderRadius: 6, border: "1px solid #1a1a1a", background: "transparent", color: "#1a1a1a", fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace", textAlign: "center" }}>Send a Message →</button>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #e0d8cc", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>© 2026 9th of August · Video Production & Commercial Photography · Frisco, TX</div>
          <div style={{ fontSize: 11, color: "#aaa", fontFamily: "'DM Mono', monospace" }}>Available Nationwide</div>
        </div>
      </footer>
    </div>
  );
}
