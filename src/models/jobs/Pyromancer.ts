import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive"
import { ElementalType } from "../enums/ElementalType"
import { FlameBolt } from "../skills/pyromancer/FlameBolt"
import { Fireball } from "../skills/pyromancer/Fireball"
import { SunStrike } from "../skills/pyromancer/SunStrike"
import { FireTrap } from "../skills/pyromancer/FireTrap"
import { Flicker } from "../skills/pyromancer/Flicker"

export class Pyromancer extends Job{

    constructor() {
        const stats = new Stats({HP:0,strength:0,magic:20,luck:20,speed:0});
        const classElement = ElementalType.Fire;

        const unlockablePassives = {
            3: new Passive(PassiveName.HeatHaze, "All Pyromancer skills inflict Scorch on hit enemies for 2 turns."),
            5: new Passive(PassiveName.AutoResistFire, "Gain resistance to fire at the start of battle for 3 turns."),
            7: new Passive(PassiveName.Torchlight, "Performing the **Attack** command does fire damage instead of physical damage."),
            9: new Passive(PassiveName.TestOfWill, "Passive effects that trigger at the start of battle now last an additional turn.")
        };

        const unlockableSkills = {
            1: new FlameBolt(),
            2: new Fireball(),
            4: new SunStrike(),
            6: new FireTrap(),
            8: new Flicker()
        }

        super(JobName.Pyromancer, stats, classElement, unlockableSkills, unlockablePassives)
    }
}