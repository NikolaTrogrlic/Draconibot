
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { Battle } from "../battle/Battle";
import { SkillName } from "../enums/SkillName";

export enum TargetType{
    SingleEnemy = 0,
    AllEnemies = 1,
    Self = 2,
    WeakestAlly = 3,
    Party = 4,
    None = 5
}

export abstract class Skill{

    name: SkillName = SkillName.Attack;
    target: TargetType = TargetType.SingleEnemy;
    bpCost: number = 1;
    description: string = "";

    use(user:Player, battle: Battle){
        user.bp -= this.bpCost;
        user.burst += (this.bpCost * 10);
        if(user.burst > user.maxBurst){
            user.burst = user.maxBurst;
        }
        battle.display.clearDisplayData();
        battle.display.isShowingMessagesOneByOne = true;
        this.skillEffect(user, battle);
        battle.displayAction(user);
    }

    abstract skillEffect(user: Player,battle: Battle): void;

    getTarget(user: Player, battle: Battle, alternateTarget: TargetType = TargetType.None): Combatant[]
    {
        let target = this.target;
        if(alternateTarget != TargetType.None){
            target = alternateTarget;
        }

        switch(target){
            case TargetType.AllEnemies:
                return battle.monsters
            case TargetType.Party:
                return battle.players
            case TargetType.Self:
                {
                    let player = [];
                    player.push(user);
                    return player;
                }
            case TargetType.SingleEnemy:
                {
                    let target = battle.currentTarget;
                    if(battle.currentTarget >= battle.monsters.length){
                        target = battle.monsters.length - 1;
                    }
                    else if(target < 0){
                        target = 0;
                    }
                    let monster = [];
                    monster.push(battle.monsters[target]);
                    return monster;
                }
            case TargetType.WeakestAlly:
                {
                    let weakestPlayerIndex = 0;
                    for(let i = 0; i < battle.players.length;i++){
                        if(weakestPlayerIndex != i && battle.players[weakestPlayerIndex].stats.HP > battle.players[i].stats.HP){
                            weakestPlayerIndex = i;
                        }
                    }
                    let weaklings = [];
                    weaklings.push(battle.players[weakestPlayerIndex]);
                    return weaklings;
                }
            case TargetType.None:
                return [];
        }
    }
}
