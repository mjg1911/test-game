import CropField from './components/CropField';
import { useState } from 'react';
import { useGameStateContext } from './providers/GameStateProvider';
import './pixelTheme.css';
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

  return (
    <div className="pixel-container">
      <h1 className="pixel-title">🌾 IDLE FARM 🌾</h1>
      <ResourcePanel />
      
      <div className="pixel-tabs">
        <button 
          className={`pixel-tab ${activeTab === 'crops' ? 'active' : ''}`}
          onClick={() => setActiveTab('crops')}
        >
          🌱 Crops
        </button>
        <button 
          className={`pixel-tab ${activeTab === 'animals' ? 'active' : ''}`}
          onClick={() => setActiveTab('animals')}
        >
          🐄 Animals
        </button>
        <button 
          className={`pixel-tab ${activeTab === 'upgrades' ? 'active' : ''}`}
          onClick={() => setActiveTab('upgrades')}
        >
          ⬆️ Upgrades
        </button>
        <button 
          className={`pixel-tab ${activeTab === 'automation' ? 'active' : ''}`}
          onClick={() => setActiveTab('automation')}
        >
          ⚙️ Auto
        </button>
      </div>

      {activeTab === 'crops' && (
        <div className="pixel-panel pixel-panel-crops">
          <h3 className="pixel-panel-title">🌱 CROP FIELD</h3>
          <CropField />
        </div>
      )}

      {activeTab === 'animals' && (
        <div className="pixel-panel pixel-panel-animals">
          <h3 className="pixel-panel-title">🐄 ANIMAL PEN</h3>
          <AnimalPen />
        </div>
      )}

      {activeTab === 'upgrades' && (
        <div className="pixel-panel">
          <h3 className="pixel-panel-title">⬆️ UPGRADE SHOP</h3>
          <UpgradeShop />
        </div>
      )}

      {activeTab === 'automation' && (
        <div className="pixel-panel">
          <h3 className="pixel-panel-title">⚙️ AUTOMATION</h3>
          <AutomationControls />
        </div>
      )}

      <div className="pixel-panel">
        <h3 className="pixel-panel-title">🎨 FARM MAP</h3>
        <PixelArtCanvas />
      </div>
      
      <div className="pixel-footer">
        <button className="pixel-button secondary" onClick={() => dispatch({ type: 'RESET' })}>
          Reset Game
        </button>
        <button className="pixel-button secondary" onClick={handleExport}>
          Export Save
        </button>
        <label className="pixel-button secondary" style={{ display: 'inline-block', cursor: 'pointer' }}>
          Import Save
          <input
            type="file"
            accept="application/json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />
        </label>
      </div>
      {importError && <div style={{ color: '#ff6b6b', textAlign: 'center', marginTop: 12, fontSize: 8 }}>{importError}</div>}
    </div>
  );
}

export default App;
