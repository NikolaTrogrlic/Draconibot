import { Job } from "./Job";
import { Stats } from "../Stats";
import { JobName } from "../enums/JobName";
import { PassiveName } from "../enums/PassiveName";
import { Passive } from "../Passive";
import { ElementalType } from "../enums/ElementalType";
import { CrossCut } from "../skills/knight/CrossCut";
import { RisingSlash } from "../skills/knight/RisingSlash";
import { BoulderBlade } from "../skills/knight/BoulderBlade";
import { HeroicGuard } from "../skills/knight/HeroicGuard";
import { ArmorUp } from "../skills/knight/ArmorUp";

export class Knight extends Job{

    constructor() {

        const stats = new Stats({HP:15,strength:10,magic:0,luck:10,speed:5});
        const classElement = ElementalType.Wind;

        const unlockablePassives = {
            3:  new Passive(PassiveName.BlockStance, "Gain a 35% chance to heal 10% of your maximum HP when defending."),
            5:  new Passive(PassiveName.SacredOath, "Gain a [LUCK] % chance to count as defending when performing the attack action."),
            7:  new Passive(PassiveName.AutoResistEarth, "Gain resistance to earth at the start of battle for 3 turns."),
            9:  new Passive(PassiveName.ShieldBash, "Follow up the 'Defend' action with a **WEAK strength based** physical attack on a targeted enemy."),
        };

        const unlockableSkills = {
            1: new CrossCut(),
            2: new RisingSlash(),
            4: new HeroicGuard(),
            6: new BoulderBlade(),
            8: new ArmorUp()
        }

        super(JobName.Knight, stats, classElement, unlockableSkills, unlockablePassives)
    }
}