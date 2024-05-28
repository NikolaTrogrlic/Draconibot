
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { getMonsters } from "../../battle/BattleUtils";
import { CombatMessage } from "../../battle/CombatMessage";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class RapidReptile extends Monster{

   constructor(){
      super("Rapid Reptile", 4, new Stats({HP: 30, strength: 8, magic: 6, luck: 30, speed: 6}));
      this.weaknesses = [ElementalType.Fire, ElementalType.Lightning]
      this.resistances = [ElementalType.Water]
   }

   performCombatTurn(battle: Battle){
      battle.display.isShowingMessagesOneByOne = true;
      if(this.isLucky()){
         let monsters = getMonsters(battle.combatants);
         if(monsters.length > 1){
            battle.display.addMessage(new CombatMessage("Encourages allies, raising their strength."));
         for(let combatant of monsters){
            if(combatant.nickname != this.nickname){
               combatant.stats.strength++;
            }
         }
         }
         else{
            let message = new CombatMessage("Perform a heavy hit");
            message.keyFrames = [
               "Perform a 💥heavy hit.",
               "Perform a **heavy**💥 hit.",
               "Perform a **heavy** hit. 💥",

            ];
            battle.display.addMessage(message);
            let result = this.attackRandomPlayer(battle, this.stats.strength, 2);
            battle.display.addMessage(result.combatMessage);
            
         }
      }
      else{
         battle.display.addMessage(new CombatMessage("Performs a swift strike with a pitchfork."));
         let result = this.attackRandomPlayer(battle)
         battle.display.addMessage(result.combatMessage);
         if(this.stats.speed < 30){
            battle.display.addMessage(new CombatMessage(`${this.nickname} seems to be getting faster.`));
            this.stats.speed++;
         }
      }
   }
}
