
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { DamageModifier } from "../../enums/DamageModifier";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";
import { AttackAction } from "../general/AttackAction";

export class CrossCut extends Skill{

   name: SkillName = SkillName.CrossCut;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 2;
   description: string = "2 BP - Perform **two LIGHT strength based** physical attacks on a single target. Both hits benefit from any benefits to the Attack action.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(new CombatMessage(`***Slashes twice !\n***`));
      for(let combatant of this.getTarget(user,battle)){

         let result = battle.dealDamageToCombatant(user,combatant,user.stats.strength * DamageModifier.Light,AttackAction.getNormalAttackElement(user));
         battle.display.addMessage(result.combatMessage);
         AttackAction.checkSacredOathTrigger(user,battle);
         
         //Second hit only if enemy is still alive
         if(combatant.stats.HP > 0){
            let result2 =  battle.dealDamageToCombatant(user,combatant,user.stats.strength * DamageModifier.Light,AttackAction.getNormalAttackElement(user));
            battle.display.addMessage(result2.combatMessage);
            AttackAction.checkSacredOathTrigger(user,battle);
         }
      }
   }
}