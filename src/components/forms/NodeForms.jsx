// src/components/forms/NodeForms.jsx
// All 5 node editing forms — controlled components with clean state handling

import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// ── Shared field styles ───────────────────────────────
const inputStyle = {
  width: '100%', background: '#0f0f1a', border: '1px solid #2d2d4e',
  borderRadius: 8, padding: '8px 10px', color: '#e2e8f0', fontSize: 13,
  outline: 'none', transition: 'border-color 0.15s',
};
const labelStyle = { fontSize: 11, fontWeight: 600, color: '#64748b',
  letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4, display: 'block' };

const Field = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={labelStyle}>{label}</label>
    {children}
  </div>
);

const Input = (props) => (
  <input style={inputStyle} {...props}
    onFocus={e => e.target.style.borderColor = '#6366f1'}
    onBlur={e => e.target.style.borderColor = '#2d2d4e'} />
);

const Textarea = (props) => (
  <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 64 }} {...props}
    onFocus={e => e.target.style.borderColor = '#6366f1'}
    onBlur={e => e.target.style.borderColor = '#2d2d4e'} />
);

const Select = ({ children, ...props }) => (
  <select style={{ ...inputStyle, cursor: 'pointer' }} {...props}
    onFocus={e => e.target.style.borderColor = '#6366f1'}
    onBlur={e => e.target.style.borderColor = '#2d2d4e'}>
    {children}
  </select>
);

