function DriverCard({ name, team, position }) {
  return (
    <div style={{ 
      borderLeft: '8px solid #ff1801', 
      padding: '15px', 
      margin: '10px', 
      backgroundColor: 'white', 
      color: 'black',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>P{position}</p>
      <h2 style={{ margin: '5px 0', fontSize: '1.1rem' }}>{name}</h2>
      <p style={{ margin: 0, color: '#333', fontSize: '0.9rem' }}>{team}</p>
    </div>
  );
}

export default DriverCard;