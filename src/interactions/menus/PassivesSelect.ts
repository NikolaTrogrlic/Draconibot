import {  StringSelectMenuInteraction } from "discord.js";
import { Globals } from "../../globals";
import { SelectMenuBase } from "../base/SelectMenuBase";
import { PassiveName } from "../../models/enums/PassiveName";
import { EquipMenu } from "../buttons/equipButtons/EquipMenu";

export class PassivesSelect extends SelectMenuBase{

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;

   async onSelectionPerformed(interaction: StringSelectMenuInteraction, globals: Globals): Promise<any> {
      let player = globals.getPlayerById(interaction.user.id);

      if(player){
         player.passives = [];

         let shouldClear = interaction.values.findIndex(x => x === "Clear All");

         if(shouldClear == -1){
            for(let value of interaction.values){
               let passive = player.unlockedPassives.find(x => x.name.toString() == value);
               if(passive){
                  player.passives.push(passive);
               }
            }
         }

         await EquipMenu.generateMenu(player, interaction);
      }
      else{
         interaction.update({fetchReply: false});
      }
   }
   
}