// ── Key-Value pair editor ─────────────────────────────
const KVEditor = ({ pairs, onChange, color = '#6366f1' }) => {
  const add    = () => onChange([...pairs, { key: '', value: '' }]);
  const remove = (i) => onChange(pairs.filter((_, idx) => idx !== i));
  const update = (i, field, val) =>
    onChange(pairs.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input placeholder="key" value={p.key}
            onChange={e => update(i, 'key', e.target.value)}
            style={{ ...inputStyle, flex: 1 }} />
          <input placeholder="value" value={p.value}
            onChange={e => update(i, 'value', e.target.value)}
            style={{ ...inputStyle, flex: 1 }} />
          <button onClick={() => remove(i)}
            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 6,
                     padding: '0 8px', cursor: 'pointer', color: '#ef4444' }}>
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button onClick={add}
        style={{ display: 'flex', alignItems: 'center', gap: 6, background: `rgba(99,102,241,0.1)`,
                 border: `1px dashed ${color}`, borderRadius: 6, padding: '6px 12px',
                 color, fontSize: 12, cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
        <Plus size={12} /> Add Field
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 1. START FORM
// ═══════════════════════════════════════════════════════
export const StartForm = ({ data, onChange }) => {
  const [local, setLocal] = useState({ title: '', metadata: [], ...data });

  useEffect(() => { setLocal({ title: '', metadata: [], ...data }); }, [data]);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    setLocal(next); onChange(next);
  };

  return (
    <div className="animate-fadeIn">
      <Field label="Workflow Title">
        <Input value={local.title} onChange={e => update('title', e.target.value)}
               placeholder="e.g. Employee Onboarding" />
      </Field>
      <Field label="Metadata (optional)">
        <KVEditor pairs={local.metadata} color="#22c55e"
                  onChange={v => update('metadata', v)} />
      </Field>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 2. TASK FORM
// ═══════════════════════════════════════════════════════
export const TaskForm = ({ data, onChange }) => {
  const [local, setLocal] = useState({
    title: '', description: '', assignee: '', dueDate: '', customFields: [], ...data
  });
  useEffect(() => { setLocal({ title:'', description:'', assignee:'', dueDate:'', customFields:[], ...data }); }, [data]);

  const update = (field, val) => {
    const next = { ...local, [field]: val, label: field === 'title' ? val : local.title };
    setLocal(next); onChange(next);
  };

  return (
    <div className="animate-fadeIn">
      <Field label="Title *">
        <Input value={local.title} onChange={e => update('title', e.target.value)}
               placeholder="e.g. Collect Documents" required />
      </Field>
      <Field label="Description">
        <Textarea value={local.description} onChange={e => update('description', e.target.value)}
                  placeholder="Describe what needs to be done..." />
      </Field>
      <Field label="Assignee">
        <Input value={local.assignee} onChange={e => update('assignee', e.target.value)}
               placeholder="e.g. hr@company.com" />
      </Field>
      <Field label="Due Date">
        <Input type="date" value={local.dueDate} onChange={e => update('dueDate', e.target.value)} />
      </Field>
      <Field label="Custom Fields">
        <KVEditor pairs={local.customFields} color="#3b82f6"
                  onChange={v => update('customFields', v)} />
      </Field>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 3. APPROVAL FORM
// ═══════════════════════════════════════════════════════
export const ApprovalForm = ({ data, onChange }) => {
  const [local, setLocal] = useState({
    title: '', approverRole: 'Manager', autoApproveThreshold: 80, ...data
  });
  useEffect(() => { setLocal({ title:'', approverRole:'Manager', autoApproveThreshold:80, ...data }); }, [data]);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    setLocal(next); onChange(next);
  };

  return (
    <div className="animate-fadeIn">
      <Field label="Title">
        <Input value={local.title} onChange={e => update('title', e.target.value)}
               placeholder="e.g. Manager Approval" />
      </Field>
      <Field label="Approver Role">
        <Select value={local.approverRole} onChange={e => update('approverRole', e.target.value)}>
          {['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </Select>
      </Field>
      <Field label="Auto-Approve Threshold (%)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input type="range" min={0} max={100} value={local.autoApproveThreshold}
            onChange={e => update('autoApproveThreshold', Number(e.target.value))}
            style={{ flex: 1, accentColor: '#f59e0b' }} />
          <span style={{ fontSize: 13, color: '#f59e0b', fontFamily: 'JetBrains Mono, monospace',
                         minWidth: 36 }}>{local.autoApproveThreshold}%</span>
        </div>
      </Field>
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 4. AUTOMATED STEP FORM
// ═══════════════════════════════════════════════════════
export const AutomatedForm = ({ data, onChange, automations = [] }) => {
  const [local, setLocal] = useState({
    title: '', action: '', actionLabel: '', params: {}, ...data
  });
  useEffect(() => { setLocal({ title:'', action:'', actionLabel:'', params:{}, ...data }); }, [data]);

  const selectedAutomation = automations.find(a => a.id === local.action);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    setLocal(next); onChange(next);
  };

  const handleActionChange = (id) => {
    const auto = automations.find(a => a.id === id);
    const next = { ...local, action: id, actionLabel: auto?.label || id, params: {} };
    setLocal(next); onChange(next);
  };

  const updateParam = (key, val) => {
    const next = { ...local, params: { ...local.params, [key]: val } };
    setLocal(next); onChange(next);
  };

  return (
    <div className="animate-fadeIn">
      <Field label="Title">
        <Input value={local.title} onChange={e => update('title', e.target.value)}
               placeholder="e.g. Send Welcome Email" />
      </Field>
      <Field label="Action">
        <Select value={local.action} onChange={e => handleActionChange(e.target.value)}>
          <option value="">— Select action —</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </Select>
      </Field>
      {selectedAutomation?.params?.length > 0 && (
        <Field label="Action Parameters">
          {selectedAutomation.params.map(p => (
            <div key={p} style={{ marginBottom: 8 }}>
              <label style={{ ...labelStyle, color: '#a855f7' }}>{p}</label>
              <Input value={local.params[p] || ''} onChange={e => updateParam(p, e.target.value)}
                     placeholder={`Enter ${p}...`} />
            </div>
          ))}
        </Field>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════
// 5. END FORM
// ═══════════════════════════════════════════════════════
export const EndForm = ({ data, onChange }) => {
  const [local, setLocal] = useState({ endMessage: '', summaryFlag: true, ...data });
  useEffect(() => { setLocal({ endMessage:'', summaryFlag:true, ...data }); }, [data]);

  const update = (field, val) => {
    const next = { ...local, [field]: val };
    setLocal(next); onChange(next);
  };

  return (
    <div className="animate-fadeIn">
      <Field label="End Message">
        <Textarea value={local.endMessage} onChange={e => update('endMessage', e.target.value)}
                  placeholder="e.g. Onboarding workflow completed successfully." />
      </Field>
      <Field label="Generate Summary">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={() => update('summaryFlag', !local.summaryFlag)}
               style={{ width: 40, height: 22, borderRadius: 11, cursor: 'pointer',
                        background: local.summaryFlag ? '#ef4444' : '#2d2d4e',
                        position: 'relative', transition: 'background 0.2s' }}>
            <div style={{ position: 'absolute', top: 3, left: local.summaryFlag ? 21 : 3,
                          width: 16, height: 16, borderRadius: '50%', background: '#fff',
                          transition: 'left 0.2s' }} />
          </div>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            {local.summaryFlag ? 'Summary will be generated' : 'No summary'}
          </span>
        </div>
      </Field>
    </div>
  );
};
