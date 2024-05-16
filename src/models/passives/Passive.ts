import { JobName } from "../enums/JobName";
import { PassiveName } from "../enums/PassiveName";

export class Passive{
  
    name: PassiveName;
    job: JobName;
    unlockLevel: number;
    description: string =  "No description";
    
    constructor(passive: PassiveName, fromClass: JobName, description: string, unlockLevel: number) {
        this.name = passive;
        this.job = fromClass;
        this.description = description;
        this.unlockLevel = unlockLevel;
    }
}
