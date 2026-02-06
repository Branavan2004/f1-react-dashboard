# 🏎️ F1 2025 Race Simulation

An interactive Formula 1 race replay application that visualizes all 24 races from the 2025 season with real-time lap data and multi-driver track simulation.

## ✨ Features

### 🗓️ Full 2025 Season Calendar
- All 24 races from the 2025 F1 season
- Race cards with date, location, and circuit info
- Click any race to load the replay

### 🏁 Multi-Driver Race Simulation
- Watch all 20 drivers race simultaneously
- Animated track with different layouts for each circuit type
- Color-coded driver positions
- Live leaderboard updating lap-by-lap

### 📊 Lap Time Analysis
- Real-time lap time comparison chart
- Top 10 drivers visualized
- Interactive tooltips showing exact lap times
- Performance trends across the race

### 🎮 Playback Controls
- Play/Pause race replay
- Reset to lap 1
- 1 second per lap animation speed
- Current lap indicator

## 🚀 Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 File Structure

```
├── App.jsx              # Main application logic
├── RaceCard.jsx         # Race selection cards
├── TrackSimulation.jsx  # Animated circuit with drivers
├── Leaderboard.jsx      # Live standings display
├── LapTimeChart.jsx     # Lap time comparison chart
├── DriverCard.jsx       # Driver info card component
└── package.json         # Dependencies
```

## 🔧 Tech Stack

- **React** - UI framework
- **Recharts** - Lap time visualization
- **Ergast F1 API** - Race data source
- **SVG Animations** - Track simulation

## 🎯 How to Use

1. **Select a Race** - Click any race from the 2025 calendar on the left
2. **Watch the Replay** - All drivers will load on the animated track
3. **Control Playback** - Use Play/Pause and Reset buttons
4. **Monitor Positions** - Live leaderboard on the right shows current standings
5. **Analyze Performance** - Lap time chart shows performance comparison

## 🔍 Data Sources

This app uses the **Jolpica Ergast F1 API** to fetch:
- 2025 race calendar
- Race results for all drivers
- Lap-by-lap timing data
- Driver and constructor information

## 🐛 Known Limitations

- Track layouts are generic representations (5 types)
- Lap data may be limited for races not yet completed
- Animation speed is fixed at 8 seconds per lap
- Some 2025 races may not have data yet

## 🎨 Customization

### Adjust Animation Speed
In `TrackSimulation.jsx`, change the `dur` attribute:
```jsx
<animateMotion dur="8s" ... />
```

### Change Colors
F1 red is defined as `#ff1801` throughout the app

### Add Real Track Layouts
Replace SVG paths in `getTrackPath()` function with accurate circuit coordinates

## 📝 Future Enhancements

- [ ] Real track layouts for all 24 circuits
- [ ] Pit stop indicators
- [ ] Weather conditions display
- [ ] Driver radio messages
- [ ] Sector time comparisons
- [ ] Qualifying simulation
- [ ] Championship points tracker

## 🏆 Credits

Built with data from the [Ergast F1 API](https://ergast.com/mrd/)

---

**Happy Racing! 🏁**