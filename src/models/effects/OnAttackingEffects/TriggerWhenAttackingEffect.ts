import { TakeDamageResult } from "../../battle/ActionResults";
import { EffectBase } from "../EffectBase";

export abstract class TriggerWhenAttackingEffect extends EffectBase{

    abstract trigger(data: TakeDamageResult): TakeDamageResult;
}