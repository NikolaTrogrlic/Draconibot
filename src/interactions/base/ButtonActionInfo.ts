import { SkillName } from "../../models/enums/SkillName";
import { ButtonType } from "../ButtonType";


export class ButtonActionInfo {

   key: string;
   previousInteractionID: string;
   isSkill: boolean = false;
   targetNumber: number = -1;
 
   constructor(key: string, previousInteractionID: string) {
     this.key = key;
     this.previousInteractionID = previousInteractionID;
   }
 
   static buttonActions: string[] = Object.values(ButtonType)
   static skillActions: string[] = Object.values(SkillName)
 
   static getButtonActionName(customButtonID: string) {
 
     let target = Number(customButtonID);
     if(Number.isNaN(target) == false){
       let skillButtonInfo = new ButtonActionInfo(
           "Target",
           ""
       );
       skillButtonInfo.targetNumber = target;
       return skillButtonInfo;
     }

     for(const action of this.buttonActions){
         if (customButtonID.startsWith(action)) {
             return new ButtonActionInfo(
                 action,
                 customButtonID.slice(action.length)
             );
         }
     }

     for(let skillAction of this.skillActions){
       if (customButtonID.startsWith(skillAction)) {
           let skillButtonInfo = new ButtonActionInfo(
               skillAction,
               customButtonID.slice(skillAction.length)
           );
           skillButtonInfo.isSkill = true;
           return skillButtonInfo;
       }
     }
 
     return new ButtonActionInfo( customButtonID , "");
   }
 }