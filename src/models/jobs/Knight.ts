import { Job } from "./Job";
import { Stats } from "../Stats";
import { JobName } from "../enums/JobName";
import { PassiveName } from "../enums/PassiveName";
import { Passive } from "../Passive";
import { ElementalType } from "../enums/ElementalType";

export class Knight extends Job{

    constructor() {
        const stats = new Stats({HP:30,strength:10,magic:0,luck:0,speed:0});
        const classElement = ElementalType.Water;

        const unlockablePassives = {
            3:  new Passive(PassiveName.Protect, "Gain +10 Armor. While in a party, take damage for allies below 25% HP.")
        };

        const unlockableSkills = {
            
        }

        super(JobName.Knight, stats, classElement, unlockableSkills, unlockablePassives)
    }
}