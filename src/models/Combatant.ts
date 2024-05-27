import { Stats } from "./Stats";
import { CombatMessage } from "./battle/CombatMessage";
import { ElementalType } from "./enums/ElementalType";

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
        this.maxBP = 5;
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

    takeDamage(amount: number, damageType: ElementalType = ElementalType.Physical): CombatMessage{
        
        let isResisting: boolean = false;
        let isWeaknessHit: boolean = false;

        if(this.resistances.findIndex(x => x == damageType) != -1){
            amount = amount * 0.6;
            isResisting = true;
        }
        else if(this.weaknesses.findIndex(x => x == damageType) != -1){
            amount = amount * 1.4;
            isWeaknessHit = true;
        }
        
        if(this.isDefending){
            amount = amount / 2;
        }
        else if(amount <= 0){
            amount = 1;
        }

        amount = Math.round(amount);

        let combatMessage = new CombatMessage("");

        if(this.stats.HP > 0){
            combatMessage.message = `Deals **${amount}** ${damageType} damage to ${this.nickname}.`;

            this.stats.HP -= amount;

            if(isWeaknessHit){
                combatMessage.message = `${combatMessage.message} [${damageType} **WEAKNESS**]`;
            }
            else if(isResisting){
                combatMessage.message = `${combatMessage.message} [${damageType} **RESIST**]`;
            }

            if(this.stats.HP <= 0 && this.isDefeated == false){
                let message = `\n - *${this.nickname} defeated !*`;
                combatMessage.message += message;
                this.isDefeated = true;
            }
        }

        return combatMessage;
    }

    heal(amount: number){
        this.stats.HP += amount;
        if(this.stats.maxHP < this.stats.HP){
            this.stats.HP = this.stats.maxHP;
        }
    }
}