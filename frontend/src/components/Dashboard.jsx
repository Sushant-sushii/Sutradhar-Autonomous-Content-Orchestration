import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Dashboard Styles
───────────────────────────────────────────── */
const S = {
  root: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: '#05050f',
    color: '#e8e8f0',
    minHeight: '100vh',
    display: 'flex',
    overflow: 'hidden',
  },
  
  /* ── SIDEBAR ── */
  sidebar: {
    width: 280,
    background: 'rgba(10,10,25,0.7)',
    borderRight: '1px solid rgba(120,80,255,0.15)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    flexDirection: 'column',
    padding: '1.5rem',
    position: 'relative',
    zIndex: 10,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '3rem',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg,#7b5cff,#00d4ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 16,
    color: '#fff',
    boxShadow: '0 0 15px rgba(123,92,255,0.5)',
  },
  logoText: {
    fontWeight: 800,
    fontSize: '1.2rem',
    background: 'linear-gradient(90deg,#a78bff,#38cfff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.3px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem 1rem',
    borderRadius: 12,
    marginBottom: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: 600,
    fontSize: '0.95rem',
  },
  navIcon: { fontSize: '1.2rem' },
  userProfile: {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '1rem',
    borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(120,80,255,0.1)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg,#ff7eb3,#7b5cff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '1rem',
    color: '#fff',
  },
  
  /* ── MAIN CONTENT ── */
  main: {
    flex: 1,
    overflowY: 'auto',
    position: 'relative',
    padding: '2rem 3rem',
    display: 'flex',
    flexDirection: 'column',
  },
  bgGlow1: {
    position: 'absolute', top: '-10%', left: '20%',
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(123,92,255,0.12) 0%, transparent 60%)',
    filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0,
  },
  bgGlow2: {
    position: 'absolute', bottom: '-10%', right: '10%',
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,198,255,0.08) 0%, transparent 60%)',
    filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
  },

  /* ── HEADER ── */
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '2.5rem',
    zIndex: 1,
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 900,
    letterSpacing: '-1px',
    marginBottom: '0.3rem',
  },
  subTitle: {
    color: '#8888aa',
    fontSize: '1.05rem',
  },
  
  /* ── FORM LAYOUT ── */
  formContainer: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
    gap: '2rem',
    zIndex: 1,
    maxWidth: 1300,
  },
  panel: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(120,80,255,0.15)',
    borderRadius: 24,
    padding: '2rem',
    backdropFilter: 'blur(12px)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
  },
  
  /* ── INPUTS ── */
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  label: { 
    fontSize: '0.95rem', document: 700, color: '#b0b0cc', 
    display: 'flex', alignItems: 'center', gap: '0.5rem' 
  },
  required: { color: '#ff4d4d', marginLeft: '0.2rem' },
  textarea: {
    width: '100%',
    minHeight: 120,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(120,80,255,0.3)',
    borderRadius: 16,
    padding: '1rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  inputLine: {
    width: '100%',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(120,80,255,0.3)',
    borderTop: 'none', borderLeft: 'none', borderRight: 'none',
    borderBottomWidth: '2px',
    padding: '0.8rem 1rem',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  
  /* ── SELECTIONS ── */
  gridSelect: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '1rem',
  },
  cardOptionBox: {
    border: '1px solid rgba(120,80,255,0.2)',
    borderRadius: 14,
    padding: '1rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s',
    background: 'rgba(255,255,255,0.01)',
  },
  pillBox: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
  },
  pill: {
    padding: '0.5rem 1.2rem',
    borderRadius: 999,
    border: '1px solid rgba(120,80,255,0.3)',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  
  /* ── ACTION BUTTON ── */
  generateBtn: {
    marginTop: '1rem',
    width: '100%',
    padding: '1.2rem',
    borderRadius: 16,
    border: 'none',
    background: 'linear-gradient(135deg,#7b5cff,#00c6ff)',
    color: '#fff',
    fontSize: '1.1rem',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 0 30px rgba(123,92,255,0.4)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
  },

  /* ── LOADER ── */
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(5,5,15,0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
};

const FORMATS = [
  { id: 'blog', icon: '📝', label: 'Blog Post' },
  { id: 'social', icon: '📱', label: 'Social Thread' },
  { id: 'newsletter', icon: '📧', label: 'Newsletter' },
  { id: 'video', icon: '🎬', label: 'Video Script' },
];

const TONES = ['Professional', 'Casual', 'Witty', 'Persuasive', 'Empathetic', 'Urgent'];

export default function Dashboard() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('blog');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('');
  
  const [isHoverBtn, setIsHoverBtn] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingText, setLoadingText] = useState('Initializing AI Agents...');

  // Focus simulation
  const inputFocusStyle = { borderColor: '#00d4ff', boxShadow: '0 0 10px rgba(0,212,255,0.2)' };

  const handleGenerate = () => {
    if (!topic.trim()) {
      alert("Please provide a topic or prompt.");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate complex pipeline loading sequence
    const sequences = [
        "Analyzing topic semantics...",
        "Identifying target audience persona...",
        "Retrieving knowledge context...",
        "Drafting initial outlines...",
        "Applying brand voice...",
        "Validating structure..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
        if(i < sequences.length) {
            setLoadingText(sequences[i]);
            i++;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                // Navigate to pipeline or result view after generation
                navigate('/pipeline');
            }, 800);
        }
    }, 600);
  };

  return (
    <div style={S.root}>
      {/* GLOBAL STYLES FOR ANIMATIONS AND FOCUS */}
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(123,92,255,0.4); border-radius: 4px; }
        
        .nav-item:hover {
            background: rgba(123,92,255,0.15);
            color: #fff;
        }
        .nav-active {
            background: linear-gradient(90deg, rgba(123,92,255,0.2), transparent);
            border-left: 3px solid #7b5cff;
            color: #fff;
        }
        
        .format-card:hover {
            border-color: #7b5cff !important;
            transform: translateY(-2px);
        }
        .tone-pill:hover {
            border-color: #00c6ff !important;
            background: rgba(0,198,255,0.1);
        }
        
        /* Loading Animations */
        @keyframes pulseOrb {
            0% { transform: scale(0.9); opacity: 0.6; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.9); opacity: 0.6; }
        }
        .loader-orb {
            width: 80px; height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #7b5cff, #00c6ff);
            box-shadow: 0 0 40px rgba(123,92,255,0.8);
            animation: pulseOrb 1.5s ease-in-out infinite;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
        }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={S.sidebar}>
        <div style={S.brand} onClick={() => navigate('/')}>
          <div style={S.logoMark}>S</div>
          <span style={S.logoText}>Sutradhar</span>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{...S.navItem, color: '#8888aa', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem'}}>Workspace</div>
            
            <div className="nav-item nav-active" style={{...S.navItem, color: '#e8e8f0'}}>
                <span style={S.navIcon}>✨</span> New Generation
            </div>
            <div className="nav-item" style={{...S.navItem, color: '#8888aa'}} onClick={() => navigate('/pipeline')}>
                <span style={S.navIcon}>🔄</span> Active Pipelines
            </div>
            <div className="nav-item" style={{...S.navItem, color: '#8888aa'}}>
                <span style={S.navIcon}>📁</span> Asset Library
            </div>
            <div className="nav-item" style={{...S.navItem, color: '#8888aa'}}>
                <span style={S.navIcon}>📊</span> Performance
            </div>
        </div>
        
        <div style={S.userProfile}>
            <div style={S.avatar}>AD</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>Admin User</span>
                <span style={{ fontSize: '0.75rem', color: '#8888aa' }}>Pro Plan</span>
            </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={S.main}>
        {/* Background glows */}
        <div style={S.bgGlow1} />
        <div style={S.bgGlow2} />
        
        <div className="fade-in-up" style={S.header}>
            <div>
                <h1 style={S.title}>Create Magic ✨</h1>
                <p style={S.subTitle}>Define your requirements. Our AI agents will handle the rest.</p>
            </div>
        </div>

        <div className="fade-in-up" style={{ ...S.formContainer, animationDelay: '0.1s' }}>
            {/* LEFT PANEL: Core inputs */}
            <div style={S.panel}>
                
                <div style={S.inputGroup}>
                    <label style={S.label}>
                        <span style={{ fontSize: '1.2rem' }}>🎯</span> What do you want to create? <span style={S.required}>*</span>
                    </label>
                    <textarea 
                        style={S.textarea}
                        placeholder="E.g., A comprehensive blog post about the impact of Artificial Intelligence on modern content marketing, focusing on autonomous orchestrators..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(120,80,255,0.3)', boxShadow: 'none' })}
                    />
                </div>

                <div style={S.inputGroup}>
                    <label style={{...S.label, marginTop: '0.5rem'}}>
                        <span style={{ fontSize: '1.2rem' }}>🎨</span> Select Format
                    </label>
                    <div style={S.gridSelect}>
                        {FORMATS.map(f => {
                            const active = format === f.id;
                            return (
                                <div 
                                    key={f.id} 
                                    className="format-card"
                                    onClick={() => setFormat(f.id)}
                                    style={{
                                        ...S.cardOptionBox,
                                        borderColor: active ? '#7b5cff' : 'rgba(120,80,255,0.2)',
                                        background: active ? 'rgba(123,92,255,0.1)' : 'rgba(255,255,255,0.01)',
                                        boxShadow: active ? '0 0 15px rgba(123,92,255,0.3)' : 'none',
                                    }}
                                >
                                    <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{f.icon}</div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: active ? '#fff' : '#b0b0cc' }}>{f.label}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                
                <div style={S.inputGroup}>
                    <label style={{...S.label, marginTop: '0.5rem'}}>
                        <span style={{ fontSize: '1.2rem' }}>🗣️</span> Tone of Voice
                    </label>
                    <div style={S.pillBox}>
                        {TONES.map(t => {
                            const active = tone === t;
                            return (
                                <div 
                                    key={t}
                                    className="tone-pill"
                                    onClick={() => setTone(t)}
                                    style={{
                                        ...S.pill,
                                        background: active ? 'linear-gradient(135deg,#7b5cff,#00c6ff)' : 'transparent',
                                        color: active ? '#fff' : '#b0b0cc',
                                        borderColor: active ? 'transparent' : 'rgba(120,80,255,0.3)',
                                        boxShadow: active ? '0 0 10px rgba(123,92,255,0.4)' : 'none'
                                    }}
                                >
                                    {t}
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* RIGHT PANEL: Additional configs & Action */}
            <div style={S.panel}>
                
                <div style={S.inputGroup}>
                    <label style={S.label}>👥 Target Audience</label>
                    <input 
                        type="text" 
                        style={S.inputLine} 
                        placeholder="E.g., Marketing Managers, Gen-Z Founders"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(120,80,255,0.3)', boxShadow: 'none' })}
                    />
                </div>
                <div style={S.inputGroup}>
                    <label style={{...S.label, marginTop: '1rem'}}>🔑 SEO Keywords <span style={{fontSize: '0.75rem', color: '#6666aa', fontWeight: 400}}>(Optional)</span></label>
                    <input 
                        type="text" 
                        style={S.inputLine} 
                        placeholder="Comma separated"
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(120,80,255,0.3)', boxShadow: 'none' })}
                    />
                </div>
                <div style={S.inputGroup}>
                    <label style={{...S.label, marginTop: '1rem'}}>📚 Reference Links <span style={{fontSize: '0.75rem', color: '#6666aa', fontWeight: 400}}>(Optional)</span></label>
                    <input 
                        type="text" 
                        style={S.inputLine} 
                        placeholder="URLs to learn from"
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: 'rgba(120,80,255,0.3)', boxShadow: 'none' })}
                    />
                </div>

                {/* Sticky bottom CTA in right panel */}
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <div style={{ fontSize: '0.8rem', color: '#8888aa', marginBottom: '0.8rem', textAlign: 'center' }}>
                        Estimated Completion Time: <span style={{ color: '#00d4ff', fontWeight: 700 }}>~45 seconds</span>
                    </div>
                    <button 
                        style={{
                            ...S.generateBtn,
                            transform: isHoverBtn ? 'scale(1.03)' : 'scale(1)',
                            boxShadow: isHoverBtn ? '0 0 40px rgba(123,92,255,0.6)' : S.generateBtn.boxShadow
                        }}
                        onMouseEnter={() => setIsHoverBtn(true)}
                        onMouseLeave={() => setIsHoverBtn(false)}
                        onClick={handleGenerate}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Initializing...' : '🚀 Generate Content'}
                    </button>
                </div>
            </div>
        </div>
      </main>

      {/* ── LOADING OVERLAY ── */}
      {isGenerating && (
        <div style={S.loaderOverlay}>
            <div className="loader-orb">🧠</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', background: 'linear-gradient(90deg,#a78bff,#38cfff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Orchestrating Pipeline
            </h2>
            <p style={{ color: '#b0b0cc', fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                {loadingText}
            </p>
            
            {/* Progress line */}
            <div style={{ width: 300, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: '2rem', overflow: 'hidden' }}>
                <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(90deg,#7b5cff,#00c6ff)', 
                    width: '50%',
                    animation: 'progressAnim 2s infinite ease-in-out alternate'
                }} />
            </div>
            <style>{`
                @keyframes progressAnim {
                    0% { transform: translateX(-100%); width: 30%; }
                    100% { transform: translateX(300%); width: 80%; }
                }
            `}</style>
        </div>
      )}
    </div>
  );
}
