function Leaderboard({ standings = [], raceResults = [] }) {
  // Official 2025 Team Hex Codes
  const teamColors = {
    'Mercedes': '#27F4D2', 'Red Bull': '#3671C6', 'Ferrari': '#ED1131',
    'McLaren': '#FF8000', 'Aston Martin': '#229971', 'Alpine': '#00A1E8',
    'Williams': '#64C4FF', 'Haas': '#B6BABD', 'RB': '#6692FF', 'Sauber': '#52E252'
  };

  return (
    <div style={{ marginTop: '10px' }}>
      {standings.map((driver) => {
        const headshotUrl = `https://media.formula1.com/content/fom-website/en/drivers/${driver.driverId}/_jcr_content/image.img.jpg`;
        const accentColor = teamColors[driver.team] || '#444';

        return (
          <div key={driver.driverId} style={{ display: 'flex', alignItems: 'center', padding: '12px', margin: '8px 0', backgroundColor: '#111', borderLeft: `5px solid ${accentColor}`, borderRadius: '4px', border: '1px solid #222' }}>
            <img 
              src={headshotUrl} 
              alt={driver.code} 
              style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '15px', border: `1px solid ${accentColor}`, backgroundColor: '#222' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=F1'; }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 'bold' }}>{driver.code}</span>
                <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 'bold' }}>P{driver.position}</span>
              </div>
              <div style={{ color: '#666', fontSize: '0.75rem' }}>{driver.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}