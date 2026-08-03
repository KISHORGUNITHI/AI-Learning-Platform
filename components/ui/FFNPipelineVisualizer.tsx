'use client';
/**
 * FFNPipelineVisualizer — animates a token flowing through the complete
 * Feed Forward Network: Input → Expand → GELU → Compress → Output.
 * Usage: <FFNPipelineVisualizer />
 */
import { useState } from 'react';

const STAGES = [
  { id: 0, label: 'Input Token',          dim: '768',  color: 'var(--color-text-secondary)', description: 'Context-aware token from Multi-Head Attention.' },
  { id: 1, label: 'Linear Expansion',     dim: '3072', color: 'var(--color-accent)',          description: 'First linear layer expands to 4× the embedding dimension, creating more feature capacity.' },
  { id: 2, label: 'GELU Activation',      dim: '3072', color: 'var(--color-warning)',         description: 'GELU transforms feature importance — important features glow brighter, weak ones fade.' },
  { id: 3, label: 'Linear Compression',   dim: '768',  color: 'var(--color-success)',         description: 'Second linear layer compresses back to the original embedding dimension.' },
  { id: 4, label: 'Richer Representation', dim: '768', color: 'var(--color-accent-secondary)', description: 'Same shape as the input — but richer, deeper features learned through the transformation.' },
];

const WIDTH_MAP: Record<number, number> = { 0: 120, 1: 280, 2: 280, 3: 120, 4: 120 };

export default function FFNPipelineVisualizer() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];
  const barW = WIDTH_MAP[active];

  return (
    <figure style={{ margin:'2rem 0', borderRadius:'var(--radius-xl)', overflow:'hidden', border:'1px solid var(--color-border)', background:'var(--color-surface)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.625rem 1.375rem', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--color-accent)', display:'inline-block', flexShrink:0 }} />
        <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-accent)' }}>
          Complete FFN Pipeline
        </p>
      </div>

      <div style={{ padding:'1.25rem' }}>
        {/* Stage nodes */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', flexWrap:'wrap', gap:0, marginBottom:'1.5rem' }}>
          {STAGES.map((s, i) => (
            <div key={s.id} style={{ display:'flex', alignItems:'center' }}>
              <button onClick={() => setActive(i)} style={{
                display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem',
                padding:'0.5rem 0.5rem', borderRadius:'var(--radius-lg)', cursor:'pointer', border:'none',
                background: active===i ? `${s.color}18` : 'transparent',
                outline: active===i ? `2px solid ${s.color}` : 'none',
                transition:'all 150ms', minWidth:'3.5rem', textAlign:'center',
              }}>
                <span style={{ fontSize:'0.65rem', fontWeight:700, fontFamily:'var(--font-mono)', color: i<=active ? s.color : 'var(--color-text-tertiary)', transition:'color 200ms' }}>
                  {s.dim}
                </span>
                <span style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, background: i<=active ? s.color : 'var(--color-surface-2)', color: i<=active ? '#fff' : 'var(--color-text-tertiary)', border:`1px solid ${i<=active ? s.color : 'var(--color-border)'}`, transition:'all 200ms' }}>
                  {s.id+1}
                </span>
                <span style={{ fontSize:'0.6rem', color: i<=active ? s.color : 'var(--color-text-tertiary)', whiteSpace:'nowrap', transition:'color 200ms' }}>
                  {s.label.split(' ')[0]}
                </span>
              </button>
              {i < STAGES.length-1 && (
                <span style={{ color: i<active ? 'var(--color-accent)' : 'var(--color-border)', fontSize:'1rem', margin:'0 0.125rem', paddingBottom:'0.5rem', transition:'color 200ms' }}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Active stage detail */}
        <div style={{ borderRadius:'var(--radius-xl)', border:`1px solid ${stage.color}`, background:`${stage.color}0D`, padding:'1rem 1.125rem', marginBottom:'1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.625rem' }}>
            <span style={{ fontWeight:700, color:stage.color, fontSize:'1rem' }}>{stage.label}</span>
            <span style={{ fontFamily:'var(--font-mono)', fontSize:'0.75rem', padding:'0.2rem 0.625rem', borderRadius:'999px', background:`${stage.color}22`, color:stage.color, border:`1px solid ${stage.color}44` }}>{stage.dim} dims</span>
          </div>
          <p style={{ margin:0, fontSize:'0.9rem', color:'var(--color-text-secondary)', lineHeight:1.65 }}>
            {stage.description}
          </p>
        </div>

        {/* Dimension bar visualisation */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.375rem' }}>
          <p style={{ margin:0, fontSize:'0.75rem', color:'var(--color-text-tertiary)' }}>Feature vector width</p>
          <div style={{ width:'100%', maxWidth:'20rem', height:'2rem', borderRadius:'var(--radius-md)', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', overflow:'hidden', position:'relative' }}>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${(barW/280)*100}%`, background:stage.color, opacity:0.45, transition:'width 350ms cubic-bezier(0.16,1,0.3,1)', borderRadius:'var(--radius-md)' }} />
            <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8125rem', fontWeight:700, fontFamily:'var(--font-mono)', color:stage.color }}>
              {stage.dim}
            </span>
          </div>
          <p style={{ margin:0, fontSize:'0.7rem', fontStyle:'italic', color:'var(--color-text-tertiary)' }}>
            {active===0 && 'Starting point'}
            {active===1 && 'Expanded to 4× — more feature capacity'}
            {active===2 && 'Shape unchanged — features transformed by GELU'}
            {active===3 && 'Compressed back to original size'}
            {active===4 && 'Same size as input — richer content'}
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1.25rem' }}>
          <button onClick={() => setActive(Math.max(0,active-1))} disabled={active===0} style={{ padding:'0.4rem 1rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', cursor:active===0?'not-allowed':'pointer', border:'1px solid var(--color-border)', background:'transparent', color:active===0?'var(--color-text-tertiary)':'var(--color-text-secondary)' }}>← Previous</button>
          <span style={{ fontSize:'0.8125rem', color:'var(--color-text-tertiary)', alignSelf:'center' }}>{active+1} / {STAGES.length}</span>
          <button onClick={() => setActive(Math.min(STAGES.length-1,active+1))} disabled={active===STAGES.length-1} style={{ padding:'0.4rem 1rem', borderRadius:'var(--radius-lg)', fontSize:'0.875rem', cursor:active===STAGES.length-1?'not-allowed':'pointer', border:`1px solid ${active===STAGES.length-1?'var(--color-border)':'var(--color-accent)'}`, background:active===STAGES.length-1?'transparent':'var(--color-accent)', color:active===STAGES.length-1?'var(--color-text-tertiary)':'#fff' }}>Next →</button>
        </div>

        <p style={{ marginTop:'0.875rem', fontSize:'0.8125rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
          Click any step or use navigation buttons to follow the token through the FFN.
        </p>
      </div>
    </figure>
  );
}
