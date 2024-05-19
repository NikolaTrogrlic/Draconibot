import { Battle } from "../../Battle";
import { Stats } from "../../Stats";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class Slime extends Monster{

   constructor(){
      super("Slime", 4, new Stats({HP: 15, armor: 5, resistance: 0, pAtk: 10, mAtk: 10, luck: 0, speed: 10}));
      this.weaknesses = [ElementalType.Fire]
   }

   performCombatTurn(battle: Battle): string[] {
      return [this.attackRandomPlayer(battle)];
   }
}