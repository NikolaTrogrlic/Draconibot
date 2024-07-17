import { ButtonBuilder, ButtonInteraction, ButtonStyle, userMention } from "discord.js";
import { Globals } from "../../globals";
import { ButtonName } from "../ButtonName";
import { ButtonBase } from "../base/ButtonBase";

export class JoinParty extends ButtonBase{

  async execute(interaction: ButtonInteraction, globals: Globals, previousInteractionID: string): Promise<any> {
      if (previousInteractionID?.length > 0) {
          const invite = globals.partyInvites.find(
            (x) =>
              x.invitedUserID == interaction.user.id &&
              x.inviteInteractionID == previousInteractionID
          );
          if (invite) {
      
            const player = globals.players.find(
              (x) => x.userID == interaction.user.id
            );
      
            if (player) {
              const party = globals.parties.find((x) => x.id == invite.partyID);
              if (party) {
      
                if (party.isBattling || player.battleID) {
                  const reply = await interaction.reply({
                    content: "May not join a party in battle!",
                    ephemeral: true,
                  });
                  setTimeout(() => reply.delete(), 3000);
                }
      
                player.partyID = party.id;
                party.partyMembers.push(player);
                globals.partyInvites.splice(globals.partyInvites.indexOf(invite), 1);
      
                const mention = userMention(interaction.user.id);
                const reply = await interaction.reply(`${mention} accepted the party invite.`);
                setTimeout(() => reply.delete(), 20000);
              } else {
                const mention = userMention(interaction.user.id);
                const reply = await interaction.reply({
                  content: `${mention} accepted party invite, but the party was removed in the meantime.`,
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
            content: "Error occured while accepting party invite.",
            ephemeral: true,
          });
          setTimeout(() => reply.delete(), 2000);
        }
  }

  static button(previousInteractionID: string): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonName.JoinParty + previousInteractionID)
      .setLabel('Join Party')
      .setStyle(ButtonStyle.Success);
  }
}