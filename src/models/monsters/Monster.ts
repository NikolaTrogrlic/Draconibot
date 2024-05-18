import { getRandomPercent } from "../../random";
import { Battle } from "../Battle";
import { Combatant } from "../Combatant";
import { Stats } from "../Stats";

export abstract class Monster extends Combatant{

    level: number;
    bonusEXP: number = 0;

    constructor(name: string, level: number, stats:Stats){

        super(name,stats, undefined)
        this.level = level;
    }

    abstract performCombatTurn(battle: Battle): string;

    attackRandomPlayer(battle: Battle): string{

        const players = battle.getPlayers();
        const targetedPlayer = players[getRandomPercent() % players.length];
        const actionReport = targetedPlayer.takeDamage(this.stats.pAtk);

        return actionReport;
    }

    isLucky(): boolean{
        return getRandomPercent() < this.stats.luck;
    }




}