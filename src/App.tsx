import CropField from './components/CropField';
import { useState } from 'react';
import { useGameStateContext } from './providers/GameStateProvider';
import './App.css';
import ResourcePanel from './components/ResourcePanel';
import AnimalPen from './components/AnimalPen';
import UpgradeShop from './components/UpgradeShop';
import AutomationControls from './components/AutomationControls';
import PixelArtCanvas from './components/PixelArtCanvas';

function App() {
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
          parsed.crops && typeof parsed.crops === 'object' &&
          parsed.animals && typeof parsed.animals === 'object' &&
          parsed.resources && typeof parsed.resources === 'object' &&
          parsed.upgrades && typeof parsed.upgrades === 'object'
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1em', fontFamily: 'monospace' }}>
      <h1 style={{ textAlign: 'center', color: '#4a7c23' }}>🌾 Idle Farm</h1>
      <ResourcePanel />
      <AutomationControls />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1em', marginTop: '1em' }}>
        <CropField />
        <AnimalPen />
      </div>
      <div style={{ marginTop: '1em' }}>
        <UpgradeShop />
      </div>
      <div style={{ marginTop: '1em', textAlign: 'center' }}>
        <PixelArtCanvas />
      </div>
      <div style={{ marginTop: '2em', textAlign: 'center' }}>
        <button onClick={handleExport} style={{ marginRight: '0.5em' }}>
          Export Save
        </button>
        <label style={{ display: 'inline-block' }}>
          Import Save
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ marginLeft: 8 }}
          />
        </label>
        {importError && <div style={{ color: 'red', marginTop: 8 }}>{importError}</div>}
      </div>
    </div>
  );
}

export default App;
