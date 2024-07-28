
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class GoldenSlime extends Monster{

   constructor(){
      super("Golden Slime", 2, new Stats({HP: 20, strength: 8, magic: 5, luck: 40, speed: 5}),50);
      this.resistances = [ElementalType.Wind,ElementalType.Physical]
      this.weaknesses = [ElementalType.Fire];
      this.jobExp = 20;
   }

   performCombatTurn(battle: Battle){

      if(this.isLucky()){
         for(let monster of battle.monsters){
            monster.heal(5);
         }
         battle.display.addMessage("Secretes a funky liquid.\nAll enemies are healed 5 HP.");
      }
      else{
         battle.display.addMessage("Shines brightly.");
      }
   }
}