import { useEffect, useState } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ---------- custom animated node ---------- */
function ThreadNode({ data }) {
  return (
    <div
      style={{
        width: data.size,
        height: data.size,
        borderRadius: '50%',
        background: data.gradient,
        boxShadow: `0 0 ${data.glow}px ${data.glowColor}`,
        opacity: data.opacity,
        transition: 'opacity 0.5s',
        cursor: 'default',
      }}
    >
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type="target" position={Position.Left} style={{ visibility: 'hidden' }} />
    </div>
  );
}

const nodeTypes = { thread: ThreadNode };

/* ---------- helpers ---------- */
const W = typeof window !== 'undefined' ? window.innerWidth : 1400;
const H = typeof window !== 'undefined' ? window.innerHeight : 900;

const PALETTES = [
  { gradient: 'radial-gradient(circle,#a78bfa,#7c3aed)', glow: 20, glowColor: '#7c3aed' },
  { gradient: 'radial-gradient(circle,#67e8f9,#0891b2)', glow: 18, glowColor: '#0891b2' },
  { gradient: 'radial-gradient(circle,#f9a8d4,#db2777)', glow: 16, glowColor: '#db2777' },
  { gradient: 'radial-gradient(circle,#86efac,#16a34a)', glow: 14, glowColor: '#16a34a' },
  { gradient: 'radial-gradient(circle,#fde68a,#d97706)', glow: 15, glowColor: '#d97706' },
];

function rnd(min, max) { return Math.random() * (max - min) + min; }

function makeNodes(count = 28) {
  return Array.from({ length: count }, (_, i) => {
    const pal = PALETTES[i % PALETTES.length];
    return {
      id: `n${i}`,
      type: 'thread',
      position: { x: rnd(0, W), y: rnd(0, H) },
      data: {
        ...pal,
        size: rnd(10, 30),
        opacity: rnd(0.3, 0.9),
        vx: rnd(-0.4, 0.4),
        vy: rnd(-0.4, 0.4),
      },
      draggable: false,
      selectable: false,
    };
  });
}

function makeEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    const targets = [
      nodes[(i + 1) % nodes.length],
      nodes[(i + 3) % nodes.length],
      nodes[(i + 6) % nodes.length],
    ];
    targets.forEach((t, idx) => {
      edges.push({
        id: `e${i}-${idx}`,
        source: nodes[i].id,
        target: t.id,
        animated: true,
        style: { stroke: '#a78bfa', strokeWidth: 1, opacity: 0.25 },
        markerEnd: { type: MarkerType.None },
      });
    });
  }
  return edges;
}

const initialNodes = makeNodes(28);
const initialEdges = makeEdges(initialNodes);

/* ---------- Login component ---------- */
export default function Login() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState(null);

  /* slowly drift the nodes around */
  useEffect(() => {
    const id = setInterval(() => {
      setNodes(prev =>
        prev.map(n => {
          let { x, y } = n.position;
          let { vx, vy } = n.data;
          x += vx;
          y += vy;
          if (x < 0 || x > W) vx = -vx;
          if (y < 0 || y > H) vy = -vy;
          return { ...n, position: { x, y }, data: { ...n.data, vx, vy } };
        })
      );
    }, 30);
    return () => clearInterval(id);
  }, [setNodes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Google Font ── */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── React Flow background ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          preventScrolling={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          fitView
        >
          <Background color="#1e1b4b" variant="none" />
        </ReactFlow>
      </div>

      {/* ── dark overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg,rgba(9,9,37,0.88) 0%,rgba(15,5,50,0.82) 100%)',
        backdropFilter: 'blur(2px)',
      }} />

      {/* ── login card ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 'min(420px,90vw)',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(167,139,250,0.25)',
          padding: '44px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'cardIn 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* logo / brand */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 56, height: 56, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
              boxShadow: '0 0 30px rgba(124,58,237,0.6)',
              marginBottom: 16,
              animation: 'pulse 2.5s ease-in-out infinite',
            }}>
              <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 style={{
              margin: 0, fontSize: '1.7rem', fontWeight: 700, letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg,#a78bfa,#67e8f9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Sutradhar</h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(200,200,255,0.6)', fontSize: '0.85rem', fontWeight: 300 }}>
              Autonomous Content Orchestration
            </p>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* email */}
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField(null)}
                placeholder="you@example.com"
                style={inputStyle(focusField === 'email')}
              />
              <div style={inputIconStyle}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* password */}
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'} value={password} required
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                style={inputStyle(focusField === 'password')}
              />
              <div style={inputIconStyle}>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <button type="button" onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                  color: 'rgba(167,139,250,0.7)',
                }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* forgot */}
            <div style={{ textAlign: 'right', marginTop: -8 }}>
              <a href="#" style={{ fontSize: '0.8rem', color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </a>
            </div>

            {/* submit */}
            <button type="submit" disabled={loading} style={{
              marginTop: 4, padding: '14px',
              background: loading
                ? 'rgba(124,58,237,0.4)'
                : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff', fontWeight: 600, fontSize: '0.97rem', letterSpacing: '0.3px',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.55)',
              transition: 'all 0.3s',
              position: 'relative', overflow: 'hidden',
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>

          </form>

          {/* sign up link */}
          <p style={{ marginTop: 28, textAlign: 'center', color: 'rgba(200,200,255,0.5)', fontSize: '0.85rem' }}>
            Don't have an account?{' '}
            <a href="/signup" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 30px rgba(124,58,237,0.6); }
          50%      { box-shadow: 0 0 50px rgba(124,58,237,0.9); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/* ---------- shared inline styles ---------- */
const labelStyle = {
  display: 'block', marginBottom: 7,
  color: 'rgba(200,200,255,0.7)', fontSize: '0.82rem', fontWeight: 500, letterSpacing: '0.3px',
};

function inputStyle(focused) {
  return {
    width: '100%', padding: '12px 12px 12px 40px',
    background: focused ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.05)',
    border: `1px solid ${focused ? 'rgba(167,139,250,0.65)' : 'rgba(167,139,250,0.2)'}`,
    borderRadius: 10, color: '#e2e8f0', fontSize: '0.92rem', outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused ? '0 0 0 3px rgba(124,58,237,0.18)' : 'none',
    transition: 'all 0.2s',
  };
}

const inputIconStyle = {
  position: 'absolute', left: 12, top: '50%',
  transform: 'translateY(-50%)', marginTop: 10, pointerEvents: 'none',
};
