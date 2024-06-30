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
    bpCost: number = 2;
    description: string = "2 BP - For the next 3 turns, **Counter** physical attacks with a WEAK fire damage attack. 0 BP and Free Action when performed on the first round."
    
    skillEffect(user: Player, battle: Battle){
 
       let scorchTriggered: boolean = false;

       if(battle.round == 1){
        user.bp += 2;
        user.actions++;
       }
 
       for(let combatant of this.getTarget(user,battle)){
        battle.display.addMessage(new CombatMessage(`Sets a magical trap beneath them.`));
        combatant.giveEffect(new FireTrapEffect());

         if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
            combatant.giveEffect(new Scorch());
         }

         if(!scorchTriggered){
            scorchTriggered = Scorch.didEffectTrigger(combatant);
         }
       }
 
       if(scorchTriggered){
            for(let combatant of this.getTarget(user,battle)){
                let fireTrap = combatant.effects.find(x => x.name == "Fire Trap");
                battle.display.addMessage(new CombatMessage(`[SCORCH] Doublecast !\n -An extra trap is placed and the trap limit is set to 2.`));
                if(fireTrap && fireTrap.maxStacks < 2){
                    fireTrap.maxStacks = 2;
                    fireTrap.stacks++;
                }
                else{
                    combatant.giveEffect(new FireTrapEffect());
                }
            }
        }
    }
 }