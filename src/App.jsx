import { useState, useEffect } from 'react';
import RaceCard from './RaceCard';
import TrackSimulation from './TrackSimulation';
import Leaderboard from './Leaderboard';
import LapTimeChart from './LapTimecChart';

function App() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [raceResults, setRaceResults] = useState([]);
  const [lapData, setLapData] = useState([]);
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // Default 1s per lap
  const [loading, setLoading] = useState(true);

  const SEASON = '2025';
  const BASE_URL = 'https://api.jolpi.ca/ergast/f1';

  useEffect(() => {
    fetch(`${BASE_URL}/${SEASON}.json`)
      .then(res => res.json())
      .then(data => {
        setRaces(data.MRData.RaceTable.Races);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedRace) return;
    setIsPlaying(false);
    setCurrentLap(1);
    fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/results.json`)
      .then(res => res.json())
      .then(data => setRaceResults(data.MRData.RaceTable.Races[0].Results));

    fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/laps.json?limit=2000`)
      .then(res => res.json())
      .then(data => setLapData(data.MRData.RaceTable.Races[0].Laps));
  }, [selectedRace]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentLap < lapData.length) {
      interval = setInterval(() => setCurrentLap(prev => prev + 1), playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentLap, lapData.length, playbackSpeed]);

  const getCurrentStandings = () => {
    if (!lapData[currentLap - 1]) return [];
    return lapData[currentLap - 1].Timings.map(t => ({
      position: t.position,
      driverId: t.driverId,
      time: t.time,
      number: raceResults.find(r => r.Driver.driverId === t.driverId)?.number || '??'
    })).sort((a, b) => a.position - b.position);
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* SIDEBAR */}
      <div style={{ width: '20%', borderRight: '1px solid #1a1a1a', padding: '20px', background: '#080808' }}>
        <h2 style={{ color: '#ff1801', fontSize: '0.9rem', letterSpacing: '3px', marginBottom: '20px' }}>2025 REPLAY</h2>
        {races.map(r => (
          <div key={r.round} onClick={() => setSelectedRace(r)}>
            <RaceCard round={r.round} name={r.raceName} isSelected={selectedRace?.round === r.round} />
          </div>
        ))}
      </div>

      {/* CENTER ENGINE */}
      <div style={{ width: '50%', padding: '30px', overflowY: 'auto' }}>
        {selectedRace && (
          <>
            <div style={{ background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: '#ff1801', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isPlaying ? 'PAUSE' : 'START SIMULATION'}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>SPEED:</span>
                  <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} style={{ background: '#222', color: 'white', border: 'none', padding: '5px' }}>
                    <option value={2000}>0.5x</option>
                    <option value={1000}>1.0x</option>
                    <option value={500}>2.0x</option>
                    <option value={200}>5.0x</option>
                  </select>
                </div>
              </div>
            </div>

            <TrackSimulation circuitName={selectedRace.Circuit.circuitName} drivers={getCurrentStandings()} />
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '0.8rem', color: '#444' }}>LAP SELECTOR</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '10px' }}>
                {lapData.map((_, i) => (
                  <button key={i} onClick={() => setCurrentLap(i + 1)} style={{ width: '30px', height: '30px', fontSize: '0.7rem', background: currentLap === i + 1 ? '#ff1801' : '#111', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* LEADERBOARD */}
      <div style={{ width: '30%', padding: '20px', background: '#080808' }}>
        <Leaderboard standings={getCurrentStandings()} raceResults={raceResults} />
      </div>
    </div>
  );
}

export default App;