// src/api/mockApi.js
// Simulates a real backend API with artificial delay

const delay = (ms = 400) => new Promise(res => setTimeout(res, ms));

// Mock automations available for AutomatedStep nodes
const AUTOMATIONS = [
  { id: 'send_email',     label: 'Send Email',         params: ['to', 'subject', 'body'] },
  { id: 'generate_doc',  label: 'Generate Document',   params: ['template', 'recipient'] },
  { id: 'send_slack',    label: 'Send Slack Message',  params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket',  params: ['project', 'summary'] },
  { id: 'update_hrms',   label: 'Update HRMS Record',  params: ['employee_id', 'field', 'value'] },
  { id: 'schedule_meet', label: 'Schedule Meeting',     params: ['attendees', 'title', 'duration'] },
];

// GET /automations
export const getAutomations = async () => {
  await delay(300);
  return [...AUTOMATIONS];
};

// Simulate one node execution
const simulateNode = (node, index) => {
  const base = { nodeId: node.id, label: node.data?.label || node.type, index };
  switch (node.type) {
    case 'startNode':
      return { ...base, status: 'completed', message: `▶ Workflow started: "${node.data?.title || 'Untitled'}"` };
    case 'taskNode':
      return { ...base, status: 'completed', message: `✅ Task assigned to ${node.data?.assignee || 'Unassigned'}: "${node.data?.title}"` };
    case 'approvalNode':
      const approved = Math.random() > 0.2; // 80% auto-approve in simulation
      return { ...base, status: approved ? 'approved' : 'rejected', message: approved
        ? `✅ Approved by ${node.data?.approverRole || 'Manager'}`
        : `❌ Rejected — escalating to next approver` };
    case 'automatedNode':
      return { ...base, status: 'completed', message: `⚡ Executed: ${node.data?.actionLabel || node.data?.action || 'Automation'}` };
    case 'endNode':
      return { ...base, status: 'completed', message: `🏁 Workflow complete. ${node.data?.endMessage || ''}` };
    default:
      return { ...base, status: 'completed', message: `Processed node: ${node.id}` };
  }
};

// Validate workflow graph
const validateWorkflow = (nodes, edges) => {
  const errors = [];
  const startNodes = nodes.filter(n => n.type === 'startNode');
  const endNodes   = nodes.filter(n => n.type === 'endNode');

  if (startNodes.length === 0) errors.push('❌ No Start Node found. Workflow must begin with a Start Node.');
  if (startNodes.length > 1)  errors.push('❌ Multiple Start Nodes detected. Only one is allowed.');
  if (endNodes.length === 0)  errors.push('❌ No End Node found. Workflow must end with an End Node.');

  // Check for disconnected nodes
  const connectedIds = new Set([
    ...edges.map(e => e.source),
    ...edges.map(e => e.target),
  ]);
  nodes.forEach(n => {
    if (!connectedIds.has(n.id) && nodes.length > 1)
      errors.push(`⚠️ Node "${n.data?.label || n.type}" (${n.id}) is disconnected.`);
  });

  return errors;
};

// Topological sort for execution order
const topoSort = (nodes, edges) => {
  const adj   = {};
  const inDeg = {};
  nodes.forEach(n => { adj[n.id] = []; inDeg[n.id] = 0; });
  edges.forEach(e => { adj[e.source]?.push(e.target); inDeg[e.target] = (inDeg[e.target] || 0) + 1; });

  const queue  = nodes.filter(n => inDeg[n.id] === 0).map(n => n.id);
  const sorted = [];

  while (queue.length) {
    const id = queue.shift();
    const node = nodes.find(n => n.id === id);
    if (node) sorted.push(node);
    (adj[id] || []).forEach(nid => { inDeg[nid]--; if (inDeg[nid] === 0) queue.push(nid); });
  }

  return sorted;
};

// POST /simulate
export const simulateWorkflow = async ({ nodes, edges }) => {
  await delay(600);

  const errors = validateWorkflow(nodes, edges);
  if (errors.length) return { success: false, errors, steps: [] };

  const ordered = topoSort(nodes, edges);
  const steps   = [];

  for (let i = 0; i < ordered.length; i++) {
    await delay(150); // stagger feel
    steps.push(simulateNode(ordered[i], i + 1));
  }

  return { success: true, errors: [], steps };
};
