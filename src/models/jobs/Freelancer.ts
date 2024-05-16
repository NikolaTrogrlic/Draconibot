import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../passives/Passive"
import { ElementalType } from "../enums/ElementalType"

export class Freelancer extends Job{

    constructor() {
        super(JobName.Freelancer, new Stats({HP:5,armor:5,resistance:5,pAtk:5,mAtk:5,luck:10,speed:5}),ElementalType.Earth)
    }

    static readonly unlockablePassives: Passive[] = [
        new Passive(PassiveName.Determination, JobName.Freelancer,"While above 1 HP, gain a chance to survive any hit with 1 HP.\nThe chance is equal to your LUCK stat, up to a maximum of 50%.", 1)
    ]
}