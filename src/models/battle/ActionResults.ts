import { Combatant } from "../Combatant";
import { ElementalType } from "../enums/ElementalType";

export class TakeDamageResult{
   
   combatMessage: string;
   damageTaken: number = 0;
   wasDefeated: boolean = false;
   weaknessWasHit: boolean = false;
   resistanceWasHit: boolean = false;
   damagedCharacter: Combatant;
   guarded: boolean = false;
   evaded: boolean = false;
   damageElement: ElementalType;
   attacker: Combatant;

   constructor(attacker: Combatant, damage: number, damageElement: ElementalType,damagedCharacter: Combatant) {
      this.combatMessage = "";
      this.damageTaken = damage;
      this.damagedCharacter = damagedCharacter;
      this.attacker = attacker;
      this.damageElement = damageElement;
   }
}