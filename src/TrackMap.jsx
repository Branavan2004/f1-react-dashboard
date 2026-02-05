function TrackMap() {
  return (
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <h4 style={{ color: '#aaa' }}>Live Track Position: Silverstone</h4>
      <svg width="300" height="200" viewBox="0 0 500 350">
        {/* The Track Outline */}
        <path
          d="M150,300 L50,250 L80,100 L200,50 L350,80 L450,150 L400,300 L250,320 Z"
          fill="none"
          stroke="#444"
          strokeWidth="15"
          strokeLinejoin="round"
        />
        {/* The Animated Driver Dot */}
        <circle r="8" fill="#ff1801">
          <animateMotion 
            dur="10s" 
            repeatCount="indefinite"
            path="M150,300 L50,250 L80,100 L200,50 L350,80 L450,150 L400,300 L250,320 Z" 
          />
        </circle>
      </svg>
    </div>
  );
}

export default TrackMap;