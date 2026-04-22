// src/store/workflowStore.js
import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

let nodeIdCounter = 1;
export const generateNodeId = () => `node_${nodeIdCounter++}`;

const useWorkflowStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,

  // ── Node / Edge change handlers (React Flow callbacks) ──
  onNodesChange: (changes) =>
    set(s => ({ nodes: applyNodeChanges(changes, s.nodes) })),

  onEdgesChange: (changes) =>
    set(s => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set(s => ({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#6366f1' } }, s.edges) })),

  // ── Add a new node ──
  addNode: (type, position) => {
    const defaults = {
      startNode:     { title: 'Workflow Start', metadata: [] },
      taskNode:      { label: 'New Task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
      approvalNode:  { label: 'Approval', title: 'Approval Step', approverRole: 'Manager', autoApproveThreshold: 80 },
      automatedNode: { label: 'Automated Step', title: 'Automated Step', action: '', actionLabel: '', params: {} },
      endNode:       { label: 'End', endMessage: 'Workflow completed successfully.', summaryFlag: true },
    };
    const newNode = {
      id:       generateNodeId(),
      type,
      position,
      data:     defaults[type] || { label: type },
    };
    set(s => ({ nodes: [...s.nodes, newNode] }));
  },

  // ── Select a node for editing ──
  selectNode: (nodeId) => {
    const node = get().nodes.find(n => n.id === nodeId) || null;
    set({ selectedNode: node });
  },

  clearSelection: () => set({ selectedNode: null }),

  // ── Update node data from form ──
  updateNodeData: (nodeId, newData) =>
    set(s => ({
      nodes: s.nodes.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...newData } } : n
      ),
      selectedNode: s.selectedNode?.id === nodeId
        ? { ...s.selectedNode, data: { ...s.selectedNode.data, ...newData } }
        : s.selectedNode,
    })),

  // ── Delete selected node ──
  deleteNode: (nodeId) =>
    set(s => ({
      nodes:        s.nodes.filter(n => n.id !== nodeId),
      edges:        s.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      selectedNode: s.selectedNode?.id === nodeId ? null : s.selectedNode,
    })),

  // ── Export / Import ──
  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges, selectedNode: null });
      return true;
    } catch { return false; }
  },
}));

export default useWorkflowStore;
