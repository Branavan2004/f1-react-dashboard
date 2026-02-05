import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TelemetryChart({ driverName }) {
  // Simulating lap time data for the last 5 races
  // In a real scenario, this would come from the API
  const data = [
    { race: 'Bahrain', time: 92.5 },
    { race: 'Saudi', time: 88.2 },
    { race: 'Australia', time: 77.9 },
    { race: 'Japan', time: 91.0 },
    { race: 'China', time: 95.4 },
  ];

  return (
    <div style={{ width: '100%', height: 300, backgroundColor: '#222', padding: '10px', borderRadius: '10px' }}>
      <h4 style={{ color: '#fff', textAlign: 'center' }}>{driverName} - Lap Time Trend</h4>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="race" stroke="#888" />
          <YAxis stroke="#888" domain={['auto', 'auto']} />
          <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
          <Line type="monotone" dataKey="time" stroke="#ff1801" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TelemetryChart;