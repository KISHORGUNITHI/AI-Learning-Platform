'use client';
/**
 * ConcatenationVisualizer — animates 12 head outputs concatenating into
 * one (3×768) matrix, then passing through WO.
 * Usage: <ConcatenationVisualizer />
 */
import { useState } from 'react';

const COLORS = ['#4F8CFF','#818CF8','#34D399','#F59E0B','#EF4444',
                '#EC4899','#06B6D4','#A78BFA','#6EE7B7','#FCA5A5','#93C5FD','#FCD34D'];
const HEADS = 12;

export default function ConcatenationVisualizer() {
  const [step, setStep] = useState(0);

  return (
    <figure style={{ margin:'2rem 0', borderRadius:'var(--radius-xl)', overflow:'hidden', border:'1px solid var(--color-border)', background:'var(--color-surface)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.625rem 1.375rem', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--color-accent)', display:'inline-block', flexShrink:0 }} />
        <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-accent)' }}>
          Concatenation & Output Projection
        </p>
      </div>

      <div style={{ padding:'1.25rem' }}>
        {/* Step tabs */}
        <div style={{ display:'flex', gap:'0.375rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
          {['Head Outputs','Concatenate','Project (WO)','Final'].map((s,i) => (
            <button key={i} onClick={() => setStep(i)} style={{
              padding:'0.3rem 0.75rem', borderRadius:'999px', fontSize:'0.8rem',
              fontWeight:500, cursor:'pointer', border:'none',
              background: step===i ? 'var(--color-accent)' : 'var(--color-surface-2)',
              color: step===i ? '#fff' : 'var(--color-text-secondary)',
              transition:'all 150ms',
            }}>{i+1}. {s}</button>
          ))}
        </div>

        {/* Step 0 — Individual outputs */}
        {step === 0 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.875rem' }}>
              12 separate head outputs — each is (3 × 64).
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'0.375rem' }}>
              {Array.from({length:HEADS},(_,i) => (
                <div key={i} style={{ padding:'0.5rem 0.375rem', borderRadius:'var(--radius-md)', background:`${COLORS[i]}18`, border:`1px solid ${COLORS[i]}55`, textAlign:'center' }}>
                  <div style={{ fontSize:'0.7rem', fontWeight:700, color:COLORS[i], marginBottom:'0.25rem' }}>H{i+1}</div>
                  <div style={{ fontSize:'0.6rem', fontFamily:'var(--font-mono)', color:'var(--color-text-tertiary)' }}>3×64</div>
                </div>
              ))}
            </div>
            <p style={{ marginTop:'0.75rem', fontSize:'0.75rem', color:'var(--color-text-tertiary)', textAlign:'center', fontStyle:'italic' }}>
              12 separate (3×64) matrices — one per head
            </p>
          </div>
        )}

        {/* Step 1 — Concatenation */}
        {step === 1 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.875rem' }}>
              Concatenation places all heads side-by-side along the feature dimension.
            </p>
            <div style={{ overflowX:'auto' }}>
              <div style={{ display:'flex', gap:'2px', height:'2.5rem', minWidth:'32rem', marginBottom:'0.625rem' }}>
                {Array.from({length:HEADS},(_,i) => (
                  <div key={i} style={{ flex:1, borderRadius:'3px', background:COLORS[i], opacity:0.75, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:'0.55rem', color:'#fff', fontWeight:700 }}>H{i+1}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:'0.7rem', color:'var(--color-text-tertiary)', textAlign:'center' }}>← 768 features (12 × 64) →</p>
            </div>
            <div style={{ marginTop:'0.75rem', padding:'0.5rem', borderRadius:'var(--radius-md)', background:'var(--color-surface-2)', border:'1px solid var(--color-border)', textAlign:'center', fontSize:'0.8125rem', fontFamily:'var(--font-mono)', color:'var(--color-text-secondary)' }}>
              12 × (3 × 64)  →  (3 × 768)
            </div>
            <p style={{ marginTop:'0.5rem', fontSize:'0.75rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
              Concatenation joins features — it does not add or average the outputs.
            </p>
          </div>
        )}

        {/* Step 2 — WO projection */}
        {step === 2 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.875rem' }}>
              WO is a learnable (768×768) matrix that learns how to mix information from all heads.
            </p>
            <FlowDiagramInline steps={[
              { label:'Concatenated  (3 × 768)',  color:'var(--color-accent)' },
              { label:'× WO  (768 × 768)',         color:'var(--color-warning)' },
              { label:'Final Output  (3 × 768)',   color:'var(--color-success)' },
            ]} />
            <p style={{ marginTop:'0.625rem', fontSize:'0.75rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
              WO learns how to mix information coming from different attention heads.
            </p>
          </div>
        )}

        {/* Step 3 — Final */}
        {step === 3 && (
          <div>
            <p style={{ fontSize:'0.8125rem', color:'var(--color-text-secondary)', marginBottom:'0.875rem' }}>
              The final (3×768) output carries unified contextual information from all 12 heads.
            </p>
            <div style={{ padding:'1rem 1.25rem', borderRadius:'var(--radius-xl)', border:'2px solid var(--color-success)', background:'var(--color-success-bg)' }}>
              <div style={{ display:'flex', gap:'2px', height:'2rem', marginBottom:'0.5rem' }}>
                {Array.from({length:HEADS},(_,i) => (
                  <div key={i} style={{ flex:1, borderRadius:'2px', background:COLORS[i], opacity:0.6 }} />
                ))}
              </div>
              <p style={{ margin:0, textAlign:'center', fontSize:'0.875rem', fontWeight:700, color:'var(--color-success-text)', fontFamily:'var(--font-mono)' }}>
                Final Multi-Head Attention Output: (3 × 768)
              </p>
              <p style={{ margin:'0.375rem 0 0', textAlign:'center', fontSize:'0.75rem', color:'var(--color-success-text)', opacity:0.8 }}>
                All head perspectives unified — ready for the next Transformer layer
              </p>
            </div>
          </div>
        )}

        <p style={{ marginTop:'1rem', fontSize:'0.8125rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
          Step through each stage to follow the complete output pipeline.
        </p>
      </div>
    </figure>
  );
}

function FlowDiagramInline({ steps }: { steps: { label: string; color: string }[] }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', width:'100%' }}>
          <div style={{ padding:'0.5rem 1.25rem', borderRadius:'var(--radius-md)', background:'var(--color-surface-2)', border:`1px solid ${s.color}55`, fontSize:'0.875rem', fontWeight:600, color:s.color, fontFamily:'var(--font-mono)', textAlign:'center', width:'100%', maxWidth:'20rem' }}>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', margin:'2px 0' }}>
              <div style={{ width:2, height:10, background:'var(--color-border)' }} />
              <div style={{ width:0, height:0, borderLeft:'5px solid transparent', borderRight:'5px solid transparent', borderTop:`6px solid var(--color-border)` }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
