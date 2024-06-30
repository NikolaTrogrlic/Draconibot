import { Combatant } from "../Combatant";
import { ElementalType } from "../enums/ElementalType";
import { CombatMessage } from "./CombatMessage";

export class TakeDamageResult{
   
   combatMessage: CombatMessage;
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
      this.combatMessage = new CombatMessage("");
      this.damageTaken = damage;
      this.damagedCharacter = damagedCharacter;
      this.attacker = attacker;
      this.damageElement = damageElement;
   }
}