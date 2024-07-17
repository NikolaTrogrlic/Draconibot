import { StringSelectMenuInteraction } from "discord.js";
import { IGameInteraction } from "./IGameInteraction";
import { Globals } from "../../globals";

export abstract class SelectMenuBase implements IGameInteraction{
   
   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
   
   async execute(interaction: any, globals: Globals, extraInfo: string): Promise<any> {
      if(interaction instanceof StringSelectMenuInteraction){
         await this.onSelectionPerformed(interaction, globals);
      }
   }

   abstract onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any>

}