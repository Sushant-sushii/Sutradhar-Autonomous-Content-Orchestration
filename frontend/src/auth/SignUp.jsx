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

/* ---------- thread node (same as Login) ---------- */
function ThreadNode({ data }) {
  return (
    <div style={{
      width: data.size, height: data.size, borderRadius: '50%',
      background: data.gradient,
      boxShadow: `0 0 ${data.glow}px ${data.glowColor}`,
      opacity: data.opacity, cursor: 'default',
    }}>
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
      <Handle type="target" position={Position.Left}  style={{ visibility: 'hidden' }} />
    </div>
  );
}

const nodeTypes = { thread: ThreadNode };

const W = typeof window !== 'undefined' ? window.innerWidth  : 1400;
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
      id: `sn${i}`, type: 'thread',
      position: { x: rnd(0, W), y: rnd(0, H) },
      data: { ...pal, size: rnd(10, 28), opacity: rnd(0.3, 0.9), vx: rnd(-0.4, 0.4), vy: rnd(-0.4, 0.4) },
      draggable: false, selectable: false,
    };
  });
}

function makeEdges(nodes) {
  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    [1, 4, 7].forEach((offset, idx) => {
      edges.push({
        id: `se${i}-${idx}`,
        source: nodes[i].id,
        target: nodes[(i + offset) % nodes.length].id,
        animated: true,
        style: { stroke: '#a78bfa', strokeWidth: 1, opacity: 0.2 },
        markerEnd: { type: MarkerType.None },
      });
    });
  }
  return edges;
}

const initialNodes = makeNodes(28);
const initialEdges = makeEdges(initialNodes);

/* ---------- SignUp component ---------- */
export default function SignUp() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [error,    setError]    = useState('');

  /* drift nodes */
  useEffect(() => {
    const id = setInterval(() => {
      setNodes(prev => prev.map(n => {
        let { x, y } = n.position;
        let { vx, vy } = n.data;
        x += vx; y += vy;
        if (x < 0 || x > W) vx = -vx;
        if (y < 0 || y > H) vy = -vy;
        return { ...n, position: { x, y }, data: { ...n.data, vx, vy } };
      }));
    }, 30);
    return () => clearInterval(id);
  }, [setNodes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setError('');
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* bg flow */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false}
          preventScrolling={false} nodesDraggable={false}
          nodesConnectable={false} elementsSelectable={false}
          proOptions={{ hideAttribution: true }} fitView
        >
          <Background color="#1e1b4b" variant="none" />
        </ReactFlow>
      </div>

      {/* overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg,rgba(9,9,37,0.88),rgba(15,5,50,0.82))',
        backdropFilter: 'blur(2px)',
      }} />

      {/* card */}
      <div style={{
        position: 'relative', zIndex: 2, width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto', padding: '24px 0',
      }}>
        <div style={{
          width: 'min(420px,90vw)', margin: 'auto',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: '1px solid rgba(167,139,250,0.25)',
          padding: '40px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'cardIn 0.7s cubic-bezier(0.16,1,0.3,1)',
        }}>

          {/* brand */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
              boxShadow: '0 0 28px rgba(124,58,237,0.6)',
              marginBottom: 14, animation: 'pulse 2.5s ease-in-out infinite',
            }}>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 style={{
              margin: 0, fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.5px',
              background: 'linear-gradient(90deg,#a78bfa,#67e8f9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Create Account</h1>
            <p style={{ margin: '6px 0 0', color: 'rgba(200,200,255,0.55)', fontSize: '0.83rem', fontWeight: 300 }}>
              Join Sutradhar today
            </p>
          </div>

          {/* error */}
          {error && (
            <div style={{
              marginBottom: 14, padding: '10px 14px', borderRadius: 8,
              background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.35)',
              color: '#fca5a5', fontSize: '0.82rem',
            }}>⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* name */}
            <Field label="Full Name" focusField={focusField} fieldKey="name"
              setFocusField={setFocusField}>
              <input type="text" value={name} required
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocusField('name')} onBlur={() => setFocusField(null)}
                placeholder="John Doe"
                style={inputStyle(focusField === 'name')}
              />
              <FieldIcon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </Field>

            {/* email */}
            <Field label="Email" focusField={focusField} fieldKey="email"
              setFocusField={setFocusField}>
              <input type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocusField('email')} onBlur={() => setFocusField(null)}
                placeholder="you@example.com"
                style={inputStyle(focusField === 'email')}
              />
              <FieldIcon path="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </Field>

            {/* password */}
            <div style={{ position: 'relative' }}>
              <label style={labelStyle}>Password</label>
              <input type={showPass ? 'text' : 'password'} value={password} required
                onChange={e => setPassword(e.target.value)}
                onFocus={() => setFocusField('password')} onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                style={inputStyle(focusField === 'password')}
              />
              <FieldIcon path="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', marginTop: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'rgba(167,139,250,0.7)' }}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {/* confirm */}
            <Field label="Confirm Password" focusField={focusField} fieldKey="confirm"
              setFocusField={setFocusField}>
              <input type="password" value={confirm} required
                onChange={e => setConfirm(e.target.value)}
                onFocus={() => setFocusField('confirm')} onBlur={() => setFocusField(null)}
                placeholder="••••••••"
                style={inputStyle(focusField === 'confirm')}
              />
              <FieldIcon path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </Field>

            {/* submit */}
            <button type="submit" disabled={loading} style={{
              marginTop: 6, padding: '14px',
              background: loading ? 'rgba(124,58,237,0.4)' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
              border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer',
              color: '#fff', fontWeight: 600, fontSize: '0.97rem', letterSpacing: '0.3px',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.55)',
              transition: 'all 0.3s',
            }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Creating account…
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ marginTop: 24, textAlign: 'center', color: 'rgba(200,200,255,0.5)', fontSize: '0.85rem' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#a78bfa', fontWeight: 600, textDecoration: 'none' }}>Sign in</a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes cardIn { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pulse  { 0%,100% { box-shadow:0 0 28px rgba(124,58,237,0.6); } 50% { box-shadow:0 0 46px rgba(124,58,237,0.9); } }
        @keyframes spin   { to { transform:rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ── small helpers ── */
function Field({ label, children, fieldKey, focusField, setFocusField }) {
  return (
    <div style={{ position: 'relative' }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function FieldIcon({ path }) {
  return (
    <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', marginTop: 10, pointerEvents: 'none' }}>
      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.7)" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </div>
  );
}

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
