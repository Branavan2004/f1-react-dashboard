function RaceCard({ race, active, onClick }) {
  const round = race?.round;
  const name = race?.raceName;
  const country = race?.Circuit?.Location?.country;
  const date = race?.date;
  const isSelected = !!active;

  return (
    <div onClick={onClick} style={{ 
      borderLeft: isSelected ? '8px solid #ff1801' : '8px solid #333',
      padding: '15px', 
      margin: '10px 0', 
      backgroundColor: isSelected ? '#1a1a1a' : '#0f0f0f', 
      borderRadius: '4px',
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: isSelected ? '1px solid #ff1801' : '1px solid #222'
    }}>
      <p style={{ 
        margin: 0, 
        color: '#ff1801', 
        fontSize: '0.8rem',
        fontWeight: 'bold' 
      }}>
        ROUND {round}
      </p>
      <h3 style={{ 
        margin: '8px 0 5px 0', 
        fontSize: '1rem',
        color: 'white' 
      }}>
        {name}
      </h3>
      <p style={{ 
        margin: 0, 
        color: '#888', 
        fontSize: '0.85rem' 
      }}>
        📍 {country}
      </p>
      <p style={{ 
        margin: '5px 0 0 0', 
        color: '#666', 
        fontSize: '0.75rem' 
      }}>
        {new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })}
      </p>
    </div>
  );
}

export default RaceCard;