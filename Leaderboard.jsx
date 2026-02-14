import React from 'react';

const TEAM_COLORS = {
  ferrari: '#EF1A2D', mclaren: '#FF8000', red_bull: '#3671C6', 
  mercedes: '#27F4D2', aston_martin: '#229971', williams: '#64C4FF',
  alpine: '#0093CC', haas: '#B6BABD', rb: '#6692FF', sauber: '#52E252'
};

export default function Leaderboard({ standings }) {
  return (
    <div className="leaderboard">
      <h3>LIVE TIMING</h3>
      {standings.length === 0 && <p className="empty">Waiting for data...</p>}
      {standings.map((driver) => {
        const color = TEAM_COLORS[driver.constructorId] || '#444';
        const imgUrl = `https://media.formula1.com/content/fom-website/en/drivers/${driver.driverId}/_jcr_content/image.img.jpg`;

        return (
          <div key={driver.driverId} className="leaderboard-row" style={{ borderLeft: `4px solid ${color}` }}>
            <span className="position">{driver.position}</span>
            <img 
              src={imgUrl} 
              alt={driver.driverId} 
              className="driver-img" 
              onError={(e) => e.target.src = 'https://via.placeholder.com/50?text=F1'}
            />
            <div className="driver-info">
              <div className="name-row">
                <strong>{driver.driverName}</strong>
              </div>
              <small>{driver.constructorName}</small>
            </div>
            <div className="time">{driver.time}</div>
          </div>
        );
      })}
    </div>
  );
}