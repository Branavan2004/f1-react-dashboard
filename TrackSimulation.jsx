function TrackSimulation({ circuitName, drivers, totalDrivers }) {
  // Generic track layouts for different circuit types
  const getTrackPath = (name) => {
    const lowerName = (name || '').toLowerCase();

    // Street circuits (Monaco, Singapore, Baku, etc.)
    if (lowerName.includes('monaco') || lowerName.includes('street')) {
      return "M100,50 L300,50 L350,100 L350,250 L300,300 L100,300 L50,250 L50,100 Z";
    }
    // Fast circuits (Monza, Spa, Silverstone)
    else if (lowerName.includes('monza') || lowerName.includes('spa') || lowerName.includes('silverstone')) {
      return "M80,200 Q50,100 150,80 L350,80 Q450,100 420,200 Q450,300 350,320 L150,320 Q50,300 80,200 Z";
    }
    // Technical circuits (Suzuka, Barcelona)
    else if (lowerName.includes('suzuka') || lowerName.includes('barcelona')) {
      return "M100,100 L200,80 Q300,80 320,150 L350,200 Q350,280 280,300 L150,300 Q80,280 80,200 L100,150 Z";
    }
    // Desert circuits (Bahrain, Abu Dhabi)
    else if (lowerName.includes('bahrain') || lowerName.includes('abu dhabi') || lowerName.includes('saudi')) {
      return "M150,100 L300,100 Q380,120 380,200 L350,280 Q320,320 250,320 L150,320 Q80,300 80,200 Q80,120 150,100 Z";
    }
    // Default generic track
    else {
      return "M120,180 Q100,100 200,80 L320,80 Q420,100 400,180 Q420,260 320,280 L200,280 Q100,260 120,180 Z";
    }
  };

  const trackPath = getTrackPath(circuitName);

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      background: '#0f0f0f',
      borderRadius: '10px',
      border: '1px solid #333'
    }}>
      <h4 style={{
        color: '#888',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '0.9rem'
      }}>
        {circuitName}
      </h4>

      <svg
        width="100%"
        height="360"
        viewBox="0 0 500 360"
        style={{ background: '#1a1a1a', borderRadius: '8px' }}
      >
        {/* Grid pattern */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="500" height="360" fill="url(#grid)" />

        {/* Track surface */}
        <path
          d={trackPath}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="40"
        />

        {/* Track edges */}
        <path
          d={trackPath}
          fill="none"
          stroke="#444"
          strokeWidth="42"
        />

        {/* Start/Finish line */}
        <rect x="95" y="175" width="6" height="40" fill="#fff" opacity="0.8" />
        <rect x="105" y="175" width="6" height="40" fill="#fff" opacity="0.8" />

        {/* Render all drivers as moving dots */}
        {drivers.slice(0, 20).map((driver, index) => {
          const hue = (index * 360) / Math.min(totalDrivers, 20);
          const color = `hsl(${hue}, 70%, 55%)`;

          // Stagger the starting position based on grid position
          const offset = (index * 2.5) + '%';

          return (
            <g key={driver.driverId}>
              {/* Driver car dot */}
              <circle
                r="5"
                fill={color}
                stroke="#fff"
                strokeWidth="1.5"
              >
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path={trackPath}
                  keyPoints={`0;1`}
                  keyTimes="0;1"
                  begin={`-${index * 0.3}s`}
                />
              </circle>

              {/* Driver number */}
              <text
                fontSize="8"
                fill="#fff"
                fontWeight="bold"
                textAnchor="middle"
                dy="3"
              >
                {driver.number}
                <animateMotion
                  dur="8s"
                  repeatCount="indefinite"
                  path={trackPath}
                  begin={`-${index * 0.3}s`}
                />
              </text>
            </g>
          );
        })}

        {/* Track sectors */}
        <text x="240" y="40" fill="#666" fontSize="10" textAnchor="middle">SECTOR 1</text>
        <text x="440" y="200" fill="#666" fontSize="10" textAnchor="middle">S2</text>
        <text x="240" y="340" fill="#666" fontSize="10" textAnchor="middle">SECTOR 3</text>
      </svg>

      <div style={{
        marginTop: '15px',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.85rem'
      }}>
        <span style={{ color: '#ff1801' }}>●</span> Live Position •
        <span style={{ marginLeft: '10px' }}>Animation Speed: 8s/lap</span>
      </div>
    </div>
  );
}

export default TrackSimulation;