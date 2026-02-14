function DriverCard({ name, team, position, driverId }) {
  // Official F1 Media CDN link template
  const imageUrl = `https://media.formula1.com/content/fom-website/en/drivers/${driverId}/_jcr_content/image.img.jpg`;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      padding: '15px', 
      backgroundColor: '#1a1a1a', 
      borderRadius: '12px',
      borderLeft: '6px solid #ff1801',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      {/* Driver Headshot Container */}
      <div style={{ position: 'relative', marginRight: '20px' }}>
        <img 
          src={imageUrl} 
          alt={name} 
          style={{ 
            width: '75px', 
            height: '75px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '2px solid #333',
            background: '#222' 
          }} 
          // Fallback if the F1 CDN doesn't have the image yet
          onError={(e) => { e.target.src = 'https://via.placeholder.com/75?text=F1'; }} 
        />
        <div style={{
          position: 'absolute',
          bottom: '-5px',
          right: '-5px',
          background: '#ff1801',
          padding: '2px 6px',
          borderRadius: '8px',
          fontSize: '0.7rem',
          fontWeight: 'bold'
        }}>
          P{position}
        </div>
      </div>

      <div>
        <h2 style={{ margin: 0, fontSize: '1.1rem', color: 'white' }}>{name}</h2>
        <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '0.85rem', textTransform: 'uppercase' }}>
          {team}
        </p>
      </div>
    </div>
  );
}

export default DriverCard;