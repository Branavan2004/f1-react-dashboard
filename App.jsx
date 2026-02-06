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
  const [maxLaps, setMaxLaps] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use 2024 season (complete data available)
  const SEASON = '2024';

  // Fetch race calendar
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching ${SEASON} race calendar...`);
    
    fetch(`https://ergast.com/api/f1/${SEASON}.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Raw API response:', data);
        
        const raceList = data?.MRData?.RaceTable?.Races;
        
        if (!raceList || raceList.length === 0) {
          throw new Error('No races found in API response');
        }
        
        console.log(`✅ Loaded ${raceList.length} races`);
        setRaces(raceList);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Error fetching races:', err);
        setError(`Failed to load ${SEASON} calendar: ${err.message}`);
        setLoading(false);
      });
  }, [SEASON]);

  // Fetch race results when a race is selected
  useEffect(() => {
    if (!selectedRace) return;
    
    setIsPlaying(false);
    setCurrentLap(1);
    setLapData([]);
    setRaceResults([]);
    
    console.log(`Loading race ${selectedRace.round}: ${selectedRace.raceName}`);
    
    // Fetch race results
    fetch(`https://ergast.com/api/f1/${SEASON}/${selectedRace.round}/results.json`)
      .then(res => res.json())
      .then(data => {
        const results = data?.MRData?.RaceTable?.Races?.[0]?.Results || [];
        console.log(`✅ Loaded ${results.length} drivers`);
        setRaceResults(results);
      })
      .catch(err => {
        console.error('❌ Error fetching results:', err);
      });

    // Fetch lap data for all drivers
    fetch(`https://ergast.com/api/f1/${SEASON}/${selectedRace.round}/laps.json?limit=2000`)
      .then(res => res.json())
      .then(data => {
        const laps = data?.MRData?.RaceTable?.Races?.[0]?.Laps || [];
        console.log(`✅ Loaded ${laps.length} laps`);
        setLapData(laps);
        setMaxLaps(laps.length);
      })
      .catch(err => {
        console.error('❌ Error fetching lap data:', err);
      });
  }, [selectedRace, SEASON]);

  // Playback control
  useEffect(() => {
    let interval;
    if (isPlaying && currentLap < maxLaps) {
      interval = setInterval(() => {
        setCurrentLap(prev => prev + 1);
      }, 1000);
    } else if (currentLap >= maxLaps && isPlaying) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentLap, maxLaps]);

  // Get current lap standings
  const getCurrentStandings = () => {
    if (!lapData || lapData.length === 0 || currentLap < 1) return [];
    
    const lap = lapData[currentLap - 1];
    if (!lap || !lap.Timings) return [];

    return lap.Timings.map((timing, index) => ({
      position: timing.position,
      driverId: timing.driverId,
      time: timing.time,
      number: timing.number || index + 1
    })).sort((a, b) => parseInt(a.position) - parseInt(b.position));
  };

  const currentStandings = getCurrentStandings();

  return (
    <div style={{ 
      display: 'flex', 
      backgroundColor: '#0a0a0a', 
      color: 'white', 
      minHeight: '100vh', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      
      {/* LEFT: Race Calendar */}
      <div style={{ 
        width: '25%', 
        borderRight: '1px solid #333', 
        padding: '20px', 
        overflowY: 'auto',
        maxHeight: '100vh'
      }}>
        <h2 style={{ color: '#ff1801', marginBottom: '20px' }}>{SEASON} Season</h2>
        
        {/* Error State */}
        {error && (
          <div style={{ 
            padding: '20px',
            background: '#2a0000',
            border: '1px solid #ff1801',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ 
              color: '#ff1801', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              ⚠️ Error Loading Races
            </p>
            <p style={{ 
              color: '#ff6666', 
              fontSize: '0.9rem',
              marginBottom: '15px'
            }}>
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                background: '#ff1801',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Retry
            </button>
            <p style={{ 
              color: '#666', 
              fontSize: '0.75rem',
              marginTop: '15px'
            }}>
              💡 Press F12 to check browser console for details
            </p>
          </div>
        )}
        
        {/* Loading State */}
        {loading && !error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#666' 
          }}>
            <div style={{ 
              fontSize: '2rem',
              marginBottom: '15px'
            }}>
              🏎️
            </div>
            <p style={{ marginBottom: '5px' }}>Loading {SEASON} races...</p>
            <p style={{ fontSize: '0.8rem', color: '#444' }}>
              This may take a moment
            </p>
          </div>
        )}
        
        {/* Race List */}
        {!loading && !error && races.length > 0 && (
          races.map(race => (
            <div 
              key={race.round} 
              onClick={() => setSelectedRace(race)}
              style={{ cursor: 'pointer' }}
            >
              <RaceCard 
                round={race.round}
                name={race.raceName}
                country={race.Circuit.Location.country}
                date={race.date}
                isSelected={selectedRace?.round === race.round}
              />
            </div>
          ))
        )}
      </div>

      {/* CENTER: Track Simulation */}
      <div style={{ 
        width: '45%', 
        padding: '20px',
        overflowY: 'auto',
        maxHeight: '100vh'
      }}>
        {selectedRace ? (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>
                {selectedRace.raceName}
              </h1>
              <p style={{ color: '#888', margin: '5px 0' }}>
                {selectedRace.Circuit.circuitName} • {selectedRace.Circuit.Location.country}
              </p>
            </div>

            {lapData.length > 0 ? (
              <>
                <div style={{ 
                  display: 'flex', 
                  gap: '10px', 
                  marginBottom: '20px',
                  alignItems: 'center' 
                }}>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ 
                      flex: 1,
                      padding: '15px', 
                      background: isPlaying ? '#666' : '#ff1801', 
                      color: 'white', 
                      border: 'none', 
                      fontWeight: 'bold', 
                      cursor: 'pointer',
                      borderRadius: '5px',
                      fontSize: '1rem'
                    }}
                  >
                    {isPlaying ? '⏸ PAUSE' : '▶ PLAY RACE'}
                  </button>
                  <button 
                    onClick={() => setCurrentLap(1)}
                    disabled={isPlaying}
                    style={{ 
                      padding: '15px 20px', 
                      background: '#333', 
                      color: 'white', 
                      border: 'none', 
                      cursor: isPlaying ? 'not-allowed' : 'pointer',
                      borderRadius: '5px',
                      opacity: isPlaying ? 0.5 : 1
                    }}
                  >
                    ↺ RESET
                  </button>
                </div>

                <h2 style={{ 
                  textAlign: 'center', 
                  fontSize: '2.5rem', 
                  margin: '10px 0',
                  color: '#ff1801' 
                }}>
                  Lap {currentLap} / {maxLaps}
                </h2>

                <TrackSimulation 
                  circuitName={selectedRace.Circuit.circuitName}
                  drivers={currentStandings}
                  totalDrivers={currentStandings.length}
                />

                <LapTimeChart 
                  lapData={lapData}
                  currentLap={currentLap}
                  raceResults={raceResults}
                />
              </>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '60px 20px',
                color: '#666' 
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
                <p style={{ fontSize: '1.2rem' }}>Loading race data...</p>
                <p style={{ fontSize: '0.9rem', marginTop: '10px', color: '#444' }}>
                  Fetching lap times and positions
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#666' 
          }}>
            <h2 style={{ color: '#ff1801', fontSize: '2rem' }}>
              F1 {SEASON} Race Replay
            </h2>
            <p style={{ fontSize: '1.1rem', marginTop: '20px' }}>
              ← Select a race from the calendar to start
            </p>
            <div style={{ 
              marginTop: '40px',
              padding: '20px',
              background: '#1a1a1a',
              borderRadius: '10px',
              border: '1px solid #333'
            }}>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>
                🏁 Watch all 20 drivers race lap-by-lap<br/>
                📊 Compare lap times in real-time<br/>
                🗺️ Animated circuit simulation
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Live Leaderboard */}
      <div style={{ 
        width: '30%', 
        borderLeft: '1px solid #333', 
        padding: '20px',
        overflowY: 'auto',
        maxHeight: '100vh'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Live Standings</h2>
        <Leaderboard 
          standings={currentStandings}
          raceResults={raceResults}
        />
      </div>
    </div>
  );
}

export default App;