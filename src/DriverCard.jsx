function DriverCard({ name, team, position }) {
  return (
    <div style={{ 
      backgroundColor: '#fff', 
      color: '#000', 
      padding: '15px', 
      borderRadius: '8px', 
      borderLeft: '10px solid #ff1801' 
    }}>
      <small>POS: {position}</small>
      <h3 style={{ margin: '5px 0' }}>{name}</h3>
      <p style={{ margin: 0, fontSize: '0.9rem', color: '#444' }}>{team}</p>
    </div>
  );
}
export default DriverCard;