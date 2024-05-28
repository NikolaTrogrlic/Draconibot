
import { Combatant } from "../Combatant";
import { Player } from "../Player";
import { Battle } from "../battle/Battle";
import { getMonsters, getPlayers } from "../battle/BattleUtils";
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
                return getMonsters(battle.combatants);
            case TargetType.Party:
                return getPlayers(battle.combatants);
            case TargetType.Self:
                {
                    let player = [];
                    player.push(user);
                    return player;
                }
            case TargetType.SingleEnemy:
                {
                    let target = battle.currentTarget;
                    const monsters = getMonsters(battle.combatants);
                    if(battle.currentTarget >= monsters.length){
                        target = monsters.length - 1;
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
                    const players = getPlayers(battle.combatants);
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
            case TargetType.None:
                return [];
        }
    }
}
