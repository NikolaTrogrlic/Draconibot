import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { ElementalType } from "../../enums/ElementalType";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";

export class BoulderBlade extends Skill{

   name: SkillName = SkillName.BoulderBlade;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   description: string = "2 BP - Deal [1.3x STR] earth damage to a single target. This action is free and performed again if it defeats a target. Unaffected by targeting changing passives.";
   
   skillEffect(user: Player, battle: Battle){

      let result = battle.dealDamageToCombatant(this.getTarget(user,battle)[0],user.stats.strength * 1.3, ElementalType.Earth);
      battle.display.addMessage(result.combatMessage);

      let wasDefeated = result.wasDefeated;
      while(wasDefeated){
         let target = battle.monsters.find(x => x.stats.HP > 0);
         if(target){
            let result2 = battle.dealDamageToCombatant(target,user.stats.strength * 1.3, ElementalType.Earth);
            result2.combatMessage.message = `**[Extra Hit !]**` + result2.combatMessage.message;
            battle.display.addMessage(result2.combatMessage);
            wasDefeated = result2.wasDefeated;
         }
         else{
            wasDefeated = false;
         }
      }
   }
}