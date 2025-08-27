import React from "react";
import { Button } from "@ui-components/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { T_BeneficialOwner } from "./beneficialOwnerFormTypes";
import { faTrash } from "@awesome.me/kit-60ea292f8c/icons/classic/regular";

export const BeneficialOwnerCard: React.FC<{
    owner: T_BeneficialOwner;
    onDelete: () => void;
}> = ({ owner, onDelete }) => (
    <div className="p-4 mb-3 border border-base-300 bg-base-100 rounded-lg flex justify-between items-start hover:shadow-md transition-shadow">
        <div className="space-y-1">
            <div className="font-semibold text-base-content">{owner.name}</div>
            <div className="text-sm text-base-content">{owner.ssn}</div>
            <div className="text-sm font-medium text-base-content">{owner.ownership}%</div>
            <div className="text-sm text-base-content">{owner.country}</div>
        </div>
        <Button variant="redBeneficialOwner" className="!mb-0" onClick={onDelete}>
            <FontAwesomeIcon icon={faTrash} />
        </Button>
    </div>
);

export default BeneficialOwnerCard;
