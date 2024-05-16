import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../passives/Passive"
import { ElementalType } from "../enums/ElementalType"

export class Pyromancer extends Job{

    constructor() {
        super(JobName.Pyromancer, new Stats({HP:10,armor:0,resistance:10,pAtk:0,mAtk:20,luck:0,speed:0}),ElementalType.Fire)
    }

    static readonly unlockablePassives: Passive[] = [
        new Passive(PassiveName.Pyroblast, JobName.Pyromancer, "When spending 2 BP on a skill, also cast a Flaming Missile.", 1)
    ]
}