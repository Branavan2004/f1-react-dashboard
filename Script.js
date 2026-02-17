
particlesJS.load('particles-js', 'https://cdn.jsdelivr.net/gh/VincentGarreau/particles.js/particles.json');

const drivers = [
  { name: "Oscar Piastri", team: "McLaren", points: 284, color: "#ff9900" },
  { name: "Lando Norris", team: "McLaren", points: 275, color: "#ff9900" },
  { name: "Max Verstappen", team: "Red Bull Racing", points: 187, color: "#1e90ff" },
  { name: "George Russell", team: "Mercedes", points: 172, color: "#00c2cb" },
  { name: "Charles Leclerc", team: "Ferrari", points: 151, color: "#ff2e2e" },
  { name: "Lewis Hamilton", team: "Ferrari", points: 109, color: "#ff2e2e" },
  { name: "Kimi Antoli", team: "Mercedes", points: 64, color: "#00c2cb" },
  { name: "Alex Albon", team: "Williams", points: 54, color: "#1951baff" },
  { name: "Nico Hülkenberg", team: "Kick Sauber", points: 37, color: "#45e00dff" },
  { name: "Esteban Ocon", team: "Hass", points: 27, color: "#a00d1bff" },
  { name: "Fernando Alonso", team: "Aston Martin", points: 26, color: "#46bfbdff" },
  { name: "Lance Stroll", team: "Aston Martin", points: 26, color: "#46bfbdff" },
  { name: "Isal Idjar", team: "Racing Bulls", points: 22, color: "#eaecedff" },
  { name: "Pierre Gasly", team: "Alpine", points: 20, color: "#278ff8ff" },
  { name: "Liam Lawson", team: "Racing Bulls", points: 20, color: "#eaecedff" },
  { name: "Carlos Sainz", team: "Williams", points: 16, color: "#1951baff" },
  { name: "Gabriel Bortoleto", team: "Kick Sauber", points: 14, color: "#45e00dff" },
  { name: "Yuki Tsunoda", team: "Red Bull Racing", points: 10, color: "#1e90ff" },
  { name: "Oliver Bearman", team: "Hass", points: 8, color: "#a00d1bff" },
  { name: "Colapinto", team: "Alpine", points: 0, color: "#278ff8ff" }
];

// Sort by points descending
drivers.sort((a, b) => b.points - a.points);

// Render driver cards
const container = document.getElementById('driver-container');
drivers.forEach(driver => {
  const card = document.createElement('div');
  card.className = 'driver-card';
  card.style.borderLeftColor = driver.color;
  card.innerHTML = `
    <h3>${driver.name}</h3>
    <p>Team: ${driver.team}</p>
    <p>Points: ${driver.points}</p>
  `;
  container.appendChild(card);
});