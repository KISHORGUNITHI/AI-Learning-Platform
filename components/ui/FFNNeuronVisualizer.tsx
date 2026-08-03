'use client';
/**
 * FFNNeuronVisualizer — zoom-in / zoom-out through four levels:
 * 1. FFN black box
 * 2. Inside → two Linear layers
 * 3. Zoom into Layer 1 → neuron grid (768 → 3072)
 * 4. Zoom into one neuron → weights + bias + output
 *
 * Usage: <FFNNeuronVisualizer />
 */
import { useState } from 'react';

type Level = 0 | 1 | 2 | 3;

const LEVEL_LABELS: Record<Level, string> = {
  0: 'FFN — Black Box',
  1: 'Open FFN',
  2: 'Zoom Into Linear Layer',
  3: 'Zoom Into One Neuron',
};

// Random-ish neuron "activation" values for display (fixed seed)
const NEURON_LABELS = [
  'Past Tense','Emotion','Variable','Question','Loop',
  'Function','Negation','Subject','Plural','Syntax',
  'Sentence End','Capital','Number','Verb','Noun',
  'Pronoun','Object','Adjective','Adverb','Article',
];

export default function FFNNeuronVisualizer() {
  const [level, setLevel] = useState<Level>(0);

  const canZoomIn  = level < 3;
  const canZoomOut = level > 0;

  return (
    <figure style={{
      margin: '2rem 0', borderRadius: 'var(--radius-xl)',
      overflow: 'hidden', border: '1px solid var(--color-border)',
      background: 'var(--color-surface)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.625rem 1.375rem', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--color-accent)', display:'inline-block', flexShrink:0 }} />
        <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-accent)' }}>
          {LEVEL_LABELS[level]}
        </p>
      </div>

      <div style={{ padding:'1.25rem' }}>

        {/* ── Level 0: FFN box ── */}
        {level === 0 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1.25rem' }}>
            <p style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)', textAlign:'center' }}>
              The Feed Forward Network appears as a single box inside the Transformer block. Click <strong style={{ color:'var(--color-accent)' }}>Zoom In</strong> to open it.
            </p>
            <svg viewBox="0 0 240 110" width="100%" style={{ maxWidth:'240px' }} aria-hidden="true">
              {/* Transformer block outline */}
              <rect x="10" y="8" width="220" height="95" rx="10"
                fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="6 3"/>
              <text x="120" y="28" textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">Transformer Block</text>
              {/* Attention (faded) */}
              <rect x="25" y="34" width="190" height="24" rx="5"
                fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1" opacity="0.5"/>
              <text x="120" y="50" textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)">Multi-Head Attention</text>
              {/* FFN (highlighted) */}
              <rect x="25" y="66" width="190" height="28" rx="5"
                fill="rgba(79,140,255,0.15)" stroke="var(--color-accent)" strokeWidth="2"/>
              <text x="120" y="84" textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--color-accent)">Feed Forward Network</text>
            </svg>
          </div>
        )}

        {/* ── Level 1: Two Linear layers ── */}
        {level === 1 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <p style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)', textAlign:'center' }}>
              Inside the FFN: two Linear layers separated by a GELU activation. Click <strong style={{ color:'var(--color-accent)' }}>Zoom In</strong> to explore the first linear layer.
            </p>
            <svg viewBox="0 0 260 180" width="100%" style={{ maxWidth:'260px' }} aria-hidden="true">
              {/* Input */}
              <rect x="80" y="8" width="100" height="26" rx="5" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1"/>
              <text x="130" y="25" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)">Input (768)</text>
              <line x1="130" y1="34" x2="130" y2="46" stroke="var(--color-border)" strokeWidth="1.5"/>
              {/* Linear 1 */}
              <rect x="50" y="46" width="160" height="30" rx="6" fill="rgba(79,140,255,0.18)" stroke="var(--color-accent)" strokeWidth="2"/>
              <text x="130" y="58" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-accent)">Linear Layer 1</text>
              <text x="130" y="70" textAnchor="middle" fontSize="8" fill="var(--color-accent)">768 → 3072  (3072 neurons)</text>
              <line x1="130" y1="76" x2="130" y2="88" stroke="var(--color-border)" strokeWidth="1.5"/>
              {/* GELU */}
              <rect x="80" y="88" width="100" height="26" rx="5" fill="rgba(245,158,11,0.12)" stroke="var(--color-warning)" strokeWidth="1.5"/>
              <text x="130" y="105" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-warning)">GELU (3072)</text>
              <line x1="130" y1="114" x2="130" y2="126" stroke="var(--color-border)" strokeWidth="1.5"/>
              {/* Linear 2 */}
              <rect x="50" y="126" width="160" height="26" rx="5" fill="rgba(52,211,153,0.12)" stroke="var(--color-success)" strokeWidth="1.5"/>
              <text x="130" y="143" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-success)">Linear Layer 2  (3072 → 768)</text>
              <line x1="130" y1="152" x2="130" y2="164" stroke="var(--color-border)" strokeWidth="1.5"/>
              {/* Output */}
              <rect x="80" y="164" width="100" height="14" rx="4" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1"/>
              <text x="130" y="175" textAnchor="middle" fontSize="9" fill="var(--color-text-secondary)">Output (768)</text>
            </svg>
          </div>
        )}

        {/* ── Level 2: Neuron grid ── */}
        {level === 2 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <p style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)', textAlign:'center' }}>
              Linear Layer 1 contains <strong style={{ color:'var(--color-accent)' }}>3072 neurons</strong>. Every neuron receives all 768 input features. Click <strong style={{ color:'var(--color-accent)' }}>Zoom In</strong> to open one neuron.
            </p>
            {/* Input bar */}
            <div style={{ display:'flex', gap:'2px', width:'100%', maxWidth:'22rem', height:'12px' }}>
              {Array.from({length:24},(_,i) => (
                <div key={i} style={{ flex:1, borderRadius:'2px', background:`rgba(79,140,255,${0.3+0.03*i})` }} />
              ))}
            </div>
            <p style={{ margin:0, fontSize:'0.7rem', color:'var(--color-accent)', fontFamily:'var(--font-mono)' }}>768 input features → all sent to every neuron</p>
            {/* Neuron grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:'4px', width:'100%', maxWidth:'22rem' }}>
              {NEURON_LABELS.map((label, i) => (
                <div key={i} title={label} style={{
                  aspectRatio:'1', borderRadius:'50%',
                  background: `rgba(79,140,255,${0.15 + (i%7)*0.1})`,
                  border: `1px solid rgba(79,140,255,${0.3+(i%5)*0.1})`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.5rem', color:'var(--color-accent)', fontWeight:'700',
                  cursor:'default',
                }}>
                  {i+1}
                </div>
              ))}
              {/* Remaining dots */}
              {Array.from({length:10},(_,i) => (
                <div key={'x'+i} style={{ aspectRatio:'1', borderRadius:'50%', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ fontSize:'0.5rem', color:'var(--color-text-tertiary)' }}>·</span>
                </div>
              ))}
            </div>
            <p style={{ margin:0, fontSize:'0.75rem', color:'var(--color-text-tertiary)', fontStyle:'italic' }}>
              Showing 20 of 3072 neurons. Hover to see illustrative feature labels.
            </p>
            <p style={{ margin:0, fontSize:'0.75rem', color:'var(--color-text-tertiary)', textAlign:'center' }}>
              During training, different neurons learn to detect different patterns automatically.
            </p>
          </div>
        )}

        {/* ── Level 3: Single neuron ── */}
        {level === 3 && (
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'1rem' }}>
            <p style={{ fontSize:'0.875rem', color:'var(--color-text-secondary)', textAlign:'center' }}>
              Inside one neuron: 768 inputs × their weights, summed, plus a bias, produces one output value.
            </p>
            <svg viewBox="0 0 300 200" width="100%" style={{ maxWidth:'300px' }} aria-hidden="true">
              {/* Input lines (768 shown as 6 representative) */}
              {[30,55,80,105,130,155].map((y,i) => (
                <g key={i}>
                  <rect x="10" y={y-8} width="50" height="16" rx="3" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1"/>
                  <text x="35" y={y+4} textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)">x{i+1}</text>
                  <line x1="60" y1={y} x2="120" y2="100" stroke={`rgba(79,140,255,${0.3+i*0.1})`} strokeWidth="1.5"/>
                  <text x="90" y={y-4} textAnchor="middle" fontSize="7" fill="var(--color-accent)">w{i+1}</text>
                </g>
              ))}
              <text x="35" y="180" textAnchor="middle" fontSize="8" fill="var(--color-text-tertiary)">... ×768</text>

              {/* Neuron body */}
              <circle cx="140" cy="100" r="28"
                fill="rgba(79,140,255,0.18)" stroke="var(--color-accent)" strokeWidth="2"/>
              <text x="140" y="96" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--color-accent)">Σ</text>
              <text x="140" y="108" textAnchor="middle" fontSize="8" fill="var(--color-accent)">+ bias</text>

              {/* Output */}
              <line x1="168" y1="100" x2="220" y2="100" stroke="var(--color-success)" strokeWidth="2"/>
              <rect x="220" y="88" width="66" height="24" rx="5"
                fill="rgba(52,211,153,0.18)" stroke="var(--color-success)" strokeWidth="1.5"/>
              <text x="253" y="104" textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--color-success)">1 output</text>
            </svg>
            <div style={{ padding:'0.625rem 1rem', borderRadius:'var(--radius-lg)', border:'1px solid var(--color-accent)', background:'rgba(79,140,255,0.08)', maxWidth:'22rem', width:'100%' }}>
              <p style={{ margin:'0 0 0.375rem', fontSize:'0.8rem', fontWeight:700, color:'var(--color-accent)' }}>This is the same neuron from Module 1</p>
              <p style={{ margin:0, fontSize:'0.8125rem', color:'var(--color-text-secondary)', lineHeight:1.6 }}>
                weighted sum of all 768 inputs + bias → one output value. The FFN has 3072 of these running in parallel.
              </p>
            </div>
          </div>
        )}

        {/* Controls */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'1.25rem' }}>
          <button onClick={() => setLevel((level-1) as Level)} disabled={!canZoomOut}
            style={{ padding:'0.4rem 1rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', cursor:canZoomOut?'pointer':'not-allowed', border:'1px solid var(--color-border)', background:'transparent', color:canZoomOut?'var(--color-text-secondary)':'var(--color-text-tertiary)' }}>
            ← Zoom Out
          </button>
          <div style={{ display:'flex', gap:'0.375rem' }}>
            {([0,1,2,3] as Level[]).map(l => (
              <button key={l} onClick={() => setLevel(l)} style={{ width:8, height:8, borderRadius:'50%', border:'none', cursor:'pointer', background: level===l ? 'var(--color-accent)' : 'var(--color-border)', padding:0, transition:'background 150ms' }} aria-label={`Go to level ${l+1}`} />
            ))}
          </div>
          <button onClick={() => setLevel((level+1) as Level)} disabled={!canZoomIn}
            style={{ padding:'0.4rem 1rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', cursor:canZoomIn?'pointer':'not-allowed', border:`1px solid ${canZoomIn?'var(--color-accent)':'var(--color-border)'}`, background:canZoomIn?'var(--color-accent)':'transparent', color:canZoomIn?'#fff':'var(--color-text-tertiary)' }}>
            Zoom In →
          </button>
        </div>

        <p style={{ marginTop:'0.875rem', fontSize:'0.8125rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
          Level {level+1}/4 — {LEVEL_LABELS[level]}
        </p>
      </div>
    </figure>
  );
}
