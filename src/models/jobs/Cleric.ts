import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../passives/Passive"
import { ElementalType } from "../enums/ElementalType"

export class Cleric extends Job{

    constructor() {
        super(JobName.Cleric, new Stats({HP:20,armor:5,resistance:5,pAtk:0,mAtk:0,luck:10,speed:0}),ElementalType.Light)
    }

    static readonly unlockablePassives: Passive[] = [
        new Passive(PassiveName.Mending, JobName.Cleric,"Healing skills costing 2 BP or more have their effects doubled.", 3),
        new Passive(PassiveName.Spellshield, JobName.Cleric,"Defending reduces magical damage by an additional 25%.", 5),
        new Passive(PassiveName.Gospel, JobName.Cleric,"The first single target action each battle made against single allies targets all allies.", 6),
        new Passive(PassiveName.Dawnbringer, JobName.Cleric,"Dark field turns count as Light field turns.", 8)
    ]
}