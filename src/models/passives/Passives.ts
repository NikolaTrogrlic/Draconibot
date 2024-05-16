import { JobName } from "../enums/JobName";
import { Cleric } from "../jobs/Cleric";
import { Freelancer } from "../jobs/Freelancer";
import { Knight } from "../jobs/Knight";
import { Pyromancer } from "../jobs/Pyromancer";
import { Passive } from "./Passive";

export class Passives{

    static getPassivesForJob(job: JobName, jobLevel: number): Passive[]{
        return this.passives.filter(passive => passive.job == job && passive.unlockLevel <= jobLevel);
    }

    static readonly passives: Passive[] = [
        ...Pyromancer.unlockablePassives,
        ...Cleric.unlockablePassives,
        ...Knight.unlockablePassives,
        ...Freelancer.unlockablePassives
    ]
}