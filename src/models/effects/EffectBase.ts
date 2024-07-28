export class EffectBase{

   name: string;
   duration: number;
   maxDuration : number;
   lastsInfinitely: boolean;
   stacks: number;
   maxStacks: number;

   apply(stacks: number, duration: number){
      this.stacks += stacks;
      this.duration += duration;

      if(this.duration > this.maxDuration){
         this.duration = this.maxDuration;
      }

      if(this.stacks > this.maxStacks){
         this.stacks = this.maxStacks;
      }
   }

   constructor(name: string, duration: number, maxDuration: number, maxStacks: number, stacks: number = 1, lastsInfinitely: boolean = false) {
      this.name = name;
      this.duration = duration;
      this.maxDuration = maxDuration;
      this.stacks = stacks;
      this.maxStacks = maxStacks;
      this.lastsInfinitely = lastsInfinitely;
   }
}