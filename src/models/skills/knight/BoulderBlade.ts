import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class BoulderBlade extends Skill{

   name: SkillName = SkillName.BoulderBlade;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   description: string = "2 BP - Deal **MEDIUM strength based** earth damage to a single target. This action is performed again for free if it resulted in defeating an enemy.";
   
   skillEffect(user: Player, battle: Battle){

      let result = battle.dealDamageToCombatant(user,this.getTarget(user,battle)[0],user.stats.strength * DamageModifier.Medium, ElementalType.Earth);
      battle.display.addMessage(result.combatMessage);

      let wasDefeated = result.wasDefeated;
      while(wasDefeated){
         let target = battle.monsters.find(x => x.stats.HP > 0);
         if(target){
            let result2 = battle.dealDamageToCombatant(user,target,user.stats.strength * DamageModifier.Medium, ElementalType.Earth);
            result2.combatMessage = `**[Extra Hit !]**` + result2.combatMessage;
            battle.display.addMessage(result2.combatMessage);
            wasDefeated = result2.wasDefeated;
         }
         else{
            wasDefeated = false;
         }
      }
   }
}