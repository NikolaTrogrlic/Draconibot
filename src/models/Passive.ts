import { JobName } from "./enums/JobName";
import { PassiveName } from "./enums/PassiveName";

export class Passive{
  
    name: PassiveName;
    description: string =  "No description";
    
    constructor(passive: PassiveName, description: string) {
        this.name = passive;
        this.description = description;
    }
}
