'use client';
/**
 * MultiHeadArchitecture — animates how embeddings fan out into
 * 12 attention heads in parallel, each operating on 64 dims.
 * Usage: <MultiHeadArchitecture />
 */
import { useState } from 'react';

const HEADS = 12;
const D_MODEL = 768;
const D_HEAD = D_MODEL / HEADS; // 64

const COLORS = ['#4F8CFF','#818CF8','#34D399','#F59E0B','#EF4444',
                '#EC4899','#06B6D4','#A78BFA','#6EE7B7','#FCA5A5','#93C5FD','#FCD34D'];

export default function MultiHeadArchitecture() {
  const [stage, setStage] = useState(0);
  const STAGES = ['Input','Fan Out','Q K V per Head','Self-Attention','Outputs'];

  return (
    <figure style={{ margin:'2rem 0', borderRadius:'var(--radius-xl)', overflow:'hidden', border:'1px solid var(--color-border)', background:'var(--color-surface)' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.625rem 1.375rem', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--color-accent)', display:'inline-block', flexShrink:0 }} />
        <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-accent)' }}>
          Multi-Head Attention Architecture
        </p>
      </div>

      <div style={{ padding:'1.25rem' }}>
        {/* Stage tabs */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.375rem', marginBottom:'1.25rem' }}>
          {STAGES.map((s,i) => (
            <button key={i} onClick={() => setStage(i)} style={{
              padding:'0.3rem 0.75rem', borderRadius:'999px', fontSize:'0.8rem',
              fontWeight:500, cursor:'pointer', border:'none',
              background: stage===i ? 'var(--color-accent)' : 'var(--color-surface-2)',
              color: stage===i ? '#fff' : 'var(--color-text-secondary)',
              transition:'all 150ms',
            }}>{i+1}. {s}</button>
          ))}
        </div>

        {/* Stage 0 — Input */}
        {stage === 0 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>
              The input is a matrix of token embeddings — one row per token, 768 features wide.
            </p>
            <div style={{ overflowX:'auto' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.375rem', minWidth:'20rem' }}>
                {['Token 1','Token 2','Token 3'].map((t,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--color-text-tertiary)', minWidth:'3.5rem' }}>{t}</span>
                    <div style={{ height:'18px', width:'100%', background:'linear-gradient(90deg,rgba(79,140,255,0.6),rgba(129,140,248,0.3))', borderRadius:'3px', border:'1px solid var(--color-border)' }} />
                  </div>
                ))}
                <p style={{ margin:'0.5rem 0 0', fontSize:'0.7rem', color:'var(--color-text-tertiary)', textAlign:'right' }}>← 768 features →</p>
              </div>
            </div>
            <div style={{ marginTop:'0.75rem', padding:'0.5rem 0.875rem', borderRadius:'var(--radius-md)', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', fontSize:'0.8125rem', fontFamily:'var(--font-mono)', color:'var(--color-text-secondary)', textAlign:'center' }}>
              Input Embeddings: (3 × 768)
            </div>
          </div>
        )}

        {/* Stage 1 — Fan out */}
        {stage === 1 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>
              Every head receives the <strong style={{ color:'var(--color-text-primary)' }}>same input embeddings</strong>. What differs is each head's own WQ, WK, WV matrices.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'0.375rem', marginBottom:'0.5rem' }}>
              {Array.from({length:HEADS},(_,i) => (
                <div key={i} style={{ textAlign:'center', padding:'0.4rem 0.25rem', borderRadius:'var(--radius-md)', background:`${COLORS[i]}18`, border:`1px solid ${COLORS[i]}55`, fontSize:'0.7rem', fontWeight:600, color:COLORS[i] }}>
                  H{i+1}
                </div>
              ))}
            </div>
            <p style={{ fontSize:'0.75rem', color:'var(--color-text-tertiary)', textAlign:'center', fontStyle:'italic' }}>
              All 12 heads receive the same (3×768) input simultaneously
            </p>
          </div>
        )}

        {/* Stage 2 — Q K V per head */}
        {stage === 2 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>
              Each head projects the 768-dim input down to 64 dims using its own learnable matrices.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(10rem,1fr))', gap:'0.5rem' }}>
              {[0,1,2].map(hi => (
                <div key={hi} style={{ padding:'0.75rem', borderRadius:'var(--radius-lg)', border:`1px solid ${COLORS[hi]}55`, background:`${COLORS[hi]}0D` }}>
                  <p style={{ margin:'0 0 0.5rem', fontSize:'0.75rem', fontWeight:700, color:COLORS[hi] }}>Head {hi+1}</p>
                  {[['Q','var(--color-accent)'],['K','var(--color-success)'],['V','var(--color-warning)']].map(([l,c]) => (
                    <div key={l} style={{ display:'flex', justifyContent:'space-between', fontSize:'0.7rem', marginBottom:'0.2rem' }}>
                      <span style={{ color:c as string, fontWeight:600 }}>{l}</span>
                      <span style={{ fontFamily:'var(--font-mono)', color:'var(--color-text-tertiary)' }}>3 × 64</span>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{ padding:'0.75rem', borderRadius:'var(--radius-lg)', border:'1px solid var(--color-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:'0.75rem', color:'var(--color-text-tertiary)' }}>... × 9 more</span>
              </div>
            </div>
            <div style={{ marginTop:'0.75rem', padding:'0.5rem', borderRadius:'var(--radius-md)', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', fontSize:'0.8rem', textAlign:'center', color:'var(--color-success)', fontFamily:'var(--font-mono)' }}>
              12 × 64 = 768  ✓  (dimension preserved)
            </div>
          </div>
        )}

        {/* Stage 3 — Self-Attention in each head */}
        {stage === 3 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>
              Each head runs a complete independent Self-Attention computation on its 64-dim space — all in parallel.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(8rem,1fr))', gap:'0.5rem' }}>
              {Array.from({length:HEADS},(_,i) => (
                <div key={i} style={{ padding:'0.625rem 0.5rem', borderRadius:'var(--radius-lg)', border:`1px solid ${COLORS[i]}55`, background:`${COLORS[i]}0D`, textAlign:'center' }}>
                  <p style={{ margin:'0 0 0.375rem', fontSize:'0.7rem', fontWeight:700, color:COLORS[i] }}>Head {i+1}</p>
                  {['QKᵀ','÷√64','Softmax','×V'].map(s => (
                    <div key={s} style={{ fontSize:'0.65rem', color:'var(--color-text-tertiary)', padding:'0.15rem 0', fontFamily:'var(--font-mono)' }}>{s}</div>
                  ))}
                  <div style={{ marginTop:'0.375rem', fontSize:'0.7rem', fontFamily:'var(--font-mono)', color:COLORS[i] }}>3 × 64</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop:'0.625rem', fontSize:'0.75rem', color:'var(--color-text-tertiary)', textAlign:'center', fontStyle:'italic' }}>
              All heads execute simultaneously on GPU — not sequentially.
            </p>
          </div>
        )}

        {/* Stage 4 — Outputs */}
        {stage === 4 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.75rem' }}>
              Each head produces a (3×64) output. Next lesson: these are concatenated into (3×768) and projected through WO.
            </p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'0.375rem', marginBottom:'0.75rem' }}>
              {Array.from({length:HEADS},(_,i) => (
                <div key={i} style={{ padding:'0.3rem 0.5rem', borderRadius:'var(--radius-md)', background:`${COLORS[i]}18`, border:`1px solid ${COLORS[i]}55`, fontSize:'0.7rem', fontFamily:'var(--font-mono)', color:COLORS[i] }}>
                  H{i+1}: 3×64
                </div>
              ))}
            </div>
            <div style={{ padding:'0.625rem 1rem', borderRadius:'var(--radius-lg)', border:'2px solid var(--color-success)', background:'var(--color-success-bg)', fontSize:'0.8rem', textAlign:'center', color:'var(--color-success-text)', fontFamily:'var(--font-mono)' }}>
              Concatenate all heads → (3 × 768)  →  WO  →  Final Output (3 × 768)
            </div>
          </div>
        )}

        <p style={{ marginTop:'1rem', fontSize:'0.8125rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
          Click stage tabs above to explore each part of the Multi-Head Attention block.
        </p>
      </div>
    </figure>
  );
}
