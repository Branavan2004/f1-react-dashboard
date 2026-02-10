import React, { useState, useEffect, useMemo } from 'react';
import RaceCard from './RaceCard';
import TrackSimulation from './TrackSimulation';
import Leaderboard from './Leaderboard';
import LapTimeChart from './LapTimeChart'; // Ensure you renamed LapTimecChart to this
import './App.css';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const SEASON = '2025';

export default function App() {
  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);
  const [raceData, setRaceData] = useState({ results: [], laps: [] });
  const [currentLap, setCurrentLap] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  const [loading, setLoading] = useState(false);

  // 1. Fetch 2025 Calendar
  useEffect(() => {
    fetch(`${BASE_URL}/${SEASON}.json`)
      .then(res => res.json())
      .then(data => setRaces(data.MRData.RaceTable.Races))
      .catch(err => console.error("Calendar load failed", err));
  }, []);

  // 2. Fetch Results & ALL Laps (Added ?limit=1000 to fix the 6-lap issue)
  useEffect(() => {
    if (!selectedRace) return;
    setLoading(true);
    setIsPlaying(false);
    setCurrentLap(1);
    
    Promise.all([
      fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/results.json`).then(r => r.json()),
      fetch(`${BASE_URL}/${SEASON}/${selectedRace.round}/laps.json?limit=1000`).then(r => r.json())
    ]).then(([resultsRes, lapsRes]) => {
      setRaceData({
        results: resultsRes.MRData.RaceTable.Races[0].Results,
        laps: lapsRes.MRData.RaceTable.Races[0].Laps
      });
      setLoading(false);
    }).catch(err => {
      console.error("Telemetry failed", err);
      setLoading(false);
    });
  }, [selectedRace]);

  // 3. Simulation Timer logic
  useEffect(() => {
    let timer;
    if (isPlaying && currentLap < raceData.laps.length) {
      timer = setInterval(() => setCurrentLap(prev => prev + 1), playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentLap, raceData.laps.length, playbackSpeed]);

  // 4. Calculate Live Standings with Team Info
  const currentStandings = useMemo(() => {
    if (!raceData.laps[currentLap - 1]) return [];
    return raceData.laps[currentLap - 1].Timings.map(t => {
      const driverInfo = raceData.results.find(r => r.Driver.driverId === t.driverId);
      return {
        ...t,
        driverName: driverInfo ? `${driverInfo.Driver.givenName} ${driverInfo.Driver.familyName}` : t.driverId,
        constructorId: driverInfo?.Constructor.constructorId || 'unknown',
        constructorName: driverInfo?.Constructor.name || 'Unknown'
      };
    }).sort((a, b) => a.position - b.position);
  }, [currentLap, raceData]);

  return (
    <div className="fanvolt-container">
      <aside className="sidebar">
        <h2 className="logo">FANVOLT <span>PRO</span></h2>
        <div className="race-list">
          {races.map(r => (
            <RaceCard 
              key={r.round} 
              race={r} 
              active={selectedRace?.round === r.round} 
              onClick={() => setSelectedRace(r)} 
            />
          ))}
        </div>
      </aside>

      <main className="main-stage">
        {selectedRace ? (
          <>
            <div className="sim-controls">
              <div className="lap-info">
                <span>LAP</span>
                <h1>{currentLap} <span>/ {raceData.laps.length}</span></h1>
              </div>
              <div className="btn-group">
                <button className="play-btn" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? 'PAUSE' : 'START REPLAY'}
                </button>
                <select className="speed-select" onChange={(e) => setPlaybackSpeed(Number(e.target.value))}>
                  <option value="1500">0.5x</option>
                  <option value="1000">1.0x</option>
                  <option value="300">3.0x</option>
                </select>
              </div>
            </div>

            <TrackSimulation circuitName={selectedRace.Circuit.circuitName} drivers={currentStandings} />
            
            {/* Added LapTimeChart for deeper data analysis */}
            <LapTimeChart lapData={raceData.laps} currentLap={currentLap} raceResults={raceData.results} />

            <div className="timeline">
              <input 
                type="range" 
                min="1" 
                max={raceData.laps.length || 1} 
                value={currentLap} 
                onChange={(e) => setCurrentLap(Number(e.target.value))} 
              />
            </div>
          </>
        ) : <div className="placeholder-msg">Select a race from the 2025 calendar to begin.</div>}
      </main>

      <section className="right-panel">
        <Leaderboard standings={currentStandings} />
      </section>
    </div>
  );
}