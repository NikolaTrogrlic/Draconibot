
import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { Scorch } from "../../effects/Scorch";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class FlameBolt extends Skill{

   name: SkillName = SkillName.FlameBolt;
   target: TargetType = TargetType.SingleEnemy;
   bpCost: number = 1;
   description: string = "1 BP - Shoot a MEDIUM **magic** **fire damage** bolt at a single target."
   
   skillEffect(user: Player, battle: Battle){

      let scorchTriggered: boolean = false;
      let targets = this.getTarget(user,battle);

      for(let combatant of targets){
         let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Medium, ElementalType.Fire);
         battle.display.addMessage(result.combatMessage);

         if(!scorchTriggered){
            scorchTriggered = Scorch.didEffectTrigger(result.damagedCharacter);
         }
      }

      if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
         targets.forEach(target => target.giveEffect(new Scorch()));
      }

      if(scorchTriggered){
        let messageDisplayed = false;
        for(let combatant of this.getTarget(user,battle)){
            if(combatant.stats.HP > 0 && messageDisplayed == false){
               battle.display.addMessage(new CombatMessage("\n**[SCORCH] Doublecast! Twin flames!**"));
               messageDisplayed = true;
            }
            let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Medium, ElementalType.Fire);
            battle.display.addMessage(result.combatMessage);
        }
      }
   }
}