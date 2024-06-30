import { TakeDamageResult } from "../../battle/ActionResults";
import { Battle } from "../../battle/Battle";
import { EffectBase } from "../EffectBase";

export abstract class CounterAttackEffect extends EffectBase{

    abstract trigger(data: TakeDamageResult,battle: Battle): TakeDamageResult;
}