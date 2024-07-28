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
                new BattleNode(CombatLocation.Plains, "It seems this area is free of slimes.")
        ).setForward(
                new EndNode()
        );
        
        return new Quest("Slime Extermination", 1, 2, questLayout);
    }

    static button(): ButtonBuilder {
        return new ButtonBuilder()
        .setCustomId(ButtonName.SlimeExtermination)
        .setLabel("(LVL 01) Slime Extermination")
        .setStyle(ButtonStyle.Secondary);
     }
}