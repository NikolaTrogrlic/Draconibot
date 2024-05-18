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

export const elementKeyArray = Object.keys(ElementalType);

export function randomElement() {
  const rand = Math.floor(Math.random() * elementKeyArray.length);
  const key = elementKeyArray[rand] as keyof typeof ElementalType;
  return ElementalType[key];
}

export function nextElement(element: ElementalType){
  let fetchIndex = 0;
  for(let i = 0;i < elementKeyArray.length;i++){
    if(elementKeyArray[i] == element){
      fetchIndex = i + 1;
      if(fetchIndex == elementKeyArray.length){
        fetchIndex = 0;
      }
    }
  }

  const key = elementKeyArray[fetchIndex] as keyof typeof ElementalType;
  return ElementalType[key];
}
