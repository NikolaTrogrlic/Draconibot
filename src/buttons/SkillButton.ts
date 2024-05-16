import {
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  CacheType,
} from "discord.js";
import { Globals } from "../globals";
import { ButtonBase, ButtonKey } from "./ButtonBase";
import { Player } from "../models/Player";
import { Skill } from "../models/skills/Skill";
import { Skills } from "../models/skills/Skills";

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

        if (player.generalSkills.findIndex((x) => x == skillName) == -1) {
          if (player.equippedSkills.findIndex((x) => x == skillName) == -1) {
            interaction.reply({
              content: `${skillName} not found among equipped skills. This is probbaly the result of an error.`,
              ephemeral: true,
            });
          } else {
            let skill = Skills.jobSkills.find((x) => x.name == skillName);
            if (skill) {
              if (player.bp > skill?.bpCost) {
                interaction.reply({
                  content: `Using ${skillName} on target ${
                    battle.currentTarget + 1
                  }`,
                  ephemeral: true,
                });
                battle.currentActionOwner = undefined;
                skill.use(player, battle);
                battle.currentTarget = -1;
              } else {
                interaction.reply({
                  content: `Not enough bp to perform skill. BP COST: ${skill.bpCost}`,
                  ephemeral: true,
                });
              }
            }
          }
        } else {
          let skill = Skills.generalSkills.find((x) => x.name == skillName);
          if (skill) {
            if (player.bp > skill?.bpCost) {
              interaction.reply({
                content: `Using ${skillName} on target ${
                  battle.currentTarget + 1
                }`,
                ephemeral: true,
              });
              battle.currentActionOwner = undefined;
              skill.use(player, battle);
              battle.currentTarget = -1;
            } else {
              interaction.reply({
                content: `Not enough bp to perform skill. BP COST: ${skill.bpCost}`,
                ephemeral: true,
              });
            }
          }
        }
      } else {
        interaction.reply({
          content:
            "Must be in a battle and must be your turn to perform actions.",
          ephemeral: true,
        });
      }
    } else {
      interaction.reply({
        content: "Must create a character first to perform actions in battle.",
        ephemeral: true,
      });
    }
  }

  static canPlayerUseSkill(db: Globals, player: Player, skill: Skill): boolean {
    let battle = db.getPlayerBattle(player);

    if (
      battle &&
      battle.currentActionOwner == player &&
      player.bp - skill.bpCost > 0
    ) {
      if (player.generalSkills.findIndex((x) => x == skill.name) == -1) {
        if (player.equippedSkills.findIndex((x) => x == skill.name) == -1) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
}
