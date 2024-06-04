
import { getRandomPercent } from "../../../random";
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { Skill, TargetType } from "../Skill";
import { DefendAction } from "./DefendAction";

export class AttackAction extends Skill{

   name: SkillName = SkillName.Attack;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){

      AttackAction.checkSacredOathTrigger(user,battle);

      for(let combatant of this.getTarget(user,battle)){
         let result =  battle.dealDamageToCombatant(combatant,user.stats.strength * 1.2);
         battle.display.addMessage(result.combatMessage);
      }
   }

   static checkSacredOathTrigger(user: Player, battle: Battle){
      let sacredOath = user.passives.find(x => x.name == PassiveName.SacredOath);
      if(sacredOath && getRandomPercent() <= user.stats.luck){
         user.isDefending = true;
         battle.display.addMessage(new CombatMessage("[Sacred Oath] Defends while attacking."));
         DefendAction.onDefendAction(user,battle);
      }
   }
}