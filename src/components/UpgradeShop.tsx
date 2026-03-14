import { useGameStateContext, getCropUnlockCost, isCropUnlocked } from '../providers/GameStateProvider';

const CROP_UNLOCKS = [
  { crop: 'potatoes', name: 'Potatoes' },
  { crop: 'sugarcane', name: 'Sugarcane' },
  { crop: 'cotton', name: 'Cotton' },
  { crop: 'coffeeBeans', name: 'Coffee Beans' },
  { crop: 'cocoaPods', name: 'Cocoa Pods' },
  { crop: 'goldenApples', name: 'Golden Apples' },
  { crop: 'starfruit', name: 'Starfruit' },
  { crop: 'moonMelons', name: 'Moon Melons' },
  { crop: 'etherealLotus', name: 'Ethereal Lotus' },
  { crop: 'chronoVines', name: 'Chrono-Vines' },
  { crop: 'voidBerries', name: 'Void Berries' },
];

const UPGRADE_CONFIG = {
  fertilizer: { baseCost: 100, description: 'Increases crop yield by 50%', maxLevel: 5 },
  autoHarvester: { baseCost: 500, description: 'Auto-harvests crops when ready', maxLevel: 3 }
};

const formatMoney = (n: number) => {
  if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toString();
};

export default function UpgradeShop() {
  const { state, dispatch } = useGameStateContext();

  const handleBuyUpgrade = (upgrade: string) => {
    const config = UPGRADE_CONFIG[upgrade as keyof typeof UPGRADE_CONFIG];
    if (!config) return;
    
    const currentLevel = state.upgrades[upgrade as keyof typeof state.upgrades]?.level || 0;
    const cost = config.baseCost * Math.pow(2, currentLevel);

    if (currentLevel >= config.maxLevel) {
      alert('Max level reached!');
      return;
    }

    if (state.resources.money >= cost) {
      dispatch({ 
        type: 'APPLY_UPGRADE', 
        upgrade, 
        cost
      });
    } else {
      alert('Not enough money!');
    }
  };

  const handleUnlockCrop = (cropUnlock: typeof CROP_UNLOCKS[0]) => {
    if (isCropUnlocked(cropUnlock.crop, state)) {
      return;
    }
    
    const cost = getCropUnlockCost(cropUnlock.crop);
    
    if (state.resources.money >= cost) {
      dispatch({ type: 'UNLOCK_CROP', crop: cropUnlock.crop });
      dispatch({ type: 'APPLY_UPGRADE', upgrade: 'unlock', cost });
    } else {
      alert('Not enough money!');
    }
  };

  // Find the next crop to unlock
  const getNextLockedCrop = () => {
    for (const cropUnlock of CROP_UNLOCKS) {
      if (!isCropUnlocked(cropUnlock.crop, state)) {
        return cropUnlock;
      }
    }
    return null;
  };

  const nextLockedCrop = getNextLockedCrop();

  return (
    <div style={{ padding: '1em', border: '1px solid #9932cc', background: '#2d1a3d', color: '#fff', fontFamily: 'monospace', borderRadius: 6 }}>
      <h3>Upgrade Shop</h3>
      
      <div style={{ marginBottom: '1.5em' }}>
        <h4 style={{ color: '#bb8fce', marginBottom: '0.5em' }}>Crop Unlocks</h4>
        {nextLockedCrop ? (
          <div style={{ marginBottom: '0.75em', padding: '0.5em', background: '#3d2a4d', borderRadius: 4 }}>
            <div><strong>{nextLockedCrop.name}</strong></div>
            <button 
              onClick={() => handleUnlockCrop(nextLockedCrop)}
              disabled={state.resources.money < getCropUnlockCost(nextLockedCrop.crop)}
              style={{ 
                marginTop: 4,
                background: state.resources.money >= getCropUnlockCost(nextLockedCrop.crop) ? '#9b59b6' : '#555',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: 4,
                cursor: state.resources.money >= getCropUnlockCost(nextLockedCrop.crop) ? 'pointer' : 'not-allowed'
              }}
            >
              Unlock (${formatMoney(getCropUnlockCost(nextLockedCrop.crop))})
            </button>
          </div>
        ) : (
          <div style={{ color: '#4a4', padding: '0.5em' }}>All crops unlocked!</div>
        )}
      </div>
      
      <div>
        <h4 style={{ color: '#bb8fce', marginBottom: '0.5em' }}>Farm Upgrades</h4>
        {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
          const currentLevel = state.upgrades[key as keyof typeof state.upgrades]?.level || 0;
          const cost = config.baseCost * Math.pow(2, currentLevel);
          const isMaxed = currentLevel >= config.maxLevel;
          return (
            <div key={key} style={{ marginBottom: '1em' }}>
              <div><strong>{key}</strong> (Level {currentLevel}/{config.maxLevel})</div>
              <div style={{ fontSize: '0.8em', color: '#aaa' }}>{config.description}</div>
              <button 
                onClick={() => handleBuyUpgrade(key)}
                disabled={isMaxed || state.resources.money < cost}
                style={{ 
                  marginTop: 4,
                  background: isMaxed ? '#4a4' : state.resources.money >= cost ? '#9b59b6' : '#555',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: isMaxed || state.resources.money < cost ? 'not-allowed' : 'pointer'
                }}
              >
                {isMaxed ? 'MAXED' : `Buy ($${formatMoney(cost)})`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
