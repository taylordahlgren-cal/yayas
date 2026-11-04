export const PLACE_TYPES = [
  { value: "park", label: "Park", emoji: "🌳" },
  { value: "trail", label: "Trail", emoji: "🥾" },
  { value: "beach", label: "Beach", emoji: "🏖️" },
  { value: "neighborhood", label: "Neighborhood walk", emoji: "🏘️" },
  { value: "treat stop", label: "Treat stop", emoji: "🦴", dogModeOnly: true },
];

export const AMENITIES = [
  { key: "fenced", label: "Fenced", emoji: "🚧" },
  { key: "off_leash", label: "Off-leash", emoji: "🐕" },
  { key: "swimming", label: "Swimming", emoji: "🏊" },
  { key: "walkable_from_home", label: "Walkable from home", emoji: "🏠" },
];

export const WARNINGS = [
  { key: "crowded", label: "Crowded", emoji: "👥" },
  { key: "bikers", label: "Bikers", emoji: "🚴" },
  { key: "kids", label: "Kids around", emoji: "🧒" },
];

export const typeInfo = (value) => PLACE_TYPES.find((t) => t.value === value) || PLACE_TYPES[0];
