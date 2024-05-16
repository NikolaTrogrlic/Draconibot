export interface StatParams{
    HP: number;
    armor: number;
    resistance: number;
    pAtk: number;
    mAtk: number;
    speed: number;
    luck: number;
}

export class Stats{

    HP: number;
    maxHP: number;
    armor: number;
    resistance: number;
    pAtk: number;
    mAtk: number;
    speed: number;
    luck: number;

    constructor(stats: StatParams){

        this.HP = stats.HP;
        this.maxHP = stats.HP;
        this.armor = stats.armor;
        this.resistance =  stats.resistance;
        this.pAtk = stats.pAtk;
        this.mAtk = stats.mAtk;
        this.speed = stats.speed;
        this.luck = stats.luck;
    }
}
