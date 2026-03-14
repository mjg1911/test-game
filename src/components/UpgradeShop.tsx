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
    <div className="glass-panel">
      <h3 className="heading-section">Upgrade Shop</h3>
      
      <div style={{ marginBottom: 'var(--space-lg)' }}>
        <h4 className="heading-label">Crop Unlocks</h4>
        {nextLockedCrop ? (
          <div style={{ marginBottom: 'var(--space-sm)', padding: 'var(--space-sm)', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)' }}>
            <div><strong>{nextLockedCrop.name}</strong></div>
            <button 
              className="btn btn-primary"
              onClick={() => handleUnlockCrop(nextLockedCrop)}
              disabled={state.resources.money < getCropUnlockCost(nextLockedCrop.crop)}
              style={{ 
                marginTop: 'var(--space-xs)',
                opacity: state.resources.money >= getCropUnlockCost(nextLockedCrop.crop) ? 1 : 0.5,
              }}
            >
              Unlock (${formatMoney(getCropUnlockCost(nextLockedCrop.crop))})
            </button>
          </div>
        ) : (
          <div style={{ color: 'var(--accent-success)', padding: 'var(--space-sm)' }}>All crops unlocked!</div>
        )}
      </div>
      
      <div>
        <h4 className="heading-label">Farm Upgrades</h4>
        {Object.entries(UPGRADE_CONFIG).map(([key, config]) => {
          const currentLevel = state.upgrades[key as keyof typeof state.upgrades]?.level || 0;
          const cost = config.baseCost * Math.pow(2, currentLevel);
          const isMaxed = currentLevel >= config.maxLevel;
          return (
            <div key={key} style={{ marginBottom: 'var(--space-md)' }}>
              <div><strong>{key}</strong> (Level {currentLevel}/{config.maxLevel})</div>
              <div style={{ fontSize: 'var(--space-sm)', color: 'var(--text-muted)' }}>{config.description}</div>
              <button 
                className="btn btn-primary"
                onClick={() => handleBuyUpgrade(key)}
                disabled={isMaxed || state.resources.money < cost}
                style={{ 
                  marginTop: 'var(--space-xs)',
                  opacity: isMaxed ? 0.5 : state.resources.money >= cost ? 1 : 0.5,
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
