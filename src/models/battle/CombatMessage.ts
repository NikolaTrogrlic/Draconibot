export class CombatMessage{

   message: string;
   keyFrames: string[] = [];
   frameDuration: number = 100;

   constructor(message: string) {
      this.message = message;
   }
}