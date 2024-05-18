import { Battle } from "../Battle";
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { SkillName } from "../enums/SkillName";

export enum TargetType{
    SingleEnemy = 0,
    AllEnemies = 1,
    Self = 2,
    WeakestAlly = 3,
    Party = 4
}

export abstract class Skill{

    name: SkillName = SkillName.Attack;
    target: TargetType = TargetType.SingleEnemy;
    bpCost: number = 1;

    use(user:Player, battle: Battle){
        user.bp -= this.bpCost;
        const message = this.skillEffect(user, battle);
        battle.sendActionMessage(message, user);
    }

    abstract skillEffect(user: Player,battle: Battle): string;

    getTarget(user: Player, battle: Battle): Combatant[]
    {
        switch(this.target){
            case TargetType.AllEnemies:
                return battle.getMonsters();
            case TargetType.Party:
                return battle.getPlayers();
            case TargetType.Self:
                {
                    let player = [];
                    player.push(user);
                    return player;
                }
            case TargetType.SingleEnemy:
                {
                    let target = battle.currentTarget;
                    const monsters = battle.getMonsters();
                    if(battle.currentTarget > monsters.length){
                        target = monsters.length;
                    }
                    else if(target < 0){
                        target = 0;
                    }
                    let monster = [];
                    monster.push(monsters[target]);
                    return monster;
                }
            case TargetType.WeakestAlly:
                {
                    const players = battle.getPlayers();
                    let weakestPlayerIndex = 0;
                    for(let i = 0; i < players.length;i++){
                        if(weakestPlayerIndex != i && players[weakestPlayerIndex].stats.HP > players[i].stats.HP){
                            weakestPlayerIndex = i;
                        }
                    }
                    let weaklings = [];
                    weaklings.push(players[weakestPlayerIndex]);
                    return weaklings;
                }
        }
    }
}
