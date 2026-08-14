import { useEffect, useState } from 'react';
import {ReactFlow,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

/* ─────────────────────────────────────────────
   STEP DEFINITIONS
───────────────────────────────────────────── */
const STEPS = [
  {
    id: 'n1',
    label: 'Input Received',
    icon: '📥',
    description: 'User request ingested and parsed',
    color: '#7c3aed',
    glow: '#a78bfa',
  },
  {
    id: 'n2',
    label: 'AI Processing',
    icon: '🧠',
    description: 'Generating content with LLM',
    color: '#0891b2',
    glow: '#67e8f9',
  },
  {
    id: 'n3',
    label: 'Post-Processing',
    icon: '⚙️',
    description: 'Formatting, filtering & enriching',
    color: '#b45309',
    glow: '#fde68a',
  },
  {
    id: 'n4',
    label: 'Output Ready',
    icon: '✅',
    description: 'Content packaged for delivery',
    color: '#16a34a',
    glow: '#86efac',
  },
];

/* Y positions so nodes sit in a single horizontal row */
const NODE_Y = 80;
const NODE_GAP = 230;

/* ─────────────────────────────────────────────
   CUSTOM NODE
───────────────────────────────────────────── */
function PipelineNode({ data }) {
  const { label, icon, description, color, glow, status } = data;

  const borderColor =
    status === 'done'    ? color :
    status === 'active'  ? glow  :
    'rgba(255,255,255,0.12)';

  const bgColor =
    status === 'done'   ? `${color}22` :
    status === 'active' ? `${color}18` :
    'rgba(255,255,255,0.03)';

  const textColor =
    status === 'pending' ? 'rgba(200,200,255,0.35)' : '#e2e8f0';

  return (
    <div style={{
      width: 160,
      padding: '18px 14px',
      borderRadius: 16,
      border: `2px solid ${borderColor}`,
      background: bgColor,
      backdropFilter: 'blur(10px)',
      boxShadow: status === 'active'
        ? `0 0 24px ${glow}88, 0 8px 32px rgba(0,0,0,0.4)`
        : status === 'done'
        ? `0 0 12px ${color}44`
        : 'none',
      transition: 'all 0.5s ease',
      textAlign: 'center',
      position: 'relative',
      cursor: 'default',
    }}>
      {/* pulse ring for active */}
      {status === 'active' && (
        <div style={{
          position: 'absolute', inset: -6, borderRadius: 20,
          border: `2px solid ${glow}`,
          animation: 'ringPulse 1.4s ease-out infinite',
          pointerEvents: 'none',
        }} />
      )}

      {/* icon circle */}
      <div style={{
        width: 44, height: 44, borderRadius: '50%', margin: '0 auto 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: status !== 'pending' ? `${color}33` : 'rgba(255,255,255,0.06)',
        fontSize: '1.3rem',
        filter: status === 'pending' ? 'grayscale(1) opacity(0.4)' : 'none',
        transition: 'all 0.5s',
      }}>
        {status === 'done' ? '✅' : icon}
      </div>

      <p style={{
        margin: 0, fontWeight: 700, fontSize: '0.82rem',
        color: textColor, letterSpacing: '0.3px',
      }}>{label}</p>

      <p style={{
        margin: '5px 0 0', fontSize: '0.7rem',
        color: status === 'pending' ? 'rgba(200,200,255,0.2)' : 'rgba(200,200,255,0.55)',
        lineHeight: 1.4,
      }}>{description}</p>

      {/* step badge */}
      <div style={{
        position: 'absolute', top: -10, right: -10,
        width: 22, height: 22, borderRadius: '50%',
        background: status !== 'pending' ? color : 'rgba(100,100,150,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', fontWeight: 700, color: '#fff',
        transition: 'background 0.4s',
      }}>
        {data.stepNum}
      </div>

      <Handle type="target" position={Position.Left}  style={{ visibility: 'hidden' }} />
      <Handle type="source" position={Position.Right} style={{ visibility: 'hidden' }} />
    </div>
  );
}

const nodeTypes = { pipeline: PipelineNode };

/* ─────────────────────────────────────────────
   INITIAL NODES & EDGES
───────────────────────────────────────────── */
function buildNodes(activeStep) {
  return STEPS.map((s, i) => ({
    id: s.id,
    type: 'pipeline',
    position: { x: i * NODE_GAP, y: NODE_Y },
    data: {
      ...s,
      stepNum: i + 1,
      status:
        i < activeStep  ? 'done'   :
        i === activeStep ? 'active' :
        'pending',
    },
    draggable: false,
    selectable: false,
  }));
}

function buildEdges(activeStep) {
  return STEPS.slice(0, -1).map((s, i) => ({
    id: `e${i}`,
    source: s.id,
    target: STEPS[i + 1].id,
    animated: i < activeStep,
    style: {
      stroke: i < activeStep ? STEPS[i].glow : 'rgba(255,255,255,0.12)',
      strokeWidth: 2,
      strokeDasharray: '8 5',
    },
  }));
}

/* ─────────────────────────────────────────────
   PIPELINE COMPONENT
───────────────────────────────────────────── */
export default function Pipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(0));
  const [edges, setEdges, onEdgesChange] = useEdgesState(buildEdges(0));

  /* auto-advance every 2 s */
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => {
      const next = activeStep + 1;
      if (next >= STEPS.length) {
        setDone(true);
      } else {
        setActiveStep(next);
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [activeStep, done]);

  /* sync nodes/edges when step changes */
  useEffect(() => {
    setNodes(buildNodes(activeStep));
    setEdges(buildEdges(activeStep));
  }, [activeStep, setNodes, setEdges]);

  const restart = () => {
    setDone(false);
    setActiveStep(0);
  };

  const completedCount = done ? STEPS.length : activeStep;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: '#09091f', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav style={{
        height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(167,139,250,0.15)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(124,58,237,0.6)',
          }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span style={{
            fontWeight: 700, fontSize: '1.05rem',
            background: 'linear-gradient(90deg,#a78bfa,#67e8f9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Sutradhar</span>
          <span style={{ color: 'rgba(200,200,255,0.35)', fontSize: '0.8rem', marginLeft: 4 }}>
            / Content Pipeline
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: done ? 'rgba(22,163,74,0.15)' : 'rgba(124,58,237,0.15)',
            border: `1px solid ${done ? 'rgba(22,163,74,0.4)' : 'rgba(124,58,237,0.3)'}`,
            borderRadius: 20, padding: '4px 12px',
          }}>
            {!done && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'blink 1.2s ease infinite' }} />}
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: done ? '#86efac' : '#a78bfa' }}>
              {done ? 'Complete' : 'Processing…'}
            </span>
          </div>
          <button onClick={restart} style={{
            background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)',
            borderRadius: 8, padding: '5px 14px', cursor: 'pointer', color: '#a78bfa',
            fontSize: '0.8rem', fontWeight: 600, transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(167,139,250,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(167,139,250,0.1)'}
          >↺ Restart</button>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, padding: '40px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>

        {/* heading */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            margin: 0, fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700,
            background: 'linear-gradient(90deg,#a78bfa,#67e8f9)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Backend Processing Pipeline</h1>
          <p style={{ margin: '8px 0 0', color: 'rgba(200,200,255,0.5)', fontSize: '0.88rem' }}>
            Watch your request travel through each stage in real-time
          </p>
        </div>

        {/* progress bar */}
        <div style={{ width: '100%', maxWidth: 900 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.75rem', color: 'rgba(200,200,255,0.5)' }}>Progress</span>
            <span style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 600 }}>{progressPct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 99,
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg,#7c3aed,#67e8f9)',
              transition: 'width 0.6s ease',
              boxShadow: '0 0 12px rgba(124,58,237,0.6)',
            }} />
          </div>
        </div>

        {/* ── React Flow canvas ── */}
        <div style={{
          width: '100%', maxWidth: 900, height: 260,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(167,139,250,0.12)',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
        }}>
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
            fitViewOptions={{ padding: 0.35 }}
          />
        </div>

        {/* ── step log ── */}
        <div style={{ width: '100%', maxWidth: 900 }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '0.85rem', color: 'rgba(200,200,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Stage Log
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {STEPS.map((s, i) => {
              const st = i < (done ? STEPS.length : activeStep) ? 'done' : i === activeStep && !done ? 'active' : 'pending';
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '10px 16px', borderRadius: 10,
                  background: st === 'active' ? `${s.color}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${st === 'active' ? s.glow + '55' : st === 'done' ? s.color + '33' : 'rgba(255,255,255,0.06)'}`,
                  transition: 'all 0.4s',
                  opacity: st === 'pending' ? 0.4 : 1,
                }}>
                  <span style={{ fontSize: '1.1rem' }}>{st === 'done' ? '✅' : st === 'active' ? '⏳' : s.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.84rem', color: '#e2e8f0' }}>{s.label}</p>
                    <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(200,200,255,0.45)' }}>{s.description}</p>
                  </div>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    color: st === 'done' ? '#86efac' : st === 'active' ? s.glow : 'rgba(200,200,255,0.25)',
                    textTransform: 'uppercase',
                  }}>
                    {st === 'done' ? 'Done' : st === 'active' ? 'Running' : 'Waiting'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── "content getting ready" banner ── */}
        <div style={{
          width: '100%', maxWidth: 900,
          borderRadius: 20,
          background: done
            ? 'linear-gradient(135deg,rgba(22,163,74,0.15),rgba(16,163,74,0.05))'
            : 'linear-gradient(135deg,rgba(124,58,237,0.12),rgba(79,70,229,0.08))',
          border: `1px solid ${done ? 'rgba(22,163,74,0.35)' : 'rgba(124,58,237,0.25)'}`,
          padding: '32px 28px',
          textAlign: 'center',
          transition: 'all 0.6s ease',
          boxShadow: done ? '0 0 30px rgba(22,163,74,0.1)' : 'none',
        }}>
          {done ? (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>🎉</div>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 700, color: '#86efac' }}>
                Your Content is Ready!
              </h2>
              <p style={{ margin: 0, color: 'rgba(200,255,200,0.6)', fontSize: '0.88rem' }}>
                All pipeline stages completed successfully. Your orchestrated content has been packaged and is ready for delivery.
              </p>
              <button onClick={restart} style={{
                marginTop: 20, padding: '10px 28px',
                background: 'linear-gradient(135deg,#16a34a,#15803d)',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                color: '#fff', fontWeight: 600, fontSize: '0.9rem',
                boxShadow: '0 4px 16px rgba(22,163,74,0.4)',
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Run Again
              </button>
            </>
          ) : (
            <>
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  display: 'inline-block', width: 36, height: 36,
                  border: '3px solid rgba(167,139,250,0.25)',
                  borderTopColor: '#a78bfa', borderRadius: '50%',
                  animation: 'spin 0.9s linear infinite',
                }} />
              </div>
              <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 700, color: '#c4b5fd' }}>
                Your Content is Getting Ready…
              </h2>
              <p style={{ margin: 0, color: 'rgba(200,200,255,0.5)', fontSize: '0.86rem' }}>
                Currently running: <strong style={{ color: '#a78bfa' }}>{STEPS[Math.min(activeStep, STEPS.length - 1)].label}</strong>
                &nbsp;— please hold on while the pipeline processes your request.
              </p>
            </>
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{
        padding: '18px 32px',
        borderTop: '1px solid rgba(167,139,250,0.1)',
        background: 'rgba(255,255,255,0.02)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8,
      }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(200,200,255,0.35)' }}>
          © 2026 Sutradhar — Autonomous Content Orchestration
        </span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(200,200,255,0.25)' }}>
          Pipeline v1.0 · Built with React Flow
        </span>
      </footer>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes blink       { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        @keyframes ringPulse   { 0% { opacity:0.9; transform:scale(1); } 100% { opacity:0; transform:scale(1.25); } }
        .react-flow__renderer  { background: transparent !important; }
      `}</style>
    </div>
  );
}
