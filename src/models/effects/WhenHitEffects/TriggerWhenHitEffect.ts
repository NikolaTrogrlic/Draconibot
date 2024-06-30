import { TakeDamageResult } from "../../battle/ActionResults";
import { EffectBase } from "../EffectBase";

export abstract class TriggerWhenHitEffect extends EffectBase{

    abstract trigger(data: TakeDamageResult): TakeDamageResult;
}