import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { Globals } from "../../../globals";
import { ButtonType } from "../../ButtonType";
import { SelectMenuType } from "../../SelectMenuType";
import { ButtonBase } from "../../base/ButtonBase";

export class SetJob extends ButtonBase {
  needsPlayerExistance: boolean = true;
  canOnlyPerformOutsideBattle: boolean = true;
  canOnlyPerformOnOwnTurn: boolean = false;

  async execute(
    interaction: ButtonInteraction,
    globals: Globals
  ): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);
    await interaction.update({fetchReply: false});

    if (player) {
      let jobSelect: StringSelectMenuOptionBuilder[] = [];
      for (let job of player.jobs) {
        jobSelect.push(
          new StringSelectMenuOptionBuilder()
            .setLabel(`${job.name} [Level: ${job.level} | Exp: ${job.exp}]`)
            .setValue(job.name)
        );
      }

      const select = new StringSelectMenuBuilder()
        .setCustomId(SelectMenuType.SetMainJobMenu)
        .setPlaceholder("Select a main job to change to.")
        .addOptions(jobSelect);

      const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select);
      player.menu.appendToDisplay(interaction, [row]);
    }
    else{
      interaction.update({fetchReply: false});
    }
  }

  static button(): ButtonBuilder {
    return new ButtonBuilder()
      .setCustomId(ButtonType.SetJob)
      .setLabel("Set Main")
      .setStyle(ButtonStyle.Secondary);
  }
}
