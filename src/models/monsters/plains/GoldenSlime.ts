
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { getMonsters } from "../../battle/BattleUtils";
import { CombatMessage } from "../../battle/CombatMessage";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class GoldenSlime extends Monster{

   constructor(){
      super("Golden Slime", 2, new Stats({HP: 20, strength: 5, magic: 5, luck: 40, speed: 5}));
      this.bonusEXP = 20;
      this.resistances = [ElementalType.Fire]
      this.weaknesses = [ElementalType.Wind];
   }

   performCombatTurn(battle: Battle){

      if(this.isLucky()){
         for(let combatant of getMonsters(battle.combatants)){
            combatant.heal(5);
         }
         battle.display.addMessage(new CombatMessage("Secretes a funky liquid, healing all monsters by 5 HP."));
      }
      else{
         battle.display.addMessage(new CombatMessage("Shines brightly."));
      }
   }
}