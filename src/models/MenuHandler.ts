import {
   ActionRow,
  ActionRowBuilder,
  ButtonInteraction,
  CommandInteraction,
  EmbedBuilder,
  Message,
  StringSelectMenuInteraction,
  TextBasedChannel,
} from "discord.js";

export class MenuHandler {

  message: Message<boolean> | undefined;
  channel: TextBasedChannel | undefined;

  constructor(initialInteraction: CommandInteraction){
   if(initialInteraction.channel){
      this.channel = initialInteraction.channel;
   }
  }

  async appendToDisplay(interaction: ButtonInteraction, components: ActionRowBuilder<any>[]){
   if (this.message) {
      try{
         if(components.length > 0){
            await this.message.edit({ components: [...this.message.components, ...components] });
         }
         if(interaction.replied == false){
            interaction.update({fetchReply: false});
         }
      }
      catch(err){
         console.log(err);
         interaction.channel?.send({content: "Error occured. Is the menu open? Open the menu with /play if it isn't."});
      }
   }
  }

  async updateDisplay(
    embed: EmbedBuilder[],
    components: ActionRowBuilder<any>[] | ActionRow<any>[] = [],
    interaction:
      | CommandInteraction
      | ButtonInteraction
      | StringSelectMenuInteraction
      | undefined
   = undefined
  ) {
      if (this.message) {
         try{ //Edit existing message
            this.message = await this.message.edit({ embeds: embed, components: components});
            if(!(interaction instanceof CommandInteraction) && interaction?.replied == false){
               interaction?.update({fetchReply: false});
            }
         }
         catch(err){ //If the saved message was deleted in the meantime create a new menu.
            console.log(err);
            if(interaction){
               this.message = await interaction.channel?.send({ embeds: embed, components: components });
            }
            else if(this.channel){
               try{
                  this.message = await this.channel.send({ embeds: embed, components: components });
               }
               catch(err){
                  console.log(err);
               }
            }
         }
      }
      else{
         if(interaction){
            if(!(interaction instanceof CommandInteraction) && interaction?.replied == false){
               interaction?.update({fetchReply: false});
            }

            if(interaction.channel){
               this.channel = interaction.channel;
               this.message = await interaction.channel.send({ embeds: embed, components: components });
            }
         }
         else if(this.channel){
            try{
               this.message = await this.channel.send({ embeds: embed, components: components });
            }
            catch(err){
               console.log(err);
            }
         }
      }
  }

  async deleteAndUpdate(interaction:
   | CommandInteraction,
   embed: EmbedBuilder[],
   components: ActionRowBuilder<any>[] = []){

      try {
         if(this.message && this.message.deletable){
            await this.message.delete();
         }
      } catch (error) {
         console.log("Failed deleting old menu");
      }

      await this.updateDisplay(embed,components,interaction);
   }
}
