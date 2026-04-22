// src/components/nodes/EndNode.jsx
import { Handle, Position } from 'reactflow';
import { Flag } from 'lucide-react';

const EndNode = ({ data, selected }) => (
  <div className={`node-card ${selected ? 'selected' : ''}`}
       style={{ borderColor: '#ef4444', color: '#ef4444', minWidth: 160 }}>
    <Handle type="target" position={Position.Top}
            style={{ background: '#ef4444', width: 10, height: 10, border: '2px solid #0a0a0f' }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ background: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: 6, display:'flex' }}>
        <Flag size={14} color="#ef4444" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#ef4444', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>End</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginTop: 1 }}>
          {data.endMessage || 'Workflow Complete'}
        </div>
      </div>
    </div>
    {data.summaryFlag && (
      <div style={{ marginTop: 6, fontSize: 10, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 5, height: 5, background: '#ef4444', borderRadius: '50%' }} />
        Summary enabled
      </div>
    )}
  </div>
);

export default EndNode;
