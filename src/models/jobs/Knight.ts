import { Job } from "./Job";
import { Stats } from "../Stats";
import { JobName } from "../enums/JobName";
import { PassiveName } from "../enums/PassiveName";
import { Passive } from "../passives/Passive";
import { ElementalType } from "../enums/ElementalType";

export class Knight extends Job{

    constructor() {
        super(JobName.Knight, new Stats({HP:10,armor:10,resistance:10,pAtk:10,mAtk:0,luck:0,speed:0}),ElementalType.Water)
    }

    static readonly unlockablePassives: Passive[] = [
        new Passive(PassiveName.Protect, JobName.Knight, "Gain +10 Armor. While in a party, take damage for allies below 25% HP.", 1)
    ]
}