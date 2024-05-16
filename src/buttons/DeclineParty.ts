import { ButtonBuilder, ButtonInteraction, ButtonStyle, CacheType, userMention } from "discord.js";
import { Globals } from "../globals";
import { ButtonBase, ButtonKey } from "./ButtonBase";

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
            return interaction.reply(`${mention} declined the party invite.`);       
          } else {
            return interaction.reply({
              content: `Invite expired.`,
              ephemeral: true,
            });
          }
        } else {
          return interaction.reply({
            content: "You must be a player to accept an invite.",
            ephemeral: true,
          });
        }
      } else {
        return interaction.reply({
          content: `This invite is not meant for you.`,
          ephemeral: true,
        });
      }
    } else {
      return interaction.reply({
        content: "Error occured while declining party invite.",
        ephemeral: true,
      });
    }
  }

  static button(previousInteractionID: string): ButtonBuilder {
    return new ButtonBuilder()
    .setCustomId(ButtonKey.DeclineParty + previousInteractionID)
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger);
  }

  constructor(){
      super(ButtonKey.DeclineParty);
  }
}