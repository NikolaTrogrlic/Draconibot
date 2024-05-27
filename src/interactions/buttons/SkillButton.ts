import { ButtonInteraction } from "discord.js";
import { Globals } from "../../globals"; 
import { IGameInteraction } from "../base/IGameInteraction";
import { BurstAction } from "../../models/skills/general/BurstAction";

export class SkillButton implements IGameInteraction {

  needsPlayerExistance: boolean = true;
  canOnlyPerformOutsideBattle: boolean = false;
  canOnlyPerformOnOwnTurn: boolean = true;
  
  async execute(
    interaction: ButtonInteraction,
    globals: Globals,
    skillName: string
  ): Promise<any> {
    const player = globals.getPlayerById(interaction.user.id);
    if (player) {
      let battle = globals.getPlayerBattle(player);
      if (battle) {

        let skill = player.generalSkills.find((x) => x.name == skillName);

        if(!skill){
          skill = player.mainJob.skills.find((x) => x.name == skillName);
        }

        if (!skill) {
          skill = player.subJob.skills.find((x) => x.name == skillName);
        }

        if(skill){
          if(skill instanceof BurstAction){
            if(player.burst >= player.maxBurst){
              await interaction.update({fetchReply: false});
              battle.currentAction = undefined;
              skill.use(player, battle);
              battle.currentTarget = 0;
            }
            else{
              const reply = await interaction.reply({
                content: `Meter must be full to perform burst.`,
                ephemeral: true,
              });
              setTimeout(() => reply.delete(), 2000);
            }
          }
          else if (player.bp >= skill?.bpCost) {

            await interaction.update({fetchReply: false});
            battle.currentAction = undefined;
            skill.use(player, battle);
            battle.currentTarget = 0;

          }
          else {
            const reply = await interaction.reply({
              content: `Not enough bp to perform skill. BP COST: ${skill.bpCost}`,
              ephemeral: true,
            });
            setTimeout(() => reply.delete(), 2000);
          }
        }
        else{
          await interaction.reply({
            content: `${skillName} not found among equipped skills. This is probbaly the result of an error.`,
            ephemeral: true,
          });
        }
      }
    }
  }
}
