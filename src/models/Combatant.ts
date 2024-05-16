import { Stats } from "./Stats";
import { ElementalType } from "./enums/ElementalType";

export class Combatant{

    name: string;
    stats: Stats;
    actions: number;
    bp: number;
    maxBP: number;
    battleID?: string;
    isDefending: boolean;
    weaknesses: ElementalType[] = [];
    resistances: ElementalType[] = [];
    
    constructor(name: string,stats: Stats,battleID: string | undefined, bp: number = 1,actions: number = 1){
        this.name = name;
        this.battleID = battleID;
        this.stats = stats;
        this.actions = actions;
        this.bp = bp;
        this.maxBP = 3;
        this.isDefending = false;
    }

    increaseBpBy(amount: number){
        this.bp += amount;
        if(this.bp > this.maxBP){
            this.bp = this.maxBP;
        }
    }

    takeDamage(amount: number, damageReduction: number = this.stats.armor, damageType: ElementalType = ElementalType.Physical): string{

        amount = this.applyWeaknessesAndResistances(amount, damageType);
        let damage = Math.round(amount - (amount * (damageReduction/100)));

        if(this.isDefending){
            damage = Math.round(damage / 2);
        }
        if(damage <= 0){
            damage = 1;
        }
        this.stats.HP -= damage;
        return `Deals ${damage} damage to ${this.name}. \n`
    }

    applyWeaknessesAndResistances(damage: number,damageType: ElementalType): number{
        if(this.weaknesses.findIndex(x => x == damageType) != -1){
            return Math.floor(damage * 1.2);
        }
        if(this.weaknesses.findIndex(x => x == damageType) != -1){
            return Math.floor(damage * 0.8);
        }
        return damage;
    }

    heal(amount: number){
        this.stats.HP += amount;
        if(this.stats.maxHP < this.stats.HP){
            this.stats.HP = this.stats.maxHP;
        }
    }
}