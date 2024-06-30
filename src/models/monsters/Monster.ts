import { getRandomPercent } from "../../random";
import { Combatant } from "../Combatant";
import { Stats } from "../Stats";
import { Battle } from "../battle/Battle";
import { TakeDamageResult } from "../battle/ActionResults";
import { ElementalType } from "../enums/ElementalType";
import { DamageModifier as DamageModifier } from "../enums/DamageModifier";

export abstract class Monster extends Combatant{

    level: number;
    bonusEXP: number = 0;

    constructor(name: string, level: number, stats:Stats){

        super(name,stats, undefined)
        this.level = level;
    }

    abstract performCombatTurn(battle: Battle): void;

    attackRandomPlayer(battle: Battle,mainStat: number = this.stats.strength, modifier = DamageModifier.Light, element: ElementalType = ElementalType.Physical ): TakeDamageResult{
        const targetedPlayer = battle.players[getRandomPercent() % battle.players.length];
        return battle.dealDamageToCombatant(this,targetedPlayer, mainStat * modifier, element);
    }

    isLucky(): boolean{
        return getRandomPercent() < this.stats.luck;
    }


}