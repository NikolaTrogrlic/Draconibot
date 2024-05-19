import { JobName } from "./enums/JobName";
import { Job } from "./jobs/Job";
import { Combatant } from "./Combatant";
import { Stats } from "./Stats";
import { Passive } from "./Passive";
import { Jobs } from "./jobs/Jobs";
import { Skill } from "./skills/Skill";
import { AttackAction } from "./skills/general/AttackAction";
import { DefendAction } from "./skills/general/DefendAction";
import { Freelancer } from "./jobs/Freelancer";
import { Knight } from "./jobs/Knight";

export class Player extends Combatant {
  constructor(name: string, id: string) {
    super(
      name,
      new Stats({
        HP: 100,
        armor: 5,
        resistance: 0,
        pAtk: 10,
        mAtk: 10,
        speed: 10,
        luck: 0,
      }),
      undefined
    );

    this.userID = id;
    this.jobs = Jobs.getJobsForLevel(1);
    this.changeMainJob(JobName.Freelancer);
    this.changeSubJob(JobName.Knight);
  }

  level: number = 1;
  exp: number = 0;

  mainJob: Job = new Freelancer();
  subJob: Job = new Knight();
  jobs: Job[];
  generalSkills: Skill[] = [new AttackAction(), new DefendAction()];

  unlockedPassives: Passive[] = [];
  equippedPassives: Passive[] = [];

  partyID?: string;
  userID: string = "";

  updateStats(baseStats: Stats, classPercantageModifiers: Stats) {
    this.stats.maxHP =
      baseStats.maxHP +
      Math.round(baseStats.maxHP * (classPercantageModifiers.maxHP / 100));
    this.stats.armor = baseStats.armor + classPercantageModifiers.armor;
    this.stats.resistance =
      baseStats.resistance + classPercantageModifiers.resistance;

    this.stats.pAtk =
      baseStats.pAtk +
      Math.round(baseStats.pAtk * (classPercantageModifiers.pAtk / 100));
    this.stats.mAtk =
      baseStats.mAtk +
      Math.round(baseStats.mAtk * (classPercantageModifiers.mAtk / 100));
    this.stats.speed =
      baseStats.speed +
      Math.round(baseStats.speed * (classPercantageModifiers.speed / 100));
    this.stats.luck =
      baseStats.luck +
      Math.round(baseStats.luck * (classPercantageModifiers.luck / 100));

    if (this.stats.HP >= this.stats.maxHP) {
      this.stats.HP = this.stats.maxHP;
    }

    return this.stats;
  }

  changeMainJob(selectedClass: JobName): string {
    const job = this.jobs.find((x) => x.name == selectedClass);
    if (job) {
      this.updateStats(this.baseStats, job.statModifiers);
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

  giveExp(battleLevel: number, creaturesFought: number, bonusExp: number = 0) {
    let exp = 0;
    let jobExp = 0;

    if (creaturesFought > 4) {
      creaturesFought = 4;
    }

    exp += bonusExp;

    if (battleLevel - 2 <= this.level && this.level <= battleLevel + 2) {
      exp += 5;
      jobExp += 10;
    } else if (this.level < battleLevel - 2) {
      exp += 10;
      jobExp += 15;
    } else if (this.level > battleLevel + 2) {
      if (this.level > battleLevel + 5) {
        exp += 1;
        if (creaturesFought > 1) {
          creaturesFought = 1;
        }
        jobExp += 2;
      } else {
        exp += 5;
        jobExp += 5;
      }
    }

    exp *= creaturesFought;
    jobExp *= creaturesFought;

    this.exp += exp;
    this.mainJob.exp += jobExp;

    const levelUpTxt = this.checkLevelUp();
    const expGivenTxt = `${this.name} earned ${exp} exp and ${jobExp} jp.\n`;

    return expGivenTxt + levelUpTxt;
  }

  checkLevelUp(): string {
    let leveledUp = false;
    let result: string = "";
    let initialLevel = this.level;

    while (this.exp > 100) {
      this.level++;
      this.baseStats.HP += 25;
      this.baseStats.mAtk += 5;
      this.baseStats.pAtk += 5;
      this.baseStats.speed += 1;

      if (this.level % 5 == 0) {
        this.baseStats.luck += 1;
      }
      this.exp -= 100;
      leveledUp = true;
      this.updateStats(this.baseStats, this.mainJob.statModifiers);
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
}
