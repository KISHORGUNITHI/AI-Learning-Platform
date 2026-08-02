'use client';
/**
 * ParallelHeadsVisualizer — animated progress bars showing all 12 heads
 * running simultaneously vs sequentially.
 * Usage: <ParallelHeadsVisualizer />
 */
import { useState, useEffect } from 'react';

const HEADS = 12;
const COLORS = ['#4F8CFF','#818CF8','#34D399','#F59E0B','#EF4444',
                '#EC4899','#06B6D4','#A78BFA','#6EE7B7','#FCA5A5','#93C5FD','#FCD34D'];

export default function ParallelHeadsVisualizer() {
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number[]>(Array(HEADS).fill(0));
  const [mode, setMode]   = useState<'parallel'|'sequential'>('parallel');
  const [done, setDone]   = useState(false);

  const reset = () => { setProgress(Array(HEADS).fill(0)); setDone(false); setRunning(false); };

  useEffect(() => {
    if (!running) return;
    let frame: number;
    let step = 0;
    const tick = () => {
      step += 2;
      if (mode === 'parallel') {
        const next = Array(HEADS).fill(Math.min(step, 100));
        setProgress(next);
        if (step >= 100) { setDone(true); setRunning(false); return; }
      } else {
        // sequential: fill head by head
        const perHead = 100 / HEADS;  // each head gets ~8.33 steps out of 100
        const next = Array(HEADS).fill(0).map((_,i) => {
          const start = i * perHead;
          return Math.min(Math.max(step - start * (100 / (100/HEADS)), 0) * HEADS, 100);
        });
        setProgress(next);
        if (step >= 100 + (HEADS - 1) * (100 / HEADS)) { setDone(true); setRunning(false); return; }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, mode]);

  return (
    <figure style={{ margin:'2rem 0', borderRadius:'var(--radius-xl)', overflow:'hidden', border:'1px solid var(--color-border)', background:'var(--color-surface)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.625rem 1.375rem', background:'var(--color-surface-2)', borderBottom:'1px solid var(--color-border)' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--color-accent)', display:'inline-block', flexShrink:0 }} />
        <p style={{ margin:0, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--color-accent)' }}>
          Parallel vs Sequential Execution
        </p>
      </div>

      <div style={{ padding:'1.25rem' }}>
        {/* Mode + controls */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'1.25rem', alignItems:'center' }}>
          {(['parallel','sequential'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); reset(); }} style={{
              padding:'0.35rem 0.875rem', borderRadius:'999px', fontSize:'0.8rem',
              fontWeight:500, cursor:'pointer', border:'none',
              background: mode===m ? (m==='parallel' ? 'var(--color-success)' : 'var(--color-error)') : 'var(--color-surface-2)',
              color: mode===m ? '#fff' : 'var(--color-text-secondary)',
              transition:'all 150ms',
            }}>{m==='parallel' ? '✅ Parallel' : '❌ Sequential'}</button>
          ))}
          <button onClick={() => { reset(); setTimeout(() => setRunning(true), 50); }} style={{
            padding:'0.35rem 0.875rem', borderRadius:'999px', fontSize:'0.8rem',
            fontWeight:600, cursor:'pointer', border:'none',
            background:'var(--color-accent)', color:'#fff',
          }}>▶ Run</button>
          <button onClick={reset} style={{ padding:'0.35rem 0.875rem', borderRadius:'999px', fontSize:'0.8rem', cursor:'pointer', border:'1px solid var(--color-border)', background:'transparent', color:'var(--color-text-tertiary)' }}>Reset</button>
        </div>

        {/* Progress bars */}
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {Array.from({length:HEADS},(_,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.625rem' }}>
              <span style={{ fontSize:'0.7rem', fontWeight:600, color:COLORS[i], minWidth:'3.5rem' }}>Head {i+1}</span>
              <div style={{ flex:1, height:'12px', borderRadius:'999px', background:'var(--color-surface-2)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${progress[i]}%`, background:COLORS[i], borderRadius:'999px', transition:'width 30ms linear' }} />
              </div>
              <span style={{ fontSize:'0.7rem', color:'var(--color-text-tertiary)', minWidth:'2.5rem', textAlign:'right', fontFamily:'var(--font-mono)' }}>
                {progress[i] === 100 ? '✓' : `${Math.round(progress[i])}%`}
              </span>
            </div>
          ))}
        </div>

        {done && (
          <div style={{ marginTop:'1rem', padding:'0.625rem 1rem', borderRadius:'var(--radius-lg)', border:`1px solid ${mode==='parallel' ? 'var(--color-success)' : 'var(--color-error)'}`, background:`${mode==='parallel' ? 'var(--color-success-bg)' : 'var(--color-error-bg)'}`, textAlign:'center', fontSize:'0.875rem', fontWeight:600, color:mode==='parallel' ? 'var(--color-success-text)' : 'var(--color-error-text)' }}>
            {mode === 'parallel' ? '✅ All 12 heads finished at the same time — fast!' : '❌ Heads finished one by one — 12× slower'}
          </div>
        )}

        <p style={{ marginTop:'0.875rem', fontSize:'0.8125rem', fontStyle:'italic', color:'var(--color-text-tertiary)', textAlign:'center' }}>
          Multi-Head Attention is efficient because every head performs its computations in parallel on smaller feature spaces.
        </p>
      </div>
    </figure>
  );
}
