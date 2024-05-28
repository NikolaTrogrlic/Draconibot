import { CombatMessage } from "./CombatMessage";

export class TakeDamageResult{
   
   combatMessage: CombatMessage;
   damageTaken: number = 0;
   wasDefeated: boolean = false;
   weaknessWasHit: boolean = false;
   resistanceWasHit: boolean = false;

   constructor(message: CombatMessage) {
      this.combatMessage = message;
   }
}