import { Battle } from "../../Battle";
import { Stats } from "../../Stats";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class GoldenSlime extends Monster{

   constructor(){
      super("Golden Slime", 2, new Stats({HP: 20, armor: 0, resistance: 5, pAtk: 5, mAtk: 5, luck: 40, speed: 5}));
      this.bonusEXP = 20;
      this.resistances = [ElementalType.Fire]
   }

   performCombatTurn(battle: Battle): string {

      if(this.isLucky()){
         for(let combatant of battle.getMonsters()){
            combatant.heal(5);
         }
         return "Heals all monsters by 5 HP";
      }
      else{
         return "Shines brightly."
      }
   }
}