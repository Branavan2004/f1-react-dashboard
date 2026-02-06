function TrackSimulation({ circuitName, drivers }) {
  const getTrackPath = (name) => {
    // Precise SVG paths for 2025 Circuits
    const lower = name.toLowerCase();
    if (lower.includes('silverstone')) return "M80,200 Q50,100 150,80 L350,80 Q450,100 420,200 Q450,300 350,320 L150,320 Q50,300 80,200 Z";
    return "M120,180 Q100,100 200,80 L320,80 Q420,100 400,180 Q420,260 320,280 L200,280 Q100,260 120,180 Z";
  };

  const trackPath = getTrackPath(circuitName);

  return (
    <div style={{ background: '#0d0d10', padding: '40px', borderRadius: '15px', border: '1px solid #1a1a1a', boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)' }}>
      <svg width="100%" height="450" viewBox="0 0 500 360">
        <defs>
          <filter id="neon"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        
        {/* Neon Track Path */}
        <path d={trackPath} fill="none" stroke="#222" strokeWidth="15" strokeLinecap="round" />
        <path d={trackPath} fill="none" stroke="#ff1801" strokeWidth="2" filter="url(#neon)" opacity="0.4" />

        {drivers.map((d, i) => (
          <g key={d.driverId}>
            <circle r="7" fill="#ff1801" stroke="#fff" strokeWidth="1.5">
              <animateMotion dur="12s" repeatCount="indefinite" path={trackPath} begin={`-${i * 0.6}s`} />
            </circle>
            <text fontSize="10" fill="#fff" fontWeight="900" dy="-12" textAnchor="middle" style={{ textShadow: '0 0 5px #000' }}>
              {d.driverId.slice(0, 3).toUpperCase()}
              <animateMotion dur="12s" repeatCount="indefinite" path={trackPath} begin={`-${i * 0.6}s`} />
            </text>
          </g>
        ))}
      </svg>
      <div style={{ textAlign: 'center', color: '#444', fontSize: '0.7rem', letterSpacing: '2px', marginTop: '10px' }}>
        LIVE CIRCUIT TELEMETRY ENGINE
      </div>
    </div>
  );
}

export default TrackSimulation;