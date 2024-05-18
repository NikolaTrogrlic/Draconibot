import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive"
import { ElementalType } from "../enums/ElementalType"

export class Freelancer extends Job{

    constructor() {
        const stats = new Stats({HP:5,armor:10,resistance:10,pAtk:5,mAtk:5,luck:10,speed:5});
        const classElement = ElementalType.Earth;

        const unlockablePassives = {
            2: new Passive(PassiveName.Determination,"While above 1 HP, gain a chance to survive any hit with 1 HP.\nThe chance is equal to your LUCK stat, up to a maximum of 50%.")
        };

        const unlockableSkills = {
            
        }

        super(JobName.Freelancer, stats, classElement, unlockableSkills, unlockablePassives)
    }
}