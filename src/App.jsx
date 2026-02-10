import { useState, useEffect } from 'react';
import RaceCard from './RaceCard';
import TrackSimulation from './TrackSimulation';
import Leaderboard from './Leaderboard';
import LapTimeChart from './LapTimeChart';

function App() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [lapData, setLapData] = useState([]);
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); 
  const [loading, setLoading] = useState(true);

  // Official 2025 Configuration
  const SEASON = '2025';
  const BASE_URL = 'https://api.jolpi.ca/ergast/f1'; 

  // 1. Fetch 2025 Calendar
  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/${SEASON}.json`)
      .then(res => res.json())
      .then(data => {
        setRaces(data.MRData.RaceTable.Races);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  // 2. Fetch Deep Telemetry (Results & ALL Laps)
  useEffect(() => {
    if (!selectedRace) return;
    setIsPlaying(false);
    setCurrentLap(1);

    // Results fetch for driver names and official numbers
    fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/results.json`)
      .then(res => res.json())
      .then(data => setRaceResults(data.MRData.RaceTable.Races[0].Results));

    // CRITICAL: Added limit=1000 to solve the "6-lap limit" issue
    fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/laps.json?limit=1000`)
      .then(res => res.json())
      .then(data => {
        const fullRaceLaps = data.MRData.RaceTable.Races[0].Laps;
        setLapData(fullRaceLaps);
      });
  }, [selectedRace]);

  // Simulation Engine
  useEffect(() => {
    let interval;
    if (isPlaying && currentLap < lapData.length) {
      interval = setInterval(() => setCurrentLap(prev => prev + 1), playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentLap, lapData.length, playbackSpeed]);

  const getCurrentStandings = () => {
    if (!lapData[currentLap - 1]) return [];
    return lapData[currentLap - 1].Timings.map(t => {
      const result = raceResults.find(r => r.Driver.driverId === t.driverId);
      return {
        position: t.position,
        driverId: t.driverId,
        time: t.time,
        team: result?.Constructor?.name || 'Unknown',
        code: result?.Driver?.code || t.driverId.slice(0, 3).toUpperCase()
      };
    }).sort((a, b) => a.position - b.position);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* COLUMN 1: 2025 CALENDAR */}
      <div style={{ width: '25%', borderRight: '1px solid #1a1a1a', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ color: '#ff1801', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase' }}>2025 World Championship</h2>
        {races.map(r => (
          <div key={r.round} onClick={() => setSelectedRace(r)}>
            <RaceCard round={r.round} name={r.raceName} country={r.Circuit.Location.country} date={r.date} isSelected={selectedRace?.round === r.round} />
          </div>
        ))}
      </div>

      {/* COLUMN 2: TRACK REPLAY ENGINE */}
      <div style={{ width: '45%', padding: '20px', overflowY: 'auto' }}>
        {selectedRace && (
          <>
            <div style={{ background: '#111', padding: '15px', borderRadius: '8px', border: '1px solid #222', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: '#ff1801', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                {isPlaying ? 'PAUSE' : '▶ START REPLAY'}
              </button>
              <div style={{ color: '#666', fontSize: '0.8rem' }}>
                SPEED: 
                <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} style={{ background: '#222', color: '#fff', marginLeft: '10px', border: 'none' }}>
                  <option value={1500}>0.5x</option>
                  <option value={1000}>1.0x</option>
                  <option value={400}>2.5x</option>
                </select>
              </div>
            </div>

            <h1 style={{ textAlign: 'center', fontSize: '4rem', color: '#ff1801', margin: 0 }}>LAP {currentLap}</h1>
            <TrackSimulation circuitName={selectedRace.Circuit.circuitName} drivers={getCurrentStandings()} />
            <LapTimeChart lapData={lapData} currentLap={currentLap} raceResults={raceResults} />
          </>
        )}
      </div>

      {/* COLUMN 3: PRO LEADERBOARD */}
      <div style={{ width: '30%', padding: '20px', background: '#080808', borderLeft: '1px solid #1a1a1a' }}>
        <h2 style={{ fontSize: '1rem', color: '#444' }}>LIVE TIMING SCREEN</h2>
        <Leaderboard standings={getCurrentStandings()} raceResults={raceResults} />
      </div>
    </div>
  );
}

export default App;