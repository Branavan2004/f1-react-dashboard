function Leaderboard({ standings = [], raceResults = [] }) {
  // Get driver name and team from race results
  const getDriverInfo = (driverId) => {
    const result = raceResults.find(r => r.Driver.driverId === driverId);
    if (result) {
      return {
        name: `${result.Driver.givenName} ${result.Driver.familyName}`,
        code: result.Driver.code || result.Driver.driverId.slice(0, 3).toUpperCase(),
        team: result.Constructor.name,
        number: result.number
      };
    }
    return { 
      name: driverId, 
      code: driverId.slice(0, 3).toUpperCase(), 
      team: 'Unknown',
      number: '?'
    };
  };

  if (!standings || standings.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '10px' }}>
      {standings.map((driver) => {
        const info = getDriverInfo(driver.driverId);
        const position = parseInt(driver.position, 10);
        
        // Position colors
        let positionColor = '#888';
        if (position === 1) positionColor = '#ffd700'; // Gold
        else if (position === 2) positionColor = '#c0c0c0'; // Silver
        else if (position === 3) positionColor = '#cd7f32'; // Bronze
        else if (position <= 10) positionColor = '#4ade80'; // Points finish

        return (
          <div 
            key={driver.driverId}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              margin: '8px 0',
              backgroundColor: '#0f0f0f',
              borderLeft: `4px solid ${positionColor}`,
              borderRadius: '4px',
              transition: 'all 0.3s',
              border: '1px solid #222'
            }}
          >
            {/* Position */}
            <div style={{ 
              minWidth: '40px',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: positionColor
            }}>
              {position}
            </div>

            {/* Driver Number */}
            <div style={{ 
              minWidth: '35px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              color: '#666',
              marginRight: '10px'
            }}>
              #{info.number}
            </div>

            {/* Driver Info */}
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.95rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {info.code}
              </div>
              <div style={{ 
                fontSize: '0.75rem',
                color: '#666',
                marginTop: '2px'
              }}>
                {info.team.length > 20 ? info.team.slice(0, 20) + '...' : info.team}
              </div>
            </div>

            {/* Lap Time */}
            <div style={{ 
              fontSize: '0.85rem',
              color: '#ff1801',
              fontFamily: 'monospace',
              textAlign: 'right'
            }}>
              {driver.time}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Leaderboard;