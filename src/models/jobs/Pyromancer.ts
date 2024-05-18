import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive"
import { ElementalType } from "../enums/ElementalType"

export class Pyromancer extends Job{

    constructor() {
        const stats = new Stats({HP:10,armor:0,resistance:25,pAtk:0,mAtk:20,luck:0,speed:0});
        const classElement = ElementalType.Fire;

        const unlockablePassives = {
            3:  new Passive(PassiveName.Pyroblast, "When spending 2 BP on a skill, also cast a Flaming Missile.")
        };

        const unlockableSkills = {
            
        }

        super(JobName.Pyromancer, stats, classElement, unlockableSkills, unlockablePassives)
    }
}