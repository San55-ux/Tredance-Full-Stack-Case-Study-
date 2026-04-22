// src/App.jsx
import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWorkflowStore from './store/workflowStore';
import Sidebar from './components/Sidebar';
import NodeFormPanel from './components/NodeFormPanel';
import SandboxPanel from './components/SandboxPanel';

import StartNode     from './components/nodes/StartNode';
import TaskNode      from './components/nodes/TaskNode';
import ApprovalNode  from './components/nodes/ApprovalNode';
import AutomatedNode from './components/nodes/AutomatedNode';
import EndNode       from './components/nodes/EndNode';

import { Terminal } from 'lucide-react';

const nodeTypes = {
  startNode:     StartNode,
  taskNode:      TaskNode,
  approvalNode:  ApprovalNode,
  automatedNode: AutomatedNode,
  endNode:       EndNode,
};

export default function App() {
  const nodes          = useWorkflowStore(s => s.nodes);
  const edges          = useWorkflowStore(s => s.edges);
  const onNodesChange  = useWorkflowStore(s => s.onNodesChange);
  const onEdgesChange  = useWorkflowStore(s => s.onEdgesChange);
  const onConnect      = useWorkflowStore(s => s.onConnect);
  const addNode        = useWorkflowStore(s => s.addNode);
  const selectNode     = useWorkflowStore(s => s.selectNode);
  const clearSelection = useWorkflowStore(s => s.clearSelection);
  const deleteNode     = useWorkflowStore(s => s.deleteNode);

  const [sandboxOpen, setSandboxOpen]           = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type || !reactFlowInstance) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    addNode(type, position);
  }, [reactFlowInstance, addNode]);

  const onNodeClick  = useCallback((_, node) => { selectNode(node.id); }, [selectNode]);
  const onPaneClick  = useCallback(() => { clearSelection(); }, [clearSelection]);

  const onKeyDown = useCallback((e) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') &&
        e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      const sel = nodes.find(n => n.selected);
      if (sel) deleteNode(sel.id);
    }
  }, [nodes, deleteNode]);

  return (
    <div style={{ display:'flex', height:'100vh', width:'100vw', background:'#0a0a0f' }}
         onKeyDown={onKeyDown} tabIndex={0}>

      <Sidebar />

      <div style={{ flex:1, position:'relative' }}>

        {/* Top bar */}
        <div style={{
          position:'absolute', top:0, left:0, right:0, zIndex:10,
          padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between',
          background:'linear-gradient(180deg,rgba(10,10,15,0.95) 0%,transparent 100%)',
          pointerEvents:'none',
        }}>
          <span style={{ fontSize:11, color:'#334155', fontFamily:'JetBrains Mono,monospace', pointerEvents:'all' }}>
            {nodes.length} nodes · {edges.length} connections
          </span>
          <button onClick={() => setSandboxOpen(v => !v)}
            style={{
              pointerEvents:'all', display:'flex', alignItems:'center', gap:8,
              background: sandboxOpen ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              border:'1px solid rgba(99,102,241,0.4)', borderRadius:8, padding:'7px 14px',
              color:'#818cf8', fontSize:12, cursor:'pointer',
              fontFamily:'DM Sans,sans-serif', fontWeight:600, transition:'all 0.15s',
            }}>
            <Terminal size={13} />
            {sandboxOpen ? 'Close Sandbox' : 'Test Workflow'}
          </button>
        </div>

        <ReactFlow
          nodes={nodes} edges={edges}
          onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
          onConnect={onConnect} onNodeClick={onNodeClick}
          onPaneClick={onPaneClick} onInit={setReactFlowInstance}
          onDrop={onDrop} onDragOver={onDragOver}
          nodeTypes={nodeTypes} fitView deleteKeyCode={null}
          style={{ background:'#0a0a0f' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e1e30" />
          <Controls />
          <MiniMap
            nodeColor={n => ({ startNode:'#22c55e', taskNode:'#3b82f6',
              approvalNode:'#f59e0b', automatedNode:'#a855f7', endNode:'#ef4444' }[n.type] || '#6366f1')}
            maskColor="rgba(10,10,15,0.85)"
          />
        </ReactFlow>

        {nodes.length === 0 && (
          <div style={{
            position:'absolute', top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            textAlign:'center', pointerEvents:'none', zIndex:5,
          }}>
            <div style={{ fontSize:36, marginBottom:10, opacity:0.3 }}>⬡</div>
            <div style={{ fontSize:16, fontWeight:600, color:'#334155', marginBottom:6 }}>Canvas is empty</div>
            <div style={{ fontSize:12, color:'#1e293b' }}>Drag nodes from the left panel to get started</div>
          </div>
        )}

        {sandboxOpen && <SandboxPanel onClose={() => setSandboxOpen(false)} />}
      </div>

      <NodeFormPanel />
    </div>
  );
}
