// Game Configuration - Easy to modify for balance
const CONFIG = {
    GAME_DURATION: 30000, // 30 seconds
    PLAYER_SPEED: 8,
    ITEM_SPAWN_RATE: 0.035, // Increased from 0.02 to 0.035 (3.5%)
    ITEM_FALL_SPEED: 3,
    POWER_UP_CHANCE: 0.15,
    GOLDEN_CAN_CHANCE: 0.15, // Increased from 0.1 to 0.15 (15%)
    COMPETITOR_CHANCE: 0.2,
    COMBO_THRESHOLD: 3,
    SCORING: {
        NORMAL_CAN: 10,
        GOLDEN_CAN: 50,
        COMPETITOR_PENALTY: -20,
        COMBO_MULTIPLIER: 1.5
    },
    POWER_UPS: {
        SPEEDBOOST_DURATION: 5000,
        MULTIPLYPOINTS_DURATION: 5000
    }
};