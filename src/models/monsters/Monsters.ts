import { Monster } from "./Monster";
import { Slime } from "./plains/Slime";
import { CombatLocation } from "../enums/Location";
import { GoldenSlime } from "./plains/GoldenSlime";
import { getRandomPercent } from "../../random";

export class Monsters {
  static createPlainsMonster(): Monster {
    const randomNumber = getRandomPercent();

    if (randomNumber < 20) {
      return new GoldenSlime();
    } else {
      return new Slime();
    }
  }

  static createDesertMonster(): Monster {
    const randomNumber = getRandomPercent();

    if (randomNumber < 20) {
      return new GoldenSlime();
    } else {
      return new Slime();
    }
  }

  static getLocationForLevel(number: number): CombatLocation {
    if (number < 5) {
      return CombatLocation.Plains;
    } else {
      return CombatLocation.Desert;
    }
  }

  static getMonstersForLocation(location: CombatLocation): Monster[] {
    const randomPercent = getRandomPercent();
    let amountOfMonsters = 1;

    if (randomPercent < 20) {
      amountOfMonsters = 3;
    } else if (randomPercent < 60) {
      amountOfMonsters = 2;
    }

    let monsters = [];

    for (let i = 0; i < amountOfMonsters; i++) {
      switch (location) {
        case CombatLocation.Plains:
          monsters.push(this.createPlainsMonster());
          break;
        case CombatLocation.Desert:
          monsters.push(this.createDesertMonster());
          break;
      }
    }

    let hearts = ["❤️", "🧡", "💚", "💜", "🤍", "🤎", "💛", "💙"];
    for (let i = 0; i < monsters.length; i++) {
        if(hearts.length > 0){
            let fetchIndex = getRandomPercent() % hearts.length;
            monsters[i].nickname = `${monsters[i].name} ${hearts[fetchIndex]}`;
            hearts.splice(fetchIndex,1);
        }
    }

    return monsters;
  }
}
