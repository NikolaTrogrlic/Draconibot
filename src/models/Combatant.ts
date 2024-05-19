import { Stats } from "./Stats";
import { ElementalType } from "./enums/ElementalType";

export enum BlockType{
    Armor = 0,
    Resistance = 1,
    None = 3
}

export class Combatant{

    nickname: string;
    name: string;
    baseStats: Stats;
    stats: Stats;
    actions: number;
    bp: number;
    maxBP: number;
    battleID?: string;
    blockMeter = 0;
    isDefending: boolean;
    weaknesses: ElementalType[] = [];
    resistances: ElementalType[] = [];
    
    constructor(name: string,baseStats: Stats,battleID: string | undefined, bp: number = 1,actions: number = 1){
        this.name = name;
        this.battleID = battleID;
        this.stats = baseStats;
        this.baseStats = baseStats;
        this.actions = actions;
        this.bp = bp;
        this.maxBP = 3;
        this.isDefending = false;
        this.nickname = name;
    }

    increaseBpBy(amount: number){
        this.bp += amount;
        if(this.bp > this.maxBP){
            this.bp = this.maxBP;
        }
    }

    takeDamage(amount: number, blockType = BlockType.Armor,damageType: ElementalType = ElementalType.Physical): string{

        let message = "";
        
        if(this.blockMeter >= 200){
            this.blockMeter = 0;
            message += `**[BLOCKED]** Damage blocked by ${this.name}`;
        }
        else{

            if(this.resistances.findIndex(x => x == damageType) != -1){
                amount = Math.floor(amount * 0.8);
                message += "**[RESIST]**";
            }
            else if(this.weaknesses.findIndex(x => x == damageType) != -1){
                amount = Math.floor(amount * 1.2);
                message += "**[WEAKNESS HIT]**";
            }
    
            if(this.isDefending){
                amount = Math.round(amount / 2);
            }
            else if(amount <= 0){
                amount = 1;
            }
    
            this.stats.HP -= amount;

            if(blockType == BlockType.Armor){
                this.blockMeter += this.stats.armor;
            }
            else if(blockType == BlockType.Resistance){
                this.blockMeter += this.stats.resistance;
            }

            if(this.blockMeter > 200){
                this.blockMeter = 200;
            }
    
            message += `Deals ${amount} damage to ${this.name}. \n`;
        }

        return message;
    }

    heal(amount: number){
        this.stats.HP += amount;
        if(this.stats.maxHP < this.stats.HP){
            this.stats.HP = this.stats.maxHP;
        }
    }
}