// src/components/NodeFormPanel.jsx
import { useEffect, useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { StartForm, TaskForm, ApprovalForm, AutomatedForm, EndForm } from './forms/NodeForms';
import { getAutomations } from '../api/mockApi';
import useWorkflowStore from '../store/workflowStore';

const TYPE_META = {
  startNode:     { label: 'Start Node',      color: '#22c55e' },
  taskNode:      { label: 'Task Node',        color: '#3b82f6' },
  approvalNode:  { label: 'Approval Node',    color: '#f59e0b' },
  automatedNode: { label: 'Automated Step',   color: '#a855f7' },
  endNode:       { label: 'End Node',         color: '#ef4444' },
};

const NodeFormPanel = () => {
  const selectedNode   = useWorkflowStore(s => s.selectedNode);
  const clearSelection = useWorkflowStore(s => s.clearSelection);
  const updateNodeData = useWorkflowStore(s => s.updateNodeData);
  const deleteNode     = useWorkflowStore(s => s.deleteNode);

  const [automations, setAutomations] = useState([]);

  useEffect(() => { getAutomations().then(setAutomations); }, []);

  if (!selectedNode) return null;

  const meta    = TYPE_META[selectedNode.type] || { label: selectedNode.type, color: '#6366f1' };
  const onChange = (newData) => updateNodeData(selectedNode.id, newData);

  const FormComponent = {
    startNode:     StartForm,
    taskNode:      TaskForm,
    approvalNode:  ApprovalForm,
    automatedNode: AutomatedForm,
    endNode:       EndForm,
  }[selectedNode.type];

  return (
    <div style={{
      width: 280, background: '#0d0d1a', borderLeft: '1px solid #1e1e30',
      display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }} className="animate-fadeIn">

      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid #1e1e30',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: meta.color,
                        letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {meta.label}
          </div>
          <div style={{ fontSize: 12, color: '#475569', fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
            {selectedNode.id}
          </div>
        </div>
        <button onClick={clearSelection}
          style={{ background: 'transparent', border: 'none', color: '#475569',
                   cursor: 'pointer', padding: 4, borderRadius: 6,
                   display: 'flex', alignItems: 'center' }}>
          <X size={16} />
        </button>
      </div>

      {/* Accent bar */}
      <div style={{ height: 2, background: `linear-gradient(90deg, ${meta.color}, transparent)` }} />

      {/* Form */}
      <div style={{ padding: 16, flex: 1 }}>
        {FormComponent && (
          <FormComponent
            data={selectedNode.data}
            onChange={onChange}
            automations={automations}
          />
        )}
      </div>

      {/* Delete button */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #1e1e30' }}>
        <button onClick={() => deleteNode(selectedNode.id)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                   background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                   borderRadius: 8, padding: '8px 14px', color: '#ef4444',
                   fontSize: 12, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                   justifyContent: 'center' }}>
          <Trash2 size={13} /> Delete Node
        </button>
      </div>
    </div>
  );
};

export default NodeFormPanel;
