import { Monster } from "./Monster";
import { Slime } from "./plains/Slime";
import { CombatLocation } from "../enums/Location";
import { GoldenSlime } from "./plains/GoldenSlime";
import { getRandomPercent } from "../../random";
import { RapidReptile } from "./plains/RapidReptile";

export function createPlainsMonster(): Monster {
  const randomNumber = getRandomPercent();

  if (randomNumber < 5) {
    return new GoldenSlime();
  }
  else {
    return new Slime();
  }
}

export function createDesertMonster(): Monster {
  const randomNumber = getRandomPercent();

  if (randomNumber < 20) {
    return new GoldenSlime();
  } else {
    return new Slime();
  }
}

export function getLocationForLevel(number: number): CombatLocation {
  if (number < 5) {
    return CombatLocation.Plains;
  } else {
    return CombatLocation.Desert;
  }
}

export function createMonsters(
  location: CombatLocation,
  amountOfMonsters: number
): Monster[] {
  let monsters = [];

  for (let i = 0; i < amountOfMonsters; i++) {
    switch (location) {
      case CombatLocation.Plains:
        monsters.push(createPlainsMonster());
        break;
    }
  }

  let hearts = ["❤️", "🧡", "💚", "💜", "🤍", "🤎", "💛", "💙"];
  for (let i = 0; i < monsters.length; i++) {
    if (hearts.length > 0) {
      let fetchIndex = getRandomPercent() % hearts.length;
      monsters[i].nickname = `${hearts[fetchIndex]} ${monsters[i].name}`;
      hearts.splice(fetchIndex, 1);
    }
  }

  return monsters;
}

export function getRandomEncounterMonsterCount(partyMemberCount: number): number {
  const randomPercent = getRandomPercent();

  let amountOfMonsters = 1;

  switch (partyMemberCount) {
    case 1: {
      if (randomPercent < 5) {
        amountOfMonsters = 3;
      } else if (randomPercent < 50) {
        amountOfMonsters = 2;
      }
      break;
    }
    case 2: {
      if (randomPercent < 30) {
        amountOfMonsters = 3;
      } else if (randomPercent < 100) {
        amountOfMonsters = 2;
      }
      break;
    }
    case 3:
    case 4: {
      if (randomPercent < 50) {
        amountOfMonsters = 4;
      } else if (randomPercent < 100) {
        amountOfMonsters = 3;
      }
      break;
    }
  }

  return amountOfMonsters;
}