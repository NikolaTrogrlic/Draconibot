import { StatusEffectType } from "./enums/StatusEffectType";

export class StatusEffect{

   type: StatusEffectType;
   duration: number;

   constructor(type: StatusEffectType, duration: number = 3) {
      this.type = type;
      this.duration = duration;
   }
}