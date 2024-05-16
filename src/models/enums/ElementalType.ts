export enum ElementalType {
  Fire = "🔥",
  Water = "🌊",
  Earth = "⛰️",
  Wind = "🌪️",
  Lightning = "⚡",
  Light = "⚪",
  Dark = "🌑",
  Physical = "⚔️",
}

export function randomElement() {
  const rand = Math.floor(Math.random() * Object.keys(ElementalType).length);
  const key = Object.keys(ElementalType)[rand] as keyof typeof ElementalType;
  return ElementalType[key];
}
