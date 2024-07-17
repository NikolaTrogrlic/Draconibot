import { Player } from "../../Player";
import { Battle } from "../../battle/Battle";
import { DefenseUp } from "../../effects/WhenHitEffects/DefenseUp";
import { SkillName } from "../../enums/SkillName";
import { TargetType } from "../../enums/TargetType";
import { Skill } from "../Skill";

export class ArmorUp extends Skill{

   name: SkillName = SkillName.ArmorUp;
   target: TargetType = TargetType.Party;
   bpCost: number = 2;
   description: string = "2 BP - Grant Defense Up to all allies for **3 turns**.";
   
   skillEffect(user: Player, battle: Battle){
      battle.display.addMessage(`**Raises the party's ⚔️ defense !**`);
      
      for(let ally of this.getTarget(user,battle)){
         ally.giveEffect(new DefenseUp());
      }
   }
}