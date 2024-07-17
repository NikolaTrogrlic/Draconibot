import { SkillName } from "../../models/enums/SkillName";
import { TargetType } from "../../models/enums/TargetType";
import { ButtonName } from "../ButtonName";

export enum ButtonType{
  SkillButton = 0,
  TargetingButton = 1,
  GeneralButton = 2
}


export class ButtonActionInfo {

   key: string;
   extraData: string;
   type: ButtonType;
 
   constructor(key: string, type: ButtonType,extraData: string) {
     this.key = key;
     this.type = type;
     this.extraData = extraData;
   }
 
   static buttonActions: string[] = Object.values(ButtonName)
   static skillActions: string[] = Object.values(SkillName)
 
   static getButtonInfo(customButtonID: string) {

    let target = Number(customButtonID);
    if(Number.isNaN(target) == false){
      return new ButtonActionInfo("Target",ButtonType.TargetingButton,customButtonID);
    }

    for(let skillAction of this.skillActions){
      if (customButtonID.startsWith(skillAction)) {
          return new ButtonActionInfo(skillAction,ButtonType.SkillButton,skillAction);
      }
    }

     
    for(let action of this.buttonActions){
      if (customButtonID.startsWith(action)) {
          return new ButtonActionInfo(action,ButtonType.GeneralButton,customButtonID.slice(action.length));
      }
    }
   }
 }