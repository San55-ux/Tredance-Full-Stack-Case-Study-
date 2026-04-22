// src/components/nodes/AutomatedNode.jsx
import { Handle, Position } from 'reactflow';
import { Zap } from 'lucide-react';

const AutomatedNode = ({ data, selected }) => (
  <div className={`node-card ${selected ? 'selected' : ''}`}
       style={{ borderColor: '#a855f7', color: '#a855f7', minWidth: 190 }}>
    <Handle type="target" position={Position.Top}
            style={{ background: '#a855f7', width: 10, height: 10, border: '2px solid #0a0a0f' }} />
    <Handle type="source" position={Position.Bottom}
            style={{ background: '#a855f7', width: 10, height: 10, border: '2px solid #0a0a0f' }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{ background: 'rgba(168,85,247,0.15)', borderRadius: 8, padding: 6, display:'flex' }}>
        <Zap size={14} color="#a855f7" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#a855f7', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Automated</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginTop: 1 }}>{data.title || 'Automated Step'}</div>
      </div>
    </div>

    {data.actionLabel && (
      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 6, height: 6, background: '#a855f7', borderRadius: '50%', display: 'inline-block' }} />
        {data.actionLabel}
      </div>
    )}
  </div>
);

export default AutomatedNode;
