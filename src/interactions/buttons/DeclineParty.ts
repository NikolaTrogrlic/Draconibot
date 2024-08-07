import { ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, userMention } from "discord.js";
import { Globals } from "../../globals";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";

export class DeclineParty extends ButtonBase{

  async execute(interaction: ButtonInteraction, globals: Globals, originInteractionID: string): Promise<any> {
    if (originInteractionID?.length > 0) {
      const invite = globals.partyInvites.find(
        (x) =>
          x.invitedUserID == interaction.user.id &&
          x.inviteInteractionID == originInteractionID
      );
      if (invite) {
  
        const player = globals.players.find(
          (x) => x.userID == interaction.user.id
        );
  
        if (player) {
          const party = globals.parties.find((x) => x.id == invite.partyID);
          if (party) {
            globals.partyInvites.splice(globals.partyInvites.indexOf(invite), 1);
            const mention = userMention(interaction.user.id);
            const reply = await interaction.reply(`${mention} declined the party invite.`);   
            setTimeout(() => reply.delete(), 3000);    
          } else {
            const reply = await interaction.reply({
              content: `Invite expired.`,
              ephemeral: true,
            });
            setTimeout(() => reply.delete(), 3000);
          }
        } else {
          const reply = await interaction.reply({
            content: "You must be a player to accept an invite.",
            ephemeral: true,
          });
          setTimeout(() => reply.delete(), 3000);
        }
      } else {
        const reply = await interaction.reply({
          content: `This invite is not meant for you.`,
          ephemeral: true,
        });
        setTimeout(() => reply.delete(), 3000);
      }
    } else {
      const reply = await interaction.reply({
        content: "Error occured while declining party invite.",
        ephemeral: true,
      });
      setTimeout(() => reply.delete(), 3000);
    }
  }

  static button(previousInteractionID: string): ButtonBuilder {
    return new ButtonBuilder()
    .setCustomId(ButtonName.DeclineParty + previousInteractionID)
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger);
  }
}