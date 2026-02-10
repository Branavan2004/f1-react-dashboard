import React from 'react';

export default function TrackSimulation({ circuitName, drivers = [] }) {
  // Simple path for demonstration; you can expand this object for all 24 tracks
  const getTrackPath = (name) => {
    if (name.includes("Silverstone")) return "M80,200 Q50,100 150,80 L350,80 Q450,100 420,200 Q450,300 350,320 L150,320 Q50,300 80,200 Z";
    return "M100,180 Q150,50 250,50 L350,50 Q450,150 350,250 L200,280 Q100,250 100,180 Z";
  };

  const trackPath = getTrackPath(circuitName);

  return (
    <div className="track-container">
      <svg viewBox="0 0 500 360" width="100%">
        <defs>
          <filter id="neon-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <path d={trackPath} className="track-bg" />
        <path d={trackPath} className="track-neon" filter="url(#neon-glow)" />

        {drivers.map((d, i) => {
          const id = d && d.driverId ? d.driverId : `drv-${i}`;
          const code = d && d.driverId ? d.driverId.substring(0, 3).toUpperCase() : '---';
          const constructorId = d && d.constructorId ? d.constructorId : 'unknown';
          return (
            <g key={id} className="driver-marker">
              <circle r="6" className={`dot ${constructorId}`}>
                <animateMotion dur="12s" repeatCount="indefinite" path={trackPath} begin={`-${i * 0.6}s`} />
              </circle>
              <text fontSize="10" dy="-12" textAnchor="middle" className="driver-code">
                {code}
                <animateMotion dur="12s" repeatCount="indefinite" path={trackPath} begin={`-${i * 0.6}s`} />
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}