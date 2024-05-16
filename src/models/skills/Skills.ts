import { Skill } from "./Skill";
import { AttackAction } from "./general/AttackAction";
import { DefendAction } from "./general/DefendAction";

export class Skills{

   static generalSkills: Skill[] = [new AttackAction(), new DefendAction()]
   static jobSkills: Skill[] = [];
}