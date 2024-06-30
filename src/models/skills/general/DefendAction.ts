
import { getRandomPercent } from "../../../random";
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { DamageModifier } from "../../enums/DamageModifier";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class DefendAction extends Skill{

   name: SkillName = SkillName.Defend;
   target: TargetType = TargetType.Self;
   bpCost: number = 0;
   
   skillEffect(user: Player, battle: Battle){
      user.isDefending = true;
      let message = new CombatMessage("🛡️ Defends.");
      battle.display.addMessage(message);
      DefendAction.onDefendAction(user,battle);

      let shieldBash = user.passives.find(x => x.name == PassiveName.ShieldBash);
      if(shieldBash){
         let result =  battle.dealDamageToCombatant(user,this.getTarget(user,battle,TargetType.SingleEnemy)[0],user.stats.strength * DamageModifier.Weak);
         result.combatMessage.message = "[Shield Bash]" + result.combatMessage.message;
         battle.display.addMessage(result.combatMessage);
      }
   }

   static onDefendAction(user: Player, battle: Battle){
      let blockStance = user.passives.find(x => x.name == PassiveName.BlockStance);
      if(blockStance && (getRandomPercent() < 35)){
         let tenPercent = Math.round(user.stats.HP * 0.1);
         user.heal(tenPercent);
         battle.display.addMessage(new CombatMessage(`[Block Stance] Restores ${tenPercent} HP.`));
      }
   }
}