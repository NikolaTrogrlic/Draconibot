import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { CombatMessage } from "../../battle/CombatMessage";
import { Blinded } from "../../effects/OnAttackingEffects/Blinded";
import { Scorch } from "../../effects/Scorch";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class SunStrike extends Skill{

    name: SkillName = SkillName.SunStrike;
    target: TargetType = TargetType.SingleEnemy;
    bpCost: number = 2;
    description: string = "2 BP - Inflicts **Blind** and **Scorch** on hit target for 2 turns."
    
    skillEffect(user: Player, battle: Battle){
 
       let scorchTriggered: boolean = false;
       let targets = this.getTarget(user,battle);
 
       for(let combatant of targets){
        battle.display.addMessage(new CombatMessage(`Shoots a blinding beam of light at ${combatant.nickname}.`));
        combatant.giveEffect(new Scorch());
        combatant.giveEffect(new Blinded());

         if(!scorchTriggered){
            scorchTriggered = Scorch.didEffectTrigger(combatant);
         }
       }

       if(user.passives.find(x => x.name == PassiveName.HeatHaze)){
         targets.forEach(target => target.giveEffect(new Scorch()));
       }
 
       if(scorchTriggered){
            battle.display.addMessage(new CombatMessage("[SCORCH] Doublecast! Extra stack of scorch inflicted and blind duration increased."));
            for(let combatant of this.getTarget(user,battle)){
                combatant.giveEffect(new Scorch());
                combatant.giveEffect(new Blinded());
            }  
        }
    }
 }