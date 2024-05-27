export interface StatParams{

    HP: number;
    strength: number;
    magic: number;
    speed: number;
    luck: number;

}

export class Stats{

    HP: number = 0;
    maxHP: number = 0;
    strength: number = 0;
    magic: number = 0;
    speed: number = 0;
    luck: number = 0;

    constructor(stats: StatParams){
        this.setStats(stats);
    }

    setStats(stats: StatParams){
        this.HP = stats.HP;
        this.maxHP = stats.HP;
        this.speed = stats.speed;
        this.luck = stats.luck;
        this.strength = stats.strength;
        this.magic = stats.magic;
    }
}
