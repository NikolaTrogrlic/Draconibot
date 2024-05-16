import { JobName } from "./enums/JobName";
import { Job } from "./jobs/Job";
import { Combatant } from "./Combatant";
import { Stats } from "./Stats";
import { Passive } from "./passives/Passive";
import { Jobs } from "./jobs/Jobs";
import { SkillName } from "./enums/SkillName";

export class Player extends Combatant{

    constructor(name: string, id: string){

        super(name,new Stats({HP:100,armor:10,resistance:0,pAtk:10,mAtk:10,speed:10, luck:0}), undefined)
        this.userID = id;
        this.jobs = Jobs.getJobsForLevel(1);
        this.currentJob = this.jobs.find(job => job.name == JobName.Freelancer)!
        this.equippedSkills = [];
        this.generalSkills = [SkillName.Attack, SkillName.Defend];
    }

    level: number = 1;
    exp: number = 0;

    currentJob: Job;
    jobs: Job[];
    equippedSkills: SkillName[];
    generalSkills: SkillName[];
    equippedPassives: Passive[] = [];

    baseStats: Stats = new Stats({HP:100,armor:10,resistance:0,pAtk:10,mAtk:10,speed:10, luck:0});

    partyID?: string;
    userID: string =  "";

    updateStats(baseStats: Stats, classPercantageModifiers:Stats){

        this.stats.maxHP = Math.round(baseStats.maxHP + (baseStats.maxHP * (classPercantageModifiers.maxHP/100)));
        this.stats.armor = Math.round(baseStats.armor + (baseStats.armor * (classPercantageModifiers.armor/100)));
        this.stats.resistance = Math.round(baseStats.resistance + (baseStats.resistance * (classPercantageModifiers.resistance/100)));
        this.stats.pAtk = Math.round(baseStats.pAtk + (baseStats.pAtk * (classPercantageModifiers.pAtk/100)));
        this.stats.mAtk = Math.round(baseStats.mAtk + (baseStats.mAtk * (classPercantageModifiers.mAtk/100)));
        this.stats.speed = Math.round(baseStats.speed + (baseStats.speed * (classPercantageModifiers.speed/100)));
        this.stats.luck = Math.round(baseStats.luck + (baseStats.luck * (classPercantageModifiers.luck/100)));

        if(this.stats.HP >= this.stats.maxHP){
            this.stats.HP = this.stats.maxHP;
        }
    
        return this.stats;
    }

    changeClasses(selectedClass: JobName){
        const job = this.jobs.find(x => x.name == selectedClass);
        if(job){
            const previousInfo = this.jobs.find(x => x.name == selectedClass);
                if(!previousInfo){
                    this.jobs.push(job);
                }
                this.updateStats(this.baseStats, job.statModifiers);
                this.currentJob = job;

                return `Job changed to ${selectedClass}`;
        }
        else{
            return "Job not found or is not unlocked.";
        }
    }

    giveExp(battleLevel: number, creaturesFought: number, bonusExp: number = 0){

        let exp = 0;
        let jobExp = 0;

        if(creaturesFought > 4){
            creaturesFought = 4;
        }

        exp += bonusExp;

        if(battleLevel - 2 <= this.level && this.level <= battleLevel + 2  ){
            exp += 5;
            jobExp += 10;
        }
        else if(this.level < battleLevel - 2){
            exp += 10;
            jobExp += 15;
        }
        else if(this.level > battleLevel + 2){
            if(this.level > battleLevel + 5){
                exp += 1;
                if(creaturesFought > 1){
                    creaturesFought = 1;
                }
                jobExp += 2;
            }
            else{
                exp += 5;
                jobExp += 5;
            }
        }

        exp *= creaturesFought;
        jobExp *= creaturesFought;

        this.exp += exp;
        this.currentJob.exp += jobExp;

        const levelUpTxt = this.checkLevelUp();
        const expGivenTxt = `${this.name} earned ${exp} exp and ${jobExp} jp.\n`;

        return expGivenTxt + levelUpTxt;
    };

    checkLevelUp(): string{
        
        let leveledUp = false;
        let result: string = "";
        let initialLevel = this.level;

        while(this.exp > 100){
            this.level++;
            this.baseStats.HP += 10 + Math.floor(Math.random() * 5);
            this.baseStats.mAtk += 5 + Math.floor(Math.random() * 5);
            this.baseStats.pAtk += 5 + Math.floor(Math.random() * 5);
            this.baseStats.speed += Math.floor(Math.random() * 3);
            if(this.level % 5 == 0){
                if(this.baseStats.armor < 30){
                    this.baseStats.armor += 1 + Math.floor(Math.random() * 2);
                }
                if(this.baseStats.resistance < 30){
                    this.baseStats.resistance += 1 + Math.floor(Math.random() * 2);
                }
                this.baseStats.luck += 1;
            }
            this.exp -= 100;
            leveledUp = true;
            this.updateStats(this.baseStats, this.currentJob.statModifiers)
        }

        if(leveledUp){
            result += ` -CHARACTER LEVEL: ${initialLevel} > ${this.level}\n`
        }

        leveledUp = false;
        initialLevel = this.currentJob.level;

        while(this.currentJob.exp > 100){
            this.currentJob.level++;
            this.currentJob.exp -= 100;

            leveledUp = true;
        }

        if(leveledUp){
            result += ` -${this.currentJob.name.toUpperCase()} LEVEL ${initialLevel} > ${this.currentJob.level}\n`
        }

        return result;
    }
}