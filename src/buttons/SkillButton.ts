import { ButtonInteraction } from "discord.js";
import { Globals } from "../globals"; 

export class SkillButton {
  static async execute(
    interaction: ButtonInteraction,
    globals: Globals,
    skillName: string
  ): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);
    if (player) {
      let battle = globals.getPlayerBattle(player);
      if (battle && battle.currentActionOwner == player) {
        if (battle.currentTarget == -1) {
          battle.currentTarget = 0;
        }

        let skill = player.generalSkills.find((x) => x.name == skillName);

        if (!skill) {
          let skill = player.mainJob.skills.find((x) => x.name == skillName);

          if (!skill) {
            skill = player.subJob.skills.find((x) => x.name == skillName);
          }

          if (!skill) {
            interaction.reply({
              content: `${skillName} not found among equipped skills. This is probbaly the result of an error.`,
              ephemeral: true,
            });
          } else {
            if (player.bp >= skill?.bpCost) {
              const reply = await interaction.reply({
                content: `Using ${skillName} on target ${
                  battle.currentTarget + 1
                }`,
                ephemeral: true,
              });
              reply.delete();
              battle.currentActionOwner = undefined;
              skill.use(player, battle);
              battle.currentTarget = -1;
            } else {
              const reply = await interaction.reply({
                content: `Not enough bp to perform skill. BP COST: ${skill.bpCost}`,
                ephemeral: true,
              });
              setTimeout(() => reply.delete(), 2000);
            }
          }
        } else {
          if (player.bp >= skill?.bpCost) {
            const reply = await interaction.reply({
              content: `Using ${skillName} on target ${
                battle.currentTarget + 1
              }`,
              ephemeral: true,
            });
            reply.delete();
            battle.currentActionOwner = undefined;
            skill.use(player, battle);
            battle.currentTarget = -1;
          } else {
            const reply = await interaction.reply({
              content: `Not enough bp to perform skill. BP COST: ${skill.bpCost}. YOUR BP: ${player.bp}`,
              ephemeral: true,
            });
            setTimeout(() => reply.delete(), 2000);
          }
        }
      } else {
        const reply = await interaction.reply({
          content:
            "Must be in a battle and must be your turn to perform actions.",
          ephemeral: true,
        });
        setTimeout(() => reply.delete(), 2000);
      }
    } else {
      const reply = await interaction.reply({
        content: "Must create a character first to perform actions in battle.",
        ephemeral: true,
      });
      setTimeout(() => reply.delete(), 2000);
    }
  }
}
