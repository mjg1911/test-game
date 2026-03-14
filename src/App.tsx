import CropField from './components/CropField';
import { useState } from 'react';
import { useGameStateContext } from './providers/GameStateProvider';
import './brmbleTheme.css';
import ResourcePanel from './components/ResourcePanel';
import AnimalPen from './components/AnimalPen';
import UpgradeShop from './components/UpgradeShop';
import AutomationControls from './components/AutomationControls';
import PixelArtCanvas from './components/PixelArtCanvas';

type TabType = 'crops' | 'animals' | 'upgrades' | 'automation';

function App() {
  const { state, dispatch } = useGameStateContext();
  const [activeTab, setActiveTab] = useState<TabType>('crops');
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

  function handleReset() {
    if (confirm('Are you sure you want to reset the game? All progress will be lost!')) {
      dispatch({ type: 'RESET' });
    }
  }

  return (
    <div className="app">
      <h1 className="heading-title">🌾 Idle Farm</h1>
      <ResourcePanel />
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'crops' ? 'active' : ''}`}
          onClick={() => setActiveTab('crops')}
        >
          🌱 Crops
        </button>
        <button 
          className={`tab ${activeTab === 'animals' ? 'active' : ''}`}
          onClick={() => setActiveTab('animals')}
        >
          🐄 Animals
        </button>
        <button 
          className={`tab ${activeTab === 'upgrades' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          ⬆️ Upgrades
        </button>
        <button 
          className={`tab ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          ⚙️ Auto
        </button>
      </div>

      {activeTab === 'crops' && (
        <div className="glass-panel pixel-panel-crops">
          <h3 className="heading-section">🌱 Crop Field</h3>
          <CropField />
        </div>
      )}

      {activeTab === 'animals' && (
        <div className="glass-panel pixel-panel-animals">
          <h3 className="heading-section">🐄 Animal Pen</h3>
          <AnimalPen />
        </div>
      )}

      {activeTab === 'upgrades' && (
        <div className="glass-panel">
          <h3 className="heading-section">⬆️ Upgrade Shop</h3>
          <UpgradeShop />
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="glass-panel">
          <h3 className="heading-section">⚙️ Automation</h3>
          <AutomationControls />
        </div>
      )}

      <div className="glass-panel">
        <h3 className="heading-section">🎨 Farm Map</h3>
        <PixelArtCanvas />
      </div>
      
      <div className="pixel-footer">
        <button className="btn btn-secondary" onClick={handleExport}>
          Export Save
        </button>
        <label className="btn btn-secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
          Import Save
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
        <button className="btn btn-danger" onClick={handleReset}>
          Reset Game
        </button>
      </div>
      {importError && <div style={{ color: 'var(--accent-danger)', textAlign: 'center', marginTop: 'var(--space-sm)' }}>{importError}</div>}
    </div>
  );
}

export default App;
