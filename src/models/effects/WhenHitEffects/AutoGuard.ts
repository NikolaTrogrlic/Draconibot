import { TakeDamageResult } from "../../battle/ActionResults";
import { TriggerWhenHitEffect } from "./TriggerWhenHitEffect";

export class AutoGuard extends TriggerWhenHitEffect{

    trigger(data: TakeDamageResult): TakeDamageResult {
        data.guarded = true;
        data.damageTaken = data.damageTaken * 0.6;
        return data;
    }

    constructor(duration: number = 3) {
        super("Auto-Guard", duration, 3, 1);
    }
}