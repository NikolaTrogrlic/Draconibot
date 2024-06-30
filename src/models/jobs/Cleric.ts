import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive";
import { ElementalType } from "../enums/ElementalType"

export class Cleric extends Job{

    constructor() {
        const stats = new Stats({HP:20,strength:0,magic:10,luck:10,speed:0});
        const classElement = ElementalType.Water;

        const unlockablePassives = {
            
        };

        const unlockableSkills = {
            
        };

        super(JobName.Cleric, stats, classElement, unlockableSkills, unlockablePassives);
    }
}