import { getRandomPercent } from "../../random";
import { Combatant } from "../Combatant";
import { Stats } from "../Stats";
import { Battle } from "../battle/Battle";
import { getPlayers } from "../battle/BattleUtils";
import { CombatMessage } from "../battle/CombatMessage";
import { TakeDamageResult } from "../battle/ActionResults";
import { ElementalType } from "../enums/ElementalType";

export abstract class Monster extends Combatant{

    level: number;
    bonusEXP: number = 0;

    constructor(name: string, level: number, stats:Stats){

        super(name,stats, undefined)
        this.level = level;
    }

    abstract performCombatTurn(battle: Battle): void;

    attackRandomPlayer(battle: Battle,mainStat: number = this.stats.strength, damageModifier: number = 1.2, damageType: ElementalType = ElementalType.Physical ): TakeDamageResult{
        const players = getPlayers(battle.combatants);
        const targetedPlayer = players[getRandomPercent() % players.length];
        return targetedPlayer.takeDamage(mainStat * damageModifier, damageType);
    }

    isLucky(): boolean{
        return getRandomPercent() < this.stats.luck;
    }


}