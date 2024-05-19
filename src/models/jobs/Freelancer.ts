import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive"
import { ElementalType } from "../enums/ElementalType"
import { CrossCut } from "../skills/freelancer/CrossCut"
import { RisingSlash } from "../skills/freelancer/RisingSlash"

export class Freelancer extends Job{

    constructor() {
        const stats = new Stats({HP:5,armor:10,resistance:10,pAtk:5,mAtk:5,luck:10,speed:5});
        const classElement = ElementalType.Earth;

        const unlockablePassives = {
            3: new Passive(PassiveName.Lucky,"Attacks have a 10% chance to critically hit, increasing final damage by 50%."),
            5: new Passive(PassiveName.EarlyBird,"On the first turn of battle, all turns are 'wind' field turns."),
            7: new Passive(PassiveName.NightShift,"Heal 5% of maximum health when performing actions on 'dark' field turns."),
            9: new Passive(PassiveName.Commute,"Free actions cycle elemental terrain.")
        };

        const unlockableSkills = {
            2: new CrossCut(),
            4: new RisingSlash()
        }

        super(JobName.Freelancer, stats, classElement, unlockableSkills, unlockablePassives)
    }
}