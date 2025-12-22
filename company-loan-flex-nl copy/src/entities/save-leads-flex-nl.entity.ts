import { LeadRowEntity } from "./lead-row.entity";

export class SaveLeadsFlexNlEntity {
  productName: "leads_flexbedrijfskrediet";
  product: "flex_bedrijfskrediet";
  leadRow: LeadRowEntity;

  constructor(objData: LeadRowEntity) {
    this.leadRow = new LeadRowEntity(objData);
  }
}
