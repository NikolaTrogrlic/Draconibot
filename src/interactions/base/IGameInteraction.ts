import { BaseInteraction } from "discord.js";
import { Globals } from "../../globals";

export interface IGameInteraction{
   
   needsPlayerExistance: boolean;
   canOnlyPerformOutsideBattle: boolean;
   canOnlyPerformOnOwnTurn: boolean;

}

export function isGameInteraction(object: any): object is IGameInteraction {
   return 'needsPlayerExistance' in object && 
   'canOnlyPerformOutsideBattle' in object && 
   'canOnlyPerformOnOwnTurn' in object;
}

export async function canPerformInteraction(
   object: IGameInteraction,
   interaction: BaseInteraction,
   globals: Globals
 ): Promise<boolean> {
   if (object.needsPlayerExistance) {
     const player = globals.getPlayerById(interaction.user.id);
     if (player) {
       if(object.canOnlyPerformOutsideBattle){
          if(player.battleID){
             if (interaction.isRepliable()){
                await interaction.reply({
                   content: "This action may only be performed outside battle.",
                   ephemeral: true,
                 });
             }
             return false;
          }
          else{
             return true;
          }
       }
       else if(object.canOnlyPerformOnOwnTurn){
          if(player.battleID){
             const battle = globals.getPlayerBattle(player);
             if(battle){
                if(battle.currentAction == player){
                   return true;
                }
                else{
                   if (interaction.isRepliable()){
                      await interaction.reply({
                         content: "May only perform this action on your own turn.",
                         ephemeral: true,
                       });
                   }
                   return false;
                }
             }
             else{
                if (interaction.isRepliable()){
                   await interaction.reply({
                      content: "Must be in battle and it must be your turn to perform this action.",
                      ephemeral: true,
                    });
                }
                return false;
             }
          }
          else{
             if (interaction.isRepliable()){
                await interaction.reply({
                   content: "Must be in battle and it must be your turn to perform this action.",
                   ephemeral: true,
                 });
             }
             return false;
          }
       }
       else{
          return true;
       }
     }
     else {
       if (interaction.isRepliable()) {
         await interaction.reply({
           content: "Please start the game first using /start",
           ephemeral: true,
         });
       }
       return false;
     }
   } else {
     return true;
   }
 }