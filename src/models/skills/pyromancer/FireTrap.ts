import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { FireTrapEffect } from "../../effects/CounterAttackEffects/FireTrapEffect";
import { Scorch } from "../../effects/Scorch";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class FireTrap extends Skill{

    name: SkillName = SkillName.FireTrap;
    target: TargetType = TargetType.Self;
    bpCost: number = 1;
    description: string = "1 BP - Gain 2 stacks of Fire Trap. For each stack, **Counter** physical attacks with a WEAK fire damage attack. Maximum 5 stacks. Lasts 2 turns. Free Action."
    
    skillEffect(user: Player, battle: Battle){
 
       let scorchTriggered: boolean = false;
       const targets = this.getTarget(user,battle);

       user.actions++;

       for(let combatant of targets){
        battle.display.addMessage(new CombatMessage(`Places down magical traps. [+2 Fire Trap ♨️]`));
        combatant.giveEffect(new FireTrapEffect());

         if(!scorchTriggered){
            scorchTriggered = Scorch.didEffectTrigger(combatant);
         }
       }

       if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
        targets.forEach(target => target.giveEffect(new Scorch()));
       }
 
       if(scorchTriggered){
            for(let combatant of this.getTarget(user,battle)){
                battle.display.addMessage(new CombatMessage(` [SCORCH] [+2 Fire Trap ♨️]`));
                combatant.giveEffect(new FireTrapEffect());
            }
        }
    }
 }