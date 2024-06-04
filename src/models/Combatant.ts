import { Stats } from "./Stats";
import { CombatMessage } from "./battle/CombatMessage";
import { TakeDamageResult } from "./battle/ActionResults";
import { ElementalType } from "./enums/ElementalType";
import { Passive } from "./Passive";
import { StatusEffect } from "./StatusEffect";

export class Combatant{

    nickname: string;
    name: string;
    baseStats: Stats;
    stats: Stats;
    actions: number;
    bp: number;
    maxBP: number;
    battleID?: string;
    isDefending: boolean;
    isFleeing: boolean;
    passives: Passive[] = [];
    isDefeated: boolean = false;
    buffs: StatusEffect[] = [];
    debuffs: StatusEffect[] = [];
    weaknesses: ElementalType[] = [];
    resistances: ElementalType[] = [];
    
    constructor(name: string,baseStats: Stats,battleID: string | undefined, bp: number = 1,actions: number = 1){
        this.name = name;
        this.battleID = battleID;
        this.stats = new Stats({HP: 0, strength: 0, magic: 0, luck: 0 , speed: 0});
        this.baseStats = new Stats({HP: 0, strength: 0, magic: 0, luck: 0 , speed: 0});
        this.stats.setStats(baseStats);
        this.baseStats.setStats(baseStats);
        this.actions = actions;
        this.bp = bp;
        this.maxBP = 4;
        this.isFleeing = false;
        this.isDefending = false;
        this.nickname = name;
    }

    increaseBpBy(amount: number){
        this.bp += amount;
        if(this.bp > this.maxBP){
            this.bp = this.maxBP;
        }
    }

    heal(amount: number){
        amount = Math.round(amount);
        this.stats.HP += amount;
        if(this.stats.maxHP < this.stats.HP){
            this.stats.HP = this.stats.maxHP;
        }
    }
    
    tickStatus(tickAmount: number){
        for(let i= this.buffs.length-1;i >= 0;i--){
            this.buffs[i].duration -= tickAmount;
            if(this.buffs[i].duration < 1){
                this.buffs.splice(i,1);
            }
        }
        for(let i= this.debuffs.length-1;i >= 0;i--){
            this.debuffs[i].duration -= tickAmount;
            if(this.debuffs[i].duration < 1){
                this.debuffs.splice(i,1);
            }
        }
    }
}