import { ButtonBuilder, ButtonInteraction, ButtonStyle, userMention } from "discord.js";
import { Globals } from "../globals";
import { ButtonBase, ButtonKey } from "./ButtonBase";

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
                  return interaction.reply({
                    content: "May not join a party in battle!",
                    ephemeral: true,
                  });
                }
      
                player.partyID = party.id;
                party.partyMembers.push(player);
                globals.partyInvites.splice(globals.partyInvites.indexOf(invite), 1);
      
                const mention = userMention(interaction.user.id);
                return interaction.reply(`${mention} accepted the party invite.`);
                
              } else {
                const mention = userMention(interaction.user.id);
                return interaction.reply({
                  content: `${mention} accepted party invite, but the party was removed in the meantime.`,
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
            content: "Error occured while accepting party invite.",
            ephemeral: true,
          });
        }
  }

  static button(previousInteractionID: string): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonKey.JoinParty + previousInteractionID)
      .setLabel('Join Party')
      .setStyle(ButtonStyle.Success);
  }

  constructor(){
    super(ButtonKey.JoinParty);
  }
}