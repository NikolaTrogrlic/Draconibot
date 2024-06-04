import { Combatant } from "../Combatant";
import { CombatMessage } from "./CombatMessage";

export class TakeDamageResult{
   
   combatMessage: CombatMessage;
   damageTaken: number = 0;
   wasDefeated: boolean = false;
   weaknessWasHit: boolean = false;
   resistanceWasHit: boolean = false;
   damagedCharacter: Combatant;

   constructor(damagedCharacter: Combatant) {
      this.combatMessage = new CombatMessage("");
      this.damagedCharacter = damagedCharacter;
   }
}