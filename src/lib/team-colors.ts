// F1 2025 team colors (HSL values used via inline styles)
export const TEAM_COLORS: Record<string, string> = {
  red_bull: "#3671C6",
  mercedes: "#27F4D2",
  ferrari: "#E8002D",
  mclaren: "#FF8000",
  aston_martin: "#229971",
  alpine: "#FF87BC",
  williams: "#64C4FF",
  rb: "#6692FF",
  kick_sauber: "#52E252",
  haas: "#B6BABD",
  // Fallback aliases
  sauber: "#52E252",
  alphatauri: "#6692FF",
  alfa: "#52E252",
};

export function getTeamColor(constructorId: string): string {
  return TEAM_COLORS[constructorId] || "#888888";
}

// Country flag emoji mapping for race cards
export const COUNTRY_FLAGS: Record<string, string> = {
  Australia: "🇦🇺",
  China: "🇨🇳",
  Japan: "🇯🇵",
  Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦",
  USA: "🇺🇸",
  Italy: "🇮🇹",
  Monaco: "🇲🇨",
  Spain: "🇪🇸",
  Canada: "🇨🇦",
  Austria: "🇦🇹",
  UK: "🇬🇧",
  Hungary: "🇭🇺",
  Belgium: "🇧🇪",
  Netherlands: "🇳🇱",
  Singapore: "🇸🇬",
  Azerbaijan: "🇦🇿",
  Mexico: "🇲🇽",
  Brazil: "🇧🇷",
  "United States": "🇺🇸",
  Qatar: "🇶🇦",
  UAE: "🇦🇪",
  "Las Vegas": "🇺🇸",
  Miami: "🇺🇸",
};

export function getCountryFlag(country: string): string {
  return COUNTRY_FLAGS[country] || "🏁";
}
