
import { Stats } from "../../Stats";
import { Battle } from "../../battle/Battle";
import { ElementalType } from "../../enums/ElementalType";
import { Monster } from "../Monster";

export class Slime extends Monster{

   constructor(){
      super("Slime", 2, new Stats({HP: 20, strength: 6, magic: 6, luck: 0, speed: 6}));
      this.weaknesses = [ElementalType.Fire]
   }

   performCombatTurn(battle: Battle){
      let result = this.attackRandomPlayer(battle);
      battle.display.addMessage(result.combatMessage);
   }
}