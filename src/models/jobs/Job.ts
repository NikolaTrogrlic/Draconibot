import { ElementalType } from "../enums/ElementalType";
import { JobName } from "../enums/JobName";
import { Passive } from "../Passive";
import { Skill } from "../skills/Skill";
import { Stats } from "../Stats";

export class Job {

  name: JobName;
  level: number;
  skills: Skill[]
  exp: number;
  jobElement: ElementalType;
  statModifiers: Stats;
  unlockableSkills: Record<number, Skill>;
  unlockablePassives:Record<number, Passive>;

  constructor(
    name: JobName,
    percantageStatModifiers: Stats,
    jobElement: ElementalType,
    unlockableSkills: Record<number,Skill>,
    unlockablePassives: Record<number, Passive>
  ) {
    this.unlockableSkills = unlockableSkills;
    this.unlockablePassives = unlockablePassives;
    this.exp = 0;
    this.skills = [];
    this.level = 1;
    this.name = name;
    this.statModifiers = percantageStatModifiers;
    this.jobElement = jobElement;
  }

  getUnlockedSkills(): Skill[]
  {
    let skills: Skill[] = [];

    for(let levelKey of Object.keys(this.unlockableSkills)){
      let level = Number(levelKey);
      if(level <= this.level){
        skills.push(this.unlockableSkills[level]);
      }
    }

    return skills;
  }

  getUnlockedPassives(): Passive[]{
    let passives: Passive[] = [];

    for(let levelKey of Object.keys(this.unlockablePassives)){
      let level = Number(levelKey);
      if(level <= this.level){
        passives.push(this.unlockablePassives[level]);
      }
    }

    return passives;
  }

  refreshSkills(){
    this.skills = this.getUnlockedSkills();
  }

}
