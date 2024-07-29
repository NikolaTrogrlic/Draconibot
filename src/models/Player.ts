import { JobName } from "./enums/JobName";
import { Job } from "./jobs/Job";
import { Combatant } from "./Combatant";
import { Stats } from "./Stats";
import { Passive } from "./Passive";
import { Jobs } from "./jobs/Jobs";
import { Skill } from "./skills/Skill";
import { AttackAction } from "./skills/general/AttackAction";
import { DefendAction } from "./skills/general/DefendAction";
import { Knight } from "./jobs/Knight";
import { BurstAction } from "./skills/general/BurstAction";
import { FleeAction } from "./skills/general/FleeAction";
import { Pyromancer } from "./jobs/Pyromancer";
import { MenuHandler } from "./MenuHandler";
import { CommandInteraction } from "discord.js";
import { Tests } from "../tests";
import { Quest } from "./quests/Quest";
import { Party } from "./Party";

export class Player extends Combatant {
  constructor(name: string, id: string, createInteraction: CommandInteraction) {
    super(
      name,
      new Stats({
        HP: 100,
        strength: 10,
        magic: 10,
        speed: 5,
        luck: 0,
      }),
      undefined
    );

    this.menu = new MenuHandler(createInteraction);
    this.userID = id;
    this.jobs = Jobs.getJobsForLevel(1);
    this.changeMainJob(JobName.Pyromancer);

    //Tests.setMaxLevelMainJob(this,JobName.Pyromancer);

    this.changeSubJob(JobName.Knight);
    this.burst = 0;
    this.maxBurst = 100;
    this.lastLeaveCommandUse.setTime(this.lastLeaveCommandUse.getTime() - (1000 * 60 * 5));
  }

  level: number = 1;
  exp: number = 0;
  requiredExpForLevel: number = 100;
  lastLeaveCommandUse: Date = new Date();
  mainJob: Job = new Knight();
  subJob: Job = new Pyromancer();
  jobs: Job[];
  burst: number;
  maxBurst: number;
  generalSkills: Skill[] = [new AttackAction(), new DefendAction(),new FleeAction(), new BurstAction()];
  unlockedPassives: Passive[] = [];
  menu: MenuHandler;
  isMoving: boolean = false;
  party: Party | undefined;
  quest: Quest | undefined;
  userID: string = "";

  updateStats(classModifiers: Stats) {
    
    this.stats.setStats(
      {
        HP: this.baseStats.maxHP + Math.round(this.baseStats.maxHP * (classModifiers.maxHP / 100)),
        strength: this.baseStats.strength + Math.round(this.baseStats.strength * (classModifiers.strength / 100)),
        magic: this.baseStats.magic + Math.round(this.baseStats.magic * (classModifiers.magic / 100)),
        speed: this.baseStats.speed + Math.round(this.baseStats.speed * (classModifiers.speed / 100)),
        luck:  this.baseStats.luck + Math.round(this.baseStats.luck * (classModifiers.luck / 100)),
      }
    );

    if (this.stats.HP >= this.stats.maxHP) {
      this.stats.HP = this.stats.maxHP;
    }

    return this.stats;
  }

  changeMainJob(selectedClass: JobName): string {
    const job = this.jobs.find((x) => x.name == selectedClass);
    if (job) {
      this.updateStats(job.statModifiers);
      if (this.subJob.name != selectedClass) {
        this.mainJob = job;
        this.mainJob.refreshSkills();
        return `Job changed to ${selectedClass}`;
      } else {
        this.subJob = this.mainJob;
        this.mainJob = job;
        this.mainJob.refreshSkills();
        return `Switched main job to ${this.mainJob.name} and subjob to ${this.subJob.name}.`;
      }
    } else {
      return "Job not found or is not unlocked.";
    }
  }

  changeSubJob(selectedClass: JobName): string {
    const job = this.jobs.find((x) => x.name == selectedClass);
    if (job) {
      if (this.mainJob.name != selectedClass) {
        this.subJob = job;
        this.subJob.refreshSkills();
        return `Sub job changed to ${selectedClass}`;
      } else {
        this.mainJob = this.subJob;
        this.subJob = job;
        this.subJob.refreshSkills();
        return `Switched sub job to ${this.subJob.name} and main job to ${this.mainJob.name}.`;
      }
    } else {
      return "Job not found or is not unlocked.";
    }
  }

