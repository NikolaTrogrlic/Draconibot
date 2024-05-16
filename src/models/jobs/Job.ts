import { ElementalType } from "../enums/ElementalType";
import { JobName } from "../enums/JobName";
import { Passive } from "../passives/Passive";
import { Skill } from "../skills/Skill";
import { Stats } from "../Stats";

export class Job {

  name: JobName;
  level: number;
  skills: Skill[]
  exp: number;
  jobElement: ElementalType;
  statModifiers: Stats;
  passives: Passive[];

  constructor(
    name: JobName,
    percantageStatModifiers: Stats,
    jobElement: ElementalType
  ) {
    this.passives = [];
    this.exp = 0;
    this.skills = [];
    this.level = 1;
    this.name = name;
    this.statModifiers = percantageStatModifiers;
    this.passives = [];
    this.jobElement = jobElement;
  }
}
