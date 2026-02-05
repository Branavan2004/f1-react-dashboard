// App.jsx
import { useState, useEffect } from 'react'
import DriverCard from "./DriverCard"
import TrackMap from "./TrackMap"

function App() {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [races, setRaces] = useState([]); 
  const [selectedRace, setSelectedRace] = useState(null);
  const [lapData, setLapData] = useState([]); 
  const [currentLapIndex, setCurrentLapIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch('https://api.jolpica.net/ergast/f1/2025/driverStandings.json')
      .then(res => res.json())
      .then(data => {
        const standings = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
        setDrivers(standings);
      });
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      fetch(`https://api.jolpica.net/ergast/f1/2025/drivers/${selectedDriver.Driver.driverId}/results.json`)
        .then(res => res.json())
        .then(data => setRaces(data.MRData.RaceTable.Races));
    }
  }, [selectedDriver]);

  useEffect(() => {
    if (selectedDriver && selectedRace) {
      fetch(`https://api.jolpica.net/ergast/f1/2025/${selectedRace}/drivers/${selectedDriver.Driver.driverId}/laps.json?limit=100`)
        .then(res => res.json())
        .then(data => {
          if (data.MRData.RaceTable.Races[0]) {
            setLapData(data.MRData.RaceTable.Races[0].Laps);
            setCurrentLapIndex(0);
          }
        });
    }
  }, [selectedRace]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentLapIndex < lapData.length - 1) {
      interval = setInterval(() => {
        setCurrentLapIndex(prev => prev + 1);
      }, 800);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentLapIndex]);

  return (
    <div style={{ display: 'flex', backgroundColor: '#0a0a0a', color: 'white', minHeight: '100vh', fontFamily: 'Arial' }}>
      {/* 1. DRIVERS */}
      <div style={{ width: '25%', borderRight: '1px solid #333', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{color: '#ff1801'}}>2025 Grid</h2>
        {drivers.map(d => (
          <div key={d.Driver.driverId} onClick={() => {setSelectedDriver(d); setSelectedRace(null); setLapData([]); setIsPlaying(false);}} style={{cursor: 'pointer'}}>
            <DriverCard name={d.Driver.familyName} team={d.Constructors[0].name} position={d.position} />
          </div>
        ))}
      </div>

      {/* 2. RACES */}
      <div style={{ width: '30%', borderRight: '1px solid #333', padding: '20px', overflowY: 'auto' }}>
        <h2>{selectedDriver ? selectedDriver.Driver.familyName : "Select Driver"}</h2>
        {races.map(r => (
          <button key={r.round} onClick={() => {setSelectedRace(r.round); setIsPlaying(false);}} style={{ display: 'block', width: '100%', padding: '15px', margin: '5px 0', background: selectedRace === r.round ? '#ff1801' : '#222', color: 'white', border: 'none', cursor: 'pointer' }}>
            Round {r.round}: {r.raceName}
          </button>
        ))}
      </div>

      {/* 3. ANALYSIS */}
      <div style={{ width: '45%', padding: '20px' }}>
        <h2>Analysis</h2>
        {lapData.length > 0 ? (
          <div>
            <button onClick={() => setIsPlaying(!isPlaying)} style={{ width: '100%', padding: '15px', background: '#ff1801', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
              {isPlaying ? "PAUSE" : "START REPLAY"}
            </button>
            <h1 style={{ textAlign: 'center' }}>Lap {lapData[currentLapIndex]?.number}</h1>
            <p style={{ textAlign: 'center', fontSize: '1.5rem', color: '#ff1801' }}>{lapData[currentLapIndex]?.Timings[0].time}</p>
            <TrackMap />
          </div>
        ) : <p>Select a race to start.</p>}
      </div>
    </div>
  );
}

export default App;