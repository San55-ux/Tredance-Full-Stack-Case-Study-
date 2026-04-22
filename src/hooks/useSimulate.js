// src/hooks/useSimulate.js
import { useState } from 'react';
import { simulateWorkflow } from '../api/mockApi';

const useSimulate = () => {
  const [running,  setRunning]  = useState(false);
  const [result,   setResult]   = useState(null);  // { success, errors, steps }
  const [visSteps, setVisSteps] = useState([]);     // progressively revealed steps

  const run = async (nodes, edges) => {
    setRunning(true);
    setResult(null);
    setVisSteps([]);

    const res = await simulateWorkflow({ nodes, edges });

    if (!res.success) {
      setResult(res);
      setRunning(false);
      return;
    }

    // Reveal steps one by one for dramatic effect
    for (let i = 0; i < res.steps.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setVisSteps(prev => [...prev, res.steps[i]]);
    }

    setResult(res);
    setRunning(false);
  };

  const reset = () => { setResult(null); setVisSteps([]); };

  return { run, running, result, visSteps, reset };
};

export default useSimulate;
