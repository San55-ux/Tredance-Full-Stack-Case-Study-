// src/components/SandboxPanel.jsx
import { useState } from 'react';
import { Play, X, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import useSimulate from '../hooks/useSimulate';
import useWorkflowStore from '../store/workflowStore';

const statusIcon = (status) => {
  if (status === 'completed' || status === 'approved')
    return <CheckCircle size={14} color="#22c55e" />;
  if (status === 'rejected')
    return <XCircle size={14} color="#ef4444" />;
  return <Loader size={14} color="#6366f1" />;
};

const statusColor = (status) => ({
  completed: '#22c55e', approved: '#22c55e', rejected: '#ef4444',
}[status] || '#6366f1');

const SandboxPanel = ({ onClose }) => {
  const nodes  = useWorkflowStore(s => s.nodes);
  const edges  = useWorkflowStore(s => s.edges);
  const { run, running, result, visSteps, reset } = useSimulate();

  const handleRun = () => { reset(); run(nodes, edges); };

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
      width: 520, maxHeight: 420, background: '#0d0d1a',
      border: '1px solid #2d2d4e', borderRadius: 14,
      display: 'flex', flexDirection: 'column', zIndex: 100,
      boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
    }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #1e1e30',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }}
               className={running ? 'pulse-dot' : ''} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Workflow Sandbox</span>
          <span style={{ fontSize: 11, color: '#475569', fontFamily: 'JetBrains Mono, monospace' }}>
            {nodes.length} nodes · {edges.length} edges
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleRun} disabled={running}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: running ? '#1e1e30' : '#6366f1',
                     border: 'none', borderRadius: 7, padding: '6px 14px',
                     color: running ? '#475569' : '#fff', fontSize: 12, cursor: running ? 'not-allowed' : 'pointer',
                     fontFamily: 'DM Sans, sans-serif', fontWeight: 600, transition: 'all 0.15s' }}>
            {running ? <><Loader size={12} /> Running...</> : <><Play size={12} /> Run Simulation</>}
          </button>
          <button onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#475569',
                     cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>

        {/* Validation Errors */}
        {result && !result.success && result.errors.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            {result.errors.map((err, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8,
                                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                                    borderRadius: 8, padding: '8px 12px', marginBottom: 6 }}>
                <AlertTriangle size={14} color="#ef4444" style={{ marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: '#fca5a5' }}>{err}</span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!running && !result && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#475569' }}>
            <Play size={28} style={{ marginBottom: 8, opacity: 0.4 }} />
            <div style={{ fontSize: 13 }}>Click "Run Simulation" to test your workflow</div>
          </div>
        )}

        {/* Steps */}
        {visSteps.map((step, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '8px 10px', marginBottom: 6, borderRadius: 8,
            background: '#13131f', border: `1px solid rgba(${step.status === 'rejected' ? '239,68,68' : '99,102,241'}, 0.15)`,
            animation: 'fadeIn 0.25s ease forwards',
          }}>
            <div style={{ marginTop: 1 }}>{statusIcon(step.status)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: '#e2e8f0', marginBottom: 2 }}>{step.message}</div>
              <div style={{ fontSize: 10, color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
                Step {step.index} · {step.nodeId}
              </div>
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: statusColor(step.status),
                          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {step.status}
            </div>
          </div>
        ))}

        {/* Success banner */}
        {result?.success && !running && visSteps.length === result.steps.length && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8,
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 8, padding: '10px 14px' }}>
            <CheckCircle size={16} color="#22c55e" />
            <span style={{ fontSize: 13, color: '#86efac', fontWeight: 500 }}>
              Simulation complete — {visSteps.length} steps executed
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SandboxPanel;
