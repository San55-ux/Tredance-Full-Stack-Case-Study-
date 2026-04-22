// src/components/nodes/StartNode.jsx
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';

const StartNode = ({ data, selected }) => (
  <div className={`node-card ${selected ? 'selected' : ''}`}
       style={{ borderColor: '#22c55e', color: '#22c55e', minWidth: 160 }}>
    <Handle type="source" position={Position.Bottom}
            style={{ background: '#22c55e', width: 10, height: 10, border: '2px solid #0a0a0f' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ background: 'rgba(34,197,94,0.15)', borderRadius: 8, padding: 6, display:'flex' }}>
        <Play size={14} color="#22c55e" fill="#22c55e" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#22c55e', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Start</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginTop: 1 }}>{data.title || 'Workflow Start'}</div>
      </div>
    </div>
    {data.metadata?.length > 0 && (
      <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(34,197,94,0.2)' }}>
        {data.metadata.map((m, i) => (
          <div key={i} style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}>
            {m.key}: {m.value}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default StartNode;
