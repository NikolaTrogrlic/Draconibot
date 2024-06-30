import { Combatant } from "../../Combatant";
import { TakeDamageResult } from "../../battle/ActionResults";
import { EffectBase } from "../EffectBase";

export abstract class TriggerWhenAllyHitEffect extends EffectBase{

    abstract trigger(owner: Combatant ,data: TakeDamageResult): TakeDamageResult;
}