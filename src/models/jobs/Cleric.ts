import { Job } from "./Job"
import { Stats } from "../Stats"
import { JobName } from "../enums/JobName"
import { PassiveName } from "../enums/PassiveName"
import { Passive } from "../Passive";
import { ElementalType } from "../enums/ElementalType"

export class Cleric extends Job{

    constructor() {
        const stats = new Stats({HP:20,armor:10,resistance:10,pAtk:0,mAtk:0,luck:10,speed:0});
        const classElement = ElementalType.Light;

        const unlockablePassives = {
            3: new Passive(PassiveName.Mending,"Healing skills costing 2 BP or more have their effects doubled."),
            5: new Passive(PassiveName.Spellshield,"Defending reduces magical damage by an additional 25%."),
            6: new Passive(PassiveName.Gospel,"The first single target action each battle made agains t single allies targets all allies."),
            8: new Passive(PassiveName.Dawnbringer,"Dark field turns count as Light field turns.")
        };

        const unlockableSkills = {
            
        };

        super(JobName.Cleric, stats, classElement, unlockableSkills, unlockablePassives);
    }
}