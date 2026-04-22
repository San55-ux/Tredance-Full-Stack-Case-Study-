// src/components/Sidebar.jsx
import { Play, CheckSquare, Shield, Zap, Flag, Download, Upload } from 'lucide-react';
import useWorkflowStore from '../store/workflowStore';

const NODE_TYPES = [
  { type: 'startNode',    label: 'Start',          icon: Play,        color: '#22c55e', desc: 'Workflow entry point' },
  { type: 'taskNode',     label: 'Task',           icon: CheckSquare, color: '#3b82f6', desc: 'Human task step' },
  { type: 'approvalNode', label: 'Approval',       icon: Shield,      color: '#f59e0b', desc: 'Manager approval' },
  { type: 'automatedNode',label: 'Automated Step', icon: Zap,         color: '#a855f7', desc: 'System action' },
  { type: 'endNode',      label: 'End',            icon: Flag,        color: '#ef4444', desc: 'Workflow end' },
];

const SidebarCard = ({ type, label, icon: Icon, color, desc }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div draggable onDragStart={onDragStart}
         style={{
           display: 'flex', alignItems: 'center', gap: 10,
           background: '#13131f', border: `1px solid #1e1e30`,
           borderRadius: 10, padding: '10px 12px', cursor: 'grab',
           transition: 'all 0.15s', marginBottom: 8,
         }}
         onMouseEnter={e => {
           e.currentTarget.style.borderColor = color;
           e.currentTarget.style.background = `rgba(${hexToRgb(color)}, 0.07)`;
         }}
         onMouseLeave={e => {
           e.currentTarget.style.borderColor = '#1e1e30';
           e.currentTarget.style.background = '#13131f';
         }}>
      <div style={{ background: `rgba(${hexToRgb(color)}, 0.15)`, borderRadius: 8, padding: 7, display: 'flex' }}>
        <Icon size={14} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0' }}>{label}</div>
        <div style={{ fontSize: 10, color: '#475569' }}>{desc}</div>
      </div>
    </div>
  );
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

const Sidebar = () => {
  const exportWorkflow  = useWorkflowStore(s => s.exportWorkflow);
  const importWorkflow  = useWorkflowStore(s => s.importWorkflow);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'workflow.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => importWorkflow(ev.target.result);
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div style={{
      width: 220, background: '#0d0d1a', borderRight: '1px solid #1e1e30',
      display: 'flex', flexDirection: 'column', padding: '16px 12px',
      gap: 4, overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#475569',
                      letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 2 }}>
          HR Workflow Designer
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>
          Node Palette
        </div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>
          Drag nodes onto the canvas
        </div>
      </div>

      {/* Node Cards */}
      {NODE_TYPES.map(n => <SidebarCard key={n.type} {...n} />)}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #1e1e30', margin: '8px 0' }} />

      {/* Export / Import */}
      <button onClick={handleExport}
        style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.1)',
                 border:'1px solid rgba(99,102,241,0.3)', borderRadius:8, padding:'8px 12px',
                 color:'#6366f1', fontSize:12, cursor:'pointer', fontFamily:'DM Sans, sans-serif',
                 marginBottom:6 }}>
        <Download size={13} /> Export JSON
      </button>
      <button onClick={handleImport}
        style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(99,102,241,0.05)',
                 border:'1px solid #2d2d4e', borderRadius:8, padding:'8px 12px',
                 color:'#94a3b8', fontSize:12, cursor:'pointer', fontFamily:'DM Sans, sans-serif' }}>
        <Upload size={13} /> Import JSON
      </button>
    </div>
  );
};

export default Sidebar;
