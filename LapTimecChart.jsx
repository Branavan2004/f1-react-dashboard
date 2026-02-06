import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

function LapTimeChart({ lapData = [], currentLap = 0, raceResults = [] }) {
  if (!lapData || lapData.length === 0) return null;

  const topDrivers = (raceResults || [])
    .slice(0, 10)
    .map(r => ({
      driverId: r.Driver.driverId,
      code: r.Driver.code || r.Driver.driverId.slice(0, 3).toUpperCase(),
      color: getDriverColor(r.position)
    }));

  const timeToSeconds = (timeString) => {
    if (!timeString) return null;
    const parts = timeString.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      return minutes * 60 + seconds;
    }
    return null;
  };

  const chartData = [];
  const lapsToShow = Math.min(currentLap || lapData.length, lapData.length);

  for (let i = 0; i < lapsToShow; i++) {
    const lap = lapData[i];
    const lapEntry = { lap: lap.number };

    topDrivers.forEach(driver => {
      const timing = lap.Timings && lap.Timings.find(t => t.driverId === driver.driverId);
      if (timing && timing.time) lapEntry[driver.driverId] = timeToSeconds(timing.time);
    });

    chartData.push(lapEntry);
  }

  function getDriverColor(position) {
    const colors = ['#ff1801', '#00d4ff', '#00ff88', '#ffd700', '#ff00ff', '#00ffff', '#ff6b00', '#00ff00', '#ff0088', '#8800ff'];
    return colors[(parseInt(position, 10) - 1) % colors.length];
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '10px', borderRadius: '5px' }}>
          <p style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 8px 0' }}>Lap {label}</p>
          {payload.map((entry, idx) => {
            const driver = topDrivers.find(d => d.driverId === entry.dataKey);
            return <p key={idx} style={{ color: entry.color, margin: '4px 0', fontSize: '0.85rem' }}>{driver?.code}: {entry.value?.toFixed(3)}s</p>;
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '30px', padding: '20px', background: '#0f0f0f', borderRadius: '10px', border: '1px solid #333' }}>
      <h3 style={{ color: '#fff', marginBottom: '15px', fontSize: '1.1rem' }}>Lap Time Comparison (Top 10)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="lap" stroke="#888" label={{ value: 'Lap Number', position: 'insideBottom', offset: -5, fill: '#666' }} />
          <YAxis stroke="#888" domain={["auto", "auto"]} tickFormatter={(v) => `${v.toFixed(1)}s`} label={{ value: 'Lap Time', angle: -90, position: 'insideLeft', fill: '#666' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => (topDrivers.find(d => d.driverId === value)?.code || value)} />
          {topDrivers.map(driver => (
            <Line key={driver.driverId} type="monotone" dataKey={driver.driverId} stroke={driver.color} strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#666' }}>Showing lap times for top 10 finishers</div>
    </div>
  );
}

export default LapTimeChart;