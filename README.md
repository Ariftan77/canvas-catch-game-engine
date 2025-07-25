📋 Project Overview
Game Name: Naraya Rain - Catch the Refreshment!
Type: Browser-based falling object catching game
Platform: Web (HTML5 Canvas)
Event: Grand opening marketing game
Location: Batam, Indonesia
Duration: 2 weeks (starting August 15, 2025)
Expected Daily Players: 100-200
Developer: Solo development
🎮 Game Concept
Enhanced Flappy Bird-style game where players catch falling Naraya drink cans while avoiding competitor products. Features power-ups, combo system, and competitive leaderboard for event engagement.
🛠️ Technical Architecture
Core Technologies

Frontend: Vanilla JavaScript (ES6+), HTML5 Canvas, CSS3
Architecture: Entity Component System (lightweight)
Performance: Object pooling, RequestAnimationFrame, 60fps target
Storage: localStorage for leaderboard persistence
Audio: Web Audio API with procedural sound synthesis

Development Environment

Primary: macOS MacBook Air M1
Target: Windows computers at event
Browser: Modern browsers with HTML5 Canvas support

Key Technical Features

Real-time collision detection (AABB)
Particle system for visual effects
State machine for game phases
Modular audio system with fallbacks
Responsive design for various screen sizes

📅 Development Phases
✅ Phase 1: Core Game Engine (COMPLETE)

Basic falling mechanics
Player controls (mouse + keyboard)
Collision detection system
Score system with timer (30 seconds)
Game loop architecture

✅ Phase 2: Enhanced Gameplay (COMPLETE)

Multiple item types (normal, golden, competitor, power-ups)
Combo system (3+ consecutive catches = 1.5x bonus)
Power-up system (2X Multiplier, Speed Boost)
Particle effects and audio feedback
Persistent leaderboard with localStorage

🔄 Phase 3: Asset Integration (90% COMPLETE)

✅ Power-up visual overhaul (3D "2X" text, clock design)
✅ Admin reset security system (code: "reset")
✅ UI enhancements (live power-up display)
✅ Game balance optimization (3.5% spawn rate, 15% golden cans)
🔲 PENDING: Replace placeholder graphics with Naraya assets

🔲 Phase 4: Polish & Balance

Performance testing on Windows target hardware
Visual polish and animation improvements
Final game balance adjustments
Mobile responsiveness fine-tuning

🔲 Phase 5: Testing & Debug

Cross-browser compatibility testing
Performance validation on target systems
User experience testing
Bug fixes and edge case handling

🔲 Phase 6: Deployment Preparation

Code optimization and minification
Asset optimization
Installation documentation
Admin control verification

🔲 Phase 7: Demo & Revisions

Stakeholder demo presentation
Feedback integration
Final revisions and testing
Go-live preparation

🎯 Game Mechanics
Gameplay Loop

Duration: 30 seconds per session
Objective: Catch falling Naraya cans for points
Controls: Arrow keys or mouse movement

Scoring System

Normal Naraya Cans: 10 points
Golden Naraya Cans: 50 points (15% spawn rate)
Competitor Products: -20 points (avoid these)
Combo Bonus: 1.5x multiplier for 3+ consecutive catches

Power-Up System

2X Multiplier: Double points for 5 seconds
Speed Boost: Double basket movement speed for 5 seconds
Visual Feedback: Live countdown display beside score

Item Spawn Configuration
javascriptITEM_SPAWN_RATE: 3.5%        // ~25-30 items per game
GOLDEN_CAN_CHANCE: 15%       // ~4-5 golden cans per game  
POWER_UP_CHANCE: 15%         // Power-ups available
COMPETITOR_CHANCE: 20%       // Items to avoid
🎨 Asset Requirements
Required Naraya Assets

Naraya Can Sprite: PNG/JPG format, transparent background preferred
Golden Naraya Can: Special variant of main product
Naraya Logo: For branding integration
Competitor Product Images: Products to avoid (client-specified)

Asset Specifications

Format: PNG (preferred) or JPG
Can Dimensions: 40x60 pixels (normal), 35x55 pixels (competitor)
Background: Transparent PNG recommended
Quality: High resolution for crisp display

Brand Integration

Primary Colors: Naraya red theme (#DC143C, #8B0000)
Accent Colors: Gold (#FFD700) for UI highlights
Typography: Arial font family (web-safe)

🚀 Deployment Methods
Method 1: Local Event Deployment

File: Single HTML file with embedded assets
Requirements: Modern web browser
Setup: Copy file to event computers
Advantages: Offline capable, no internet dependency

Method 2: Web Deployment (Demo)

Platform: Railway + Docker container
Purpose: Remote demonstration and testing
Access: Public URL for stakeholder review

Method 3: Standalone Executable

Technology: Electron packaging
Output: Native .exe file for Windows
Features: Desktop integration, auto-updates possible

🔧 Configuration & Admin Controls
Game Balance Settings
javascriptGAME_DURATION: 30 seconds
PLAYER_SPEED: 8 (16 with speed boost)
ITEM_FALL_SPEED: 3
COMBO_THRESHOLD: 3 consecutive catches
Admin Features

Leaderboard Reset: Security code required ("reset")
Reset Locations: Main menu + leaderboard modal
Score Management: Top 10 persistent storage
Event Control: Easy score clearing between sessions

🏆 Leaderboard System
Features

Capacity: Top 10 scores stored
Persistence: localStorage (survives browser restart)
Display: Real-time updates with rank, name, score
Names: Optional input, defaults to "No Name"
Reset: Admin-controlled with security verification

Expected Score Ranges

Beginner Players: 50-200 points
Average Players: 200-600 points
Skilled Players: 800-1200+ points
Perfect Play Potential: 1500+ points

🧪 Testing Requirements
Performance Targets

Frame Rate: Consistent 60fps
Load Time: <3 seconds
Memory Usage: Stable (no memory leaks)
Compatibility: Chrome, Firefox, Safari, Edge

User Experience Goals

Learning Curve: <30 seconds to understand
Accessibility: Playable by all age groups
Responsiveness: No input lag
Visual Clarity: Clear item distinction

📊 Success Metrics
Technical Metrics

Zero game crashes during event
Consistent performance across all computers
Leaderboard data persistence
Smooth 60fps gameplay

Engagement Metrics

High replay rate (players play multiple rounds)
Leaderboard competition (score improvements)
Positive user feedback
Successful brand integration

⚠️ Known Considerations
Browser Limitations

No localStorage/sessionStorage in artifacts (development only)
Audio requires user interaction to start
Full-screen may need user permission

Event-Specific Considerations

Offline capability essential
Multi-language support not required (English/Indonesian context)
Conservative visual effects (family-friendly)
Easy reset for event staff

🔄 Next Milestones
Immediate (Phase 3 Completion)

Deadline: Tomorrow night
Requirements: Naraya asset integration
Deliverable: Production-ready game with real branding

Pre-Event (Phase 4-6)

Timeline: August 1-14
Focus: Testing, polish, deployment preparation
Goal: Stable, tested, ready-to-deploy game

Launch (August 15)

Event: Grand opening deployment
Duration: 2 weeks of active use
Support: Remote monitoring and assistance


Last Updated: July 25, 2025
Current Phase: 3 (Asset Integration - 90% complete)
Next Critical Path: Naraya asset integration and testing