import { randomNumberFromOneTo } from "../../utils";
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
        const targetedPlayer = players[Math.floor(Math.random() * players.length)];
        const actionReport = targetedPlayer.takeDamage(this.stats.pAtk);

        return actionReport;
    }

    isLucky(): boolean{
        if(randomNumberFromOneTo(100) < this.stats.luck){
            return true;
        }
        else{
            return false;
        }
    }




}