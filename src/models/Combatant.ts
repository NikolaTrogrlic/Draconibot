import { Stats } from "./Stats";
import { ElementalType } from "./enums/ElementalType";
import { Passive } from "./Passive";
import { EffectBase } from "./effects/EffectBase";

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
    lastBPround: number = 0;
    effects: EffectBase[] = [];
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
        for(let i= this.effects.length-1;i >= 0;i--){
            this.effects[i].duration -= tickAmount;
            if(this.effects[i].duration < 1 && this.effects[i].lastsInfinitely == false){
                this.effects.splice(i,1);
            }
        }
    }

    giveEffect(effect: EffectBase){
        let existingEffect = this.effects.find(x => x.name == effect.name);
        if(existingEffect){
            existingEffect.apply(effect.stacks, effect.duration);
        }
        else{
            this.effects.push(effect);
        }
    }
}