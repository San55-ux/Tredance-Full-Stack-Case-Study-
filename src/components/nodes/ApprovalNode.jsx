// src/components/nodes/ApprovalNode.jsx
import { Handle, Position } from 'reactflow';
import { Shield } from 'lucide-react';

const ApprovalNode = ({ data, selected }) => (
  <div className={`node-card ${selected ? 'selected' : ''}`}
       style={{ borderColor: '#f59e0b', color: '#f59e0b', minWidth: 190 }}>
    <Handle type="target" position={Position.Top}
            style={{ background: '#f59e0b', width: 10, height: 10, border: '2px solid #0a0a0f' }} />
    <Handle type="source" position={Position.Bottom}
            style={{ background: '#f59e0b', width: 10, height: 10, border: '2px solid #0a0a0f' }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <div style={{ background: 'rgba(245,158,11,0.15)', borderRadius: 8, padding: 6, display:'flex' }}>
        <Shield size={14} color="#f59e0b" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Approval</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginTop: 1 }}>{data.title || 'Approval Step'}</div>
      </div>
    </div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 11, color: '#94a3b8' }}>{data.approverRole || 'Manager'}</span>
      {data.autoApproveThreshold && (
        <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.15)', color: '#f59e0b',
                       padding: '2px 6px', borderRadius: 4, fontFamily: 'JetBrains Mono, monospace' }}>
          Auto ≥{data.autoApproveThreshold}%
        </span>
      )}
    </div>
  </div>
);

export default ApprovalNode;