  giveExp(exp: number = 0, jobExp: number = 10) {

    this.exp += exp;
    this.mainJob.exp += jobExp;

    const levelUpTxt = this.checkLevelUp();
    const expGivenTxt = `${this.name} earned ${exp} exp and ${jobExp} jp.\n`;

    return expGivenTxt + levelUpTxt;
  }

  getExpScalingCoeficient(level: number): number{
    if(level <= 5){
      return 0.4;
    }
    else if(level <= 15){
      return 0.3;
    }
    else if(level <= 25){
      return 0.2;
    }
    else if(level <= 44){
      return 0.1;
    }
    else{
      return 0.2;
    }
  }

  checkLevelUp(): string {
    let leveledUp = false;
    let result: string = "";
    let initialLevel = this.level;

    while (this.exp >= this.requiredExpForLevel) {
      this.level++;
      leveledUp = true;

      if(this.level <= 10){
        this.baseStats.HP += 20;
        this.baseStats.strength += 2;
        this.baseStats.magic += 2;
      }
      else if(this.level <= 20){
        this.baseStats.HP += 50;
        this.baseStats.strength += 6;
        this.baseStats.magic += 4;
      }
      else if(this.level <= 30){
        this.baseStats.HP += 80;
        this.baseStats.strength += 4;
        this.baseStats.magic += 6;
      }
      else if(this.level < 45){
        this.baseStats.HP += 100;
        this.baseStats.strength += 10;
        this.baseStats.magic += 10;
      }
      else{
        this.baseStats.HP += 300;
        this.baseStats.strength += 20;
        this.baseStats.magic += 20;
      }
      this.baseStats.speed += (1 * Math.ceil(this.level/10));
      if (this.level % 2 == 0) {
        this.baseStats.luck++;
      }

      this.exp -= this.requiredExpForLevel;
      this.requiredExpForLevel =  Math.ceil(5 * Math.ceil( (Math.ceil( this.requiredExpForLevel * this.getExpScalingCoeficient(this.level)) + this.requiredExpForLevel )/ 5));

      this.updateStats(this.mainJob.statModifiers);
    }

    if (leveledUp) {
      result += ` -CHARACTER LEVEL: ${initialLevel} > ${this.level}\n`;
    }

    leveledUp = false;
    if (this.mainJob.level < 10) {
      initialLevel = this.mainJob.level;

      let learntMessage = "";

      while (this.mainJob.exp > 100) {
        this.mainJob.level++;
        this.mainJob.exp -= 100;
        let skills = this.mainJob.getUnlockedSkills();
        for (let skill of skills) {
          let index = this.mainJob.skills.findIndex(
            (x) => x.name == skill.name
          );
          if (index == -1 && skill) {
            learntMessage += `**Learnt skill**: ${skill.name}\n`;
            this.mainJob.skills.push(skill);
          }
        }
        let passives = this.mainJob.getUnlockedPassives();
        for (let jobPassive of passives) {
          let index = this.unlockedPassives.findIndex(
            (x) => x.name == jobPassive.name
          );
          if (index == -1 && jobPassive) {
            learntMessage += `**Learnt passive**: ${jobPassive.name}\n`;
            this.unlockedPassives.push(jobPassive);
          }
        }
        leveledUp = true;
      }


      if (leveledUp) {
        result +=
          ` -${this.mainJob.name.toUpperCase()} LEVEL ${initialLevel} > ${
            this.mainJob.level
          }\n` + learntMessage;
      }
    }

    return result;
  }

  refreshPassivesList(){
    for(let job of this.jobs){
      let passives = job.getUnlockedPassives();
      for (let jobPassive of passives) {
        let index = this.unlockedPassives.findIndex(
          (x) => x.name == jobPassive.name
        );
        if (index == -1 && jobPassive) {
          this.unlockedPassives.push(jobPassive);
        }
      }
    }
  }
}
