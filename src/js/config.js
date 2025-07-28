// Game Configuration - Easy to modify for balance
const CONFIG = {
    GAME_DURATION: 30000, // 30 seconds
    PLAYER_SPEED: 8,
    ITEM_SPAWN_RATE: 0.040, // Increased from 0.02 to 0.040 (4%)
    ITEM_FALL_SPEED: 4,
    COMBO_THRESHOLD: 3,
    SCORING: {
        COMBO_MULTIPLIER: 1.5
    },
    POWER_UPS: {
        SPEEDBOOST_DURATION: 5000,
        MULTIPLYPOINTS_DURATION: 5000
    }
};

// Product Configuration - All 14 Naraya products with balanced spawn rates
const PRODUCT_CONFIG = {
    products: [
        // Common drinks (higher spawn rate, lower points)
        { id: 'canCincau', image: 'naraya_canCincau.png', weight: 12, points: 10, type: 'normal', width: 100, height: 100 },
        { id: 'canSoyabean', image: 'naraya_canSoyabean.png', weight: 12, points: 10, type: 'normal', width: 100, height: 100 },
        { id: 'canTehBunga', image: 'naraya_canTehBunga.png', weight: 12, points: 10, type: 'normal', width: 100, height: 100 },
        
        // Common snacks (medium spawn rate, medium points)
        { id: 'butterRing', image: 'naraya_butterRing.png', weight: 8, points: 15, type: 'normal', width: 100, height: 100 },
        { id: 'cheeseCookies', image: 'naraya_cheeseCookies.png', weight: 8, points: 15, type: 'normal', width: 100, height: 100 },
        { id: 'oat_cookies', image: 'naraya_oat_cookies.png', weight: 8, points: 15, type: 'normal', width: 100, height: 100 },
        { id: 'nutsCrisp', image: 'naraya_nutsCrisp.png', weight: 8, points: 15, type: 'normal', width: 100, height: 100 },
        
        // Premium products (lower spawn rate, higher points)
        { id: 'chocholateCream', image: 'naraya_chocholateCream.png', weight: 5, points: 25, type: 'premium', width: 100, height: 100 },
        { id: 'marshmallow', image: 'naraya_marshmallow.png', weight: 5, points: 25, type: 'premium', width: 100, height: 100 },
        { id: 'oatChocho', image: 'naraya_oatChocho.png', weight: 5, points: 25, type: 'premium', width: 100, height: 100 },
        { id: 'oatChocho2', image: 'naraya_oatChocho2.png', weight: 5, points: 25, type: 'premium', width: 100, height: 100 },
        { id: 'narabis', image: 'naraya_narabis.png', weight: 5, points: 25, type: 'premium', width: 100, height: 100 },

        // Golden rare products (very low spawn rate, very high points)
        { id: 'myChocho', image: 'naraya_myChocho.png', weight: 2, points: 50, type: 'golden', width: 100, height: 100 },
        { id: 'plumCandy', image: 'naraya_plumCandy.png', weight: 2, points: 50, type: 'golden', width: 100, height: 100 }
    ],
    
    powerups: [
        { id: 'speedBoost', weight: 5, type: 'powerup', width: 80, height: 80 },
        { id: 'multiplyPoints', weight: 5, type: 'powerup', width: 80, height: 80 }
    ],
    
    // Helper function to get weighted random selection
    getRandomProduct() {
        const allItems = [...this.products, ...this.powerups];
        const totalWeight = allItems.reduce((sum, item) => sum + item.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const item of allItems) {
            random -= item.weight;
            if (random <= 0) return item;
        }
        return this.products[0]; // Fallback
    },
    
    // Get total weight for probability calculations
    getTotalWeight() {
        return [...this.products, ...this.powerups].reduce((sum, item) => sum + item.weight, 0);
    }
};