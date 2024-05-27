import { getRandomPercent } from "../../random";
import { Combatant } from "../Combatant";
import { Stats } from "../Stats";
import { Battle } from "../battle/Battle";
import { getPlayers } from "../battle/BattleUtils";
import { CombatMessage } from "../battle/CombatMessage";

export abstract class Monster extends Combatant{

    level: number;
    bonusEXP: number = 0;

    constructor(name: string, level: number, stats:Stats){

        super(name,stats, undefined)
        this.level = level;
    }

    abstract performCombatTurn(battle: Battle): void;

    attackRandomPlayer(battle: Battle): CombatMessage{

        const players = getPlayers(battle.combatants);
        const targetedPlayer = players[getRandomPercent() % players.length];
        return targetedPlayer.takeDamage(this.stats.strength * 1.2);
    }

    isLucky(): boolean{
        return getRandomPercent() < this.stats.luck;
    }


}