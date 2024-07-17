
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class RapidReptile extends Monster{

   constructor(){
      super("Rapid Reptile", 4, new Stats({HP: 15, strength: 10, magic: 6, luck: 30, speed: 6}));
      this.weaknesses = [ElementalType.Fire, ElementalType.Lightning]
      this.resistances = [ElementalType.Water]
   }

   performCombatTurn(battle: Battle){
      battle.display.isShowingMessagesOneByOne = true;
      if(this.isLucky()){
         if(battle.monsters.length > 1){
            battle.display.addMessage("Encourages allies, raising their strength.");
         for(let combatant of battle.monsters){
            if(combatant.nickname != this.nickname){
               combatant.stats.strength++;
            }
         }
         }
         else{
            battle.display.addMessage("Perform a **heavy** hit. 💥");
            let result = this.attackRandomPlayer(battle, this.stats.strength, DamageModifier.Heavy);
            battle.display.addMessage(result.combatMessage);
            
         }
      }
      else{
         battle.display.addMessage("Performs a swift strike with a pitchfork.");
         let result = this.attackRandomPlayer(battle)
         battle.display.addMessage(result.combatMessage);
         if(this.stats.speed < 30){
            battle.display.addMessage(`${this.nickname}'s attacks seem to be getting faster.`);
            this.stats.speed++;
         }
      }
   }
}
