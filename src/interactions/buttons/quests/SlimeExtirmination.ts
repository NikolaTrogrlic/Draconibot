import { ButtonBuilder, ButtonStyle } from "discord.js";
import { CombatLocation } from "../../../models/enums/Location";
import { BattleNode } from "../../../models/quests/Nodes/BattleNode";
import { EndNode } from "../../../models/quests/Nodes/EndNode";
import { Quest } from "../../../models/quests/Quest";
import { ButtonName } from "../../ButtonName";
import { QuestStartBase } from "./QuestStartBase";

export class SlimeExtermination extends QuestStartBase{

    createQuest(): Quest {
        
        var questLayout = new BattleNode(CombatLocation.Plains, "It seems this area is free of slimes.");

        questLayout.setForward(
                new BattleNode(CombatLocation.Plains, "All slimes have been cleared.")
        ).setForward(
                new EndNode(150, 20)
        );
        
        return new Quest("Slime Extermination","**Objective:** Defeat all the slimes!\n\nAfter an accident involving a giant wedding cake slimes have started multiplying like crazy.\nPrevent them from spreading even more!" , 1, 2, questLayout);
    }

    static button(): ButtonBuilder {
        return new ButtonBuilder()
        .setCustomId(ButtonName.SlimeExtermination)
        .setLabel("Slime Extermination")
        .setStyle(ButtonStyle.Secondary);
     }
}