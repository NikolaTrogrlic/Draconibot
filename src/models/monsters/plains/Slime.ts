
import { getRandomPercent } from "../../../random";
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { Jumping } from "../../effects/CounterAttackEffects/Jumping";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class Slime extends Monster{

   constructor(){
      super("Slime", 2, new Stats({HP: 25, strength: 5, magic: 6, luck: 0, speed: 6}), 20);
      this.weaknesses = [ElementalType.Fire]
   }

   performCombatTurn(battle: Battle){
      
      if(getRandomPercent() < 40){
         battle.display.addMessage("The slime jumps low!");
         this.giveEffect(new Jumping(false));
         let result = this.attackRandomPlayer(battle);
         battle.display.addMessage(result.combatMessage);
      }
      else{
         battle.display.addMessage("The slime jumps high!");
         this.giveEffect(new Jumping(true));
         let result = this.attackRandomPlayer(battle,this.stats.strength + 5);
         battle.display.addMessage(result.combatMessage);
      }
   }
}