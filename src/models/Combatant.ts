import { Stats } from "./Stats";
import { CombatMessage } from "./battle/CombatMessage";
import { TakeDamageResult } from "./battle/ActionResults";
import { ElementalType } from "./enums/ElementalType";
import { Passive } from "./Passive";

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

    takeDamage(amount: number, damageType: ElementalType = ElementalType.Physical): TakeDamageResult{

        let takeDamageResult = this.beforeTakingDamage(amount, damageType)

        if(this.stats.HP > 0){
            
            takeDamageResult.combatMessage.message = `Deals **${takeDamageResult.damageTaken}** ${damageType} damage to ${this.nickname}.`;
            this.stats.HP -= takeDamageResult.damageTaken;

            if(takeDamageResult.weaknessWasHit){
                takeDamageResult.combatMessage.message = `${takeDamageResult.combatMessage.message} [${damageType} **WEAKNESS**]`;
            }
            else if(takeDamageResult.resistanceWasHit){
                takeDamageResult.combatMessage.message = `${takeDamageResult.combatMessage.message} [${damageType} **RESIST**]`;
            }
            
            takeDamageResult = this.afterTakingDamage(takeDamageResult)
        }

        return takeDamageResult;
    }

    heal(amount: number){
        this.stats.HP += amount;
        if(this.stats.maxHP < this.stats.HP){
            this.stats.HP = this.stats.maxHP;
        }
    }

    beforeTakingDamage(damageTaken: number,  damageType: ElementalType): TakeDamageResult{

        let takeDamageResult = new TakeDamageResult(new CombatMessage(""));

        if(this.resistances.findIndex(x => x == damageType) != -1){
            damageTaken = damageTaken * 0.6;
            takeDamageResult.resistanceWasHit = true;
        }
        else if(this.weaknesses.findIndex(x => x == damageType) != -1){
            damageTaken = damageTaken * 1.4;
            takeDamageResult.weaknessWasHit = true;
        }
        
        if(this.isDefending){
            damageTaken = damageTaken / 2;
        }
        else if(damageTaken <= 0){
            damageTaken = 1;
        }

        damageTaken = Math.round(damageTaken);

        takeDamageResult.damageTaken = damageTaken;

        return takeDamageResult;
    }

    afterTakingDamage(damageResult: TakeDamageResult): TakeDamageResult{

        if(this.stats.HP <= 0 && this.isDefeated == false){
            let message = `\n - *${this.nickname} defeated !*`;
            damageResult.combatMessage.message += message;
            damageResult.wasDefeated = true;
            this.isDefeated = true;
        }

        return damageResult;
    }
}