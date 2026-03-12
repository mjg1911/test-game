import CropField from './components/CropField';
import { useState } from 'react';
import { useGameStateContext } from './providers/GameStateProvider';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ResourcePanel from './components/ResourcePanel';
import AnimalPen from './components/AnimalPen';
import UpgradeShop from './components/UpgradeShop';

function App() {
  const [count, setCount] = useState(0)

  const { state, dispatch } = useGameStateContext();
  const [importError, setImportError] = useState('');

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (
          parsed && typeof parsed === 'object' &&
          parsed.crops && parsed.animals && parsed.resources && parsed.upgrades
        ) {
          dispatch({ type: 'IMPORT_STATE', state: parsed });
          setImportError('');
        } else {
          setImportError('File has invalid game state structure.');
        }
      } catch {
        setImportError('Could not parse JSON.');
      }
    };
    reader.readAsText(file);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'idleFarmGameState.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <ResourcePanel />
      <CropField />
      <AnimalPen />
<UpgradeShop />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* Export Game State feature */}
      <div style={{ marginTop: 32 }}>
        <button onClick={handleExport}>Export Game State (JSON)</button>
        <label style={{ display: 'block', marginTop: 16 }}>
          Import Game State (JSON):
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ marginLeft: 8 }}
          />
        </label>
        {importError && <div style={{ color: 'red', marginTop: 8 }}>{importError}</div>}
      </div>
      {/* Atomic pixel art canvas for idle farm */}
      <div style={{ marginTop: 32 }}>
        <h2>Atomic Pixel Art Farm Canvas Demo</h2>
        <PixelArtCanvas />
      </div>
    </>
  )
}

export default App

  const [count, setCount] = useState(0)

  const { state, dispatch } = useGameStateContext();
  const [importError, setImportError] = useState('');

  function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (
          parsed && typeof parsed === 'object' &&
          parsed.crops && parsed.animals && parsed.resources && parsed.upgrades
        ) {
          dispatch({ type: 'IMPORT_STATE', state: parsed });
          setImportError('');
        } else {
          setImportError('File has invalid game state structure.');
        }
      } catch {
        setImportError('Could not parse JSON.');
      }
    };
    reader.readAsText(file);
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'idleFarmGameState.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <ResourcePanel />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      {/* Export Game State feature */}
      <div style={{ marginTop: 32 }}>
        <button onClick={handleExport}>Export Game State (JSON)</button>
        <label style={{ display: 'block', marginTop: 16 }}>
          Import Game State (JSON):
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ marginLeft: 8 }}
          />
        </label>
        {importError && <div style={{ color: 'red', marginTop: 8 }}>{importError}</div>}
      </div>
      {/* Atomic pixel art canvas for idle farm */}
      <div style={{ marginTop: 32 }}>
        <h2>Atomic Pixel Art Farm Canvas Demo</h2>
        <PixelArtCanvas />
      </div>
    </>
  )
}

export default App
