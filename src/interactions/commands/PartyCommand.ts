import {
  ActionRowBuilder,
  BaseInteraction,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  bold,
  userMention,
} from "discord.js";
import { Globals, PartyInvite } from "../../globals";
import { CommandBase } from "../base/CommandBase";
import { Party } from "../../models/Party";
import { Player } from "../../models/Player";
import { DeclineParty } from "../buttons/DeclineParty";
import { JoinParty } from "../buttons/JoinParty";

enum PartyOptions {
  Create = "create",
  Add = "add",
  Remove = "remove",
  Info = "info",
  Leave = "leave",
}

export class PartyCommand extends CommandBase {

   needsPlayerExistance: boolean = true;
   canOnlyPerformOutsideBattle: boolean = true;

  getSlashCommand() {
    return new SlashCommandBuilder()
      .setName("party")
      .setDescription("Create a party or add members to it.")
      .addSubcommand((option) =>
        option
          .setName(PartyOptions.Create)
          .setDescription("Creates a new party")
      )
      .addSubcommand((option) =>
        option
          .setName(PartyOptions.Add)
          .setDescription("Add a user to your party")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user")
              .setRequired(true)
          )
      )
      .addSubcommand((option) =>
        option
          .setName(PartyOptions.Info)
          .setDescription("Fetches information about the party")
      )
      .addSubcommand((option) =>
        option
          .setName(PartyOptions.Remove)
          .setDescription("Removes a user from your party")
          .addUserOption((option) =>
            option
              .setName("target")
              .setDescription("The user")
              .setRequired(true)
          )
      )
      .addSubcommand((option) =>
        option
          .setName(PartyOptions.Leave)
          .setDescription(
            "Leaves the party you are currently in. Leaves battle if you are currently in one."
          )
      );
  }

  async execute(interaction: any, globals: Globals): Promise<any> {
    var subcommand = interaction.options.getSubcommand();
    if (subcommand == PartyOptions.Create || subcommand == PartyOptions.Info) {
      await interaction.deferReply({ ephemeral: true });
    } else {
      await interaction.deferReply();
    }

    const player = globals.getPlayerById(interaction.user.id);

    switch(subcommand){
      case PartyOptions.Create:{
        this.createParty(interaction, globals, player!);
        break;
      }
      case PartyOptions.Add:{
         this.addToParty(interaction,globals,player!);
        break;
      }
      case PartyOptions.Info:{
         this.partyInfo(interaction,globals,player!);
        break;
      }
      case PartyOptions.Remove:{
         this.removeFromParty(interaction,globals,player!,interaction.options.getUser('target').id)
        break;
      }
      case PartyOptions.Leave:{
         this.leaveFromParty(interaction,globals,player!)
        break;
      }
   }
  }

  createParty(interaction: any, globals: Globals, player: Player) {
    if (player.party) {
      return interaction.editReply(
        "You are already in a party! Check party with /party info"
      );
    } else {
      const party = new Party(player);
      globals.parties.push(party);
      return interaction.editReply("Created new party.");
    }
  }

  partyInfo(interaction: CommandInteraction, globals: Globals, player: Player) {
    if (player.party) {
      let fields = [];

      let hpTotal = 0;
      let maxHPTotal = 0;

      for (const member of player.party.partyMembers) {
        fields.push({
          name: bold(member.name),
          value: `HP: ${member.stats.HP}/${member.stats.maxHP} | Class: ${member.mainJob.name}`,
        });
        hpTotal += member.stats.HP;
        maxHPTotal += member.stats.maxHP;
      }

      let color = 0xff9900;
      const totalPartyHPPercentage = hpTotal / maxHPTotal;

      if (totalPartyHPPercentage <= 0.3) {
        color = 0xff0000;
      } else if (
        totalPartyHPPercentage > 0.3 &&
        totalPartyHPPercentage <= 0.6
      ) {
        color = 0xffcc00;
      } else {
        color = 0x66ff33;
      }

      const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(`${player.party?.partyLeader.name}'s party`)
        .setDescription(`Members: ${player.party.partyMembers.length}/4`)
        .addFields(fields)
        .setTimestamp();

      interaction.editReply("Sending party info...");
      interaction.channel?.send({ embeds: [embed] });
      
    } else {
      interaction.editReply("Must be in a party first!");
    }
  }

  async leaveFromParty(interaction: CommandInteraction, globals: Globals, player: Player)
  {
    if(player.party && !player.battleID){

      if(player.party.partyLeader.userID != player.userID){
        interaction.channel?.send(`${player.nickname} left ${player.party.partyLeader.nickname}'s party`);
      }

      var result = player.party.removeFromParty(player);

      if(result){
        interaction.editReply("Left the party...");
      }
      else{
        interaction.editReply("Error occured while leaving party.");
      }
    }
    else{
      interaction.editReply("You must be in a party and out of combat to leave the party. If you are stuck leave the party with /leave");
    }

  }

  async removeFromParty(
    interaction: CommandInteraction,
    globals: Globals,
    player: Player,
    targetedUserId: string
  ){
    if (player.party && !player.battleID) {

      if(player.party.partyLeader.userID == player.userID){

        const playerToRemove = globals.getPlayerById(targetedUserId);

        if (playerToRemove)
        {
          const result = player.party.removeFromParty(playerToRemove);
  
          if(result){
            interaction.editReply("Kicked player.")
            interaction.channel?.send(`${playerToRemove.nickname} was kicked from ${player.party.partyLeader}'s party`)
          }
          else{
            interaction.editReply("Couldn't remove player from party.");
          }
  
        }
        else
        {
          interaction.editReply("User is not part of the party.");
        }

      }
      else{
        interaction.editReply("Must be party leader to kick people. Did you mean to leave? /party leave.");     
      }
    }
    else
    {
       interaction.editReply("You must be in a party and out of combat to kick people. If you want to force leave a party use /leave!");
    }
  }

  addToParty(interaction: any, globals: Globals, player: Player) {
    if (player.party) {
      const targetedUser = interaction.options.getUser("target");
      if (targetedUser) {
        const partyMember = globals.getPlayerById(targetedUser.id);
        if (partyMember && !partyMember.party) {
          if (player.party.isBattling) {
            return "Can not perform this action while in battle!";
          } else if (player.party.partyMembers.length >= 4) {
            return "Only 4 party members are allowed !";
          } else if (
            player.party.partyMembers.findIndex(
              (x) => x.userID == targetedUser.userID
            ) == -1
          ) {
            if (!player.party.partyLeader) {
              return interaction.editReply(`No party leader in party.`);
            } else {
              this.inviteToParty(player.party, partyMember, interaction, globals);
            }
          } else {
            return interaction.editReply("Party member already in list!");
          }
        } else {
          return interaction.editReply(
            `Player is already in a party or has not started the game!`
          );
        }
      } else {
        return interaction.editReply(
          `Please tag a user to add to party within the command !`
        );
      }
    } else {
      return interaction.editReply("You must be in a party first!");
    }
  }

  async inviteToParty(
    party: Party,
    invitedPlayer: Player,
    interaction: any,
    globals: Globals
  ) {
    let invite = new PartyInvite(
      invitedPlayer.userID,
      party.id,
      interaction.id
    );
    globals.partyInvites.push(invite);
    await interaction.editReply(`Invited ${invitedPlayer.name} to party.`);

    const row = new ActionRowBuilder().addComponents(
      DeclineParty.button(interaction.id),
      JoinParty.button(interaction.id)
    );

    const mention = userMention(invitedPlayer.userID);

    const result = await interaction.followUp({
      content: `${mention}, you have been invited to ${party.partyLeader?.name}'s party...`,
      components: [row],
    });
    setTimeout(() => {
      result.delete();
      let inviteIndex = globals.partyInvites.indexOf(invite);
      if (inviteIndex != -1) {
        globals.partyInvites.splice(inviteIndex);
      }
    }, 20000);
  }
}
