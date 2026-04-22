// src/components/nodes/TaskNode.jsx
import { Handle, Position } from 'reactflow';
import { CheckSquare, User, Calendar } from 'lucide-react';

const TaskNode = ({ data, selected }) => (
  <div className={`node-card ${selected ? 'selected' : ''}`}
       style={{ borderColor: '#3b82f6', color: '#3b82f6', minWidth: 190 }}>
    <Handle type="target" position={Position.Top}
            style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid #0a0a0f' }} />
    <Handle type="source" position={Position.Bottom}
            style={{ background: '#3b82f6', width: 10, height: 10, border: '2px solid #0a0a0f' }} />

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <div style={{ background: 'rgba(59,130,246,0.15)', borderRadius: 8, padding: 6, display:'flex' }}>
        <CheckSquare size={14} color="#3b82f6" />
      </div>
      <div>
        <div style={{ fontSize: 10, color: '#3b82f6', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Task</div>
        <div style={{ fontSize: 13, color: '#e2e8f0', fontWeight: 600, marginTop: 1 }}>{data.title || 'Untitled Task'}</div>
      </div>
    </div>

    {data.description && (
      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 6, lineHeight: 1.4 }}>{data.description}</div>
    )}

    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {data.assignee && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <User size={10} /> {data.assignee}
        </div>
      )}
      {data.dueDate && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#64748b' }}>
          <Calendar size={10} /> {data.dueDate}
        </div>
      )}
    </div>
  </div>
);

export default TaskNode;
