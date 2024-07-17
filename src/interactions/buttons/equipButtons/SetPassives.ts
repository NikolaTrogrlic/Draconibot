import { ButtonInteraction, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Globals } from "../../../globals";
import { ButtonName } from "../../ButtonName";
import { SelectMenuType } from "../../SelectMenuType";
import { ButtonBase } from "../../base/ButtonBase";

export class SetPassives extends ButtonBase {

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;
   canOnlyPerformOnOwnTurn: boolean = false;
 
   async execute(
     interaction: ButtonInteraction,
     globals: Globals
   ): Promise<any> {

     const player = globals.getPlayerById(interaction.user.id);
 
     if (player) {
       player.refreshPassivesList();
       if(player.unlockedPassives.length > 0){
         let jobSelect: StringSelectMenuOptionBuilder[] = [];
       for (let passive of player.unlockedPassives) {
         jobSelect.push(
           new StringSelectMenuOptionBuilder()
             .setLabel(passive.name)
             .setValue(passive.name)
             .setDescription(passive.description)
         );
       }

       jobSelect.push(new StringSelectMenuOptionBuilder()
       .setLabel("Clear All")
       .setValue("Clear All"));

       let maxPassives = 5;
       if(player.unlockedPassives.length < 5){
         maxPassives = player.unlockedPassives.length;
       }
 
       const select = new StringSelectMenuBuilder()
         .setCustomId(SelectMenuType.SetPassivesMenu)
         .setPlaceholder("Select passives to equip.")
         .setMinValues(1)
         .setMaxValues(maxPassives)
         .addOptions(jobSelect);

       const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
       
       await player.menu.appendToDisplay(interaction, [row]);
       }
       else{
         if(interaction.replied == false){
            await interaction.reply({content: "You have no passives unlocked. Level up some jobs first.", ephemeral:  true});
         }
       }
     }
     else{
       interaction.update({fetchReply: false});
     }
   }
 
   static button(): ButtonBuilder {
     return new ButtonBuilder()
       .setCustomId(ButtonName.SetPassives)
       .setLabel("Set Passives")
       .setStyle(ButtonStyle.Secondary);
   }
 }
 