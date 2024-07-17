import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { Scorch } from "../../effects/Scorch";
import { DamageModifier } from "../../enums/DamageModifier";
import { ElementalType } from "../../enums/ElementalType";
import { PassiveName } from "../../enums/PassiveName";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class Fireball extends Skill{

    name: SkillName = SkillName.Fireball;
    target: TargetType = TargetType.AllEnemies;
    bpCost: number = 3;
    description: string = "3 BP - Shoot a HEAVY **magic fire damage** flaming ball of fire, dealing damage to all enemies."
    
    skillEffect(user: Player, battle: Battle){

      let scorchTriggered: boolean = false;
       battle.display.addMessage(`***Shoots a ball of fire. 🔥***`);
       const targets = this.getTarget(user,battle);

       for(let combatant of targets){
          let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Heavy, ElementalType.Fire);
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
            battle.display.addMessage("\n**[SCORCH] Doublecast! Nova flame!**");
            messageDisplayed = true;
          }
            let result =  battle.dealDamageToCombatant(user,combatant,user.stats.magic * DamageModifier.Heavy, ElementalType.Fire);
            battle.display.addMessage(result.combatMessage);
        }
      }
    }
 }