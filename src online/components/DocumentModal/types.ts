import { Dispatch, SetStateAction } from "react";

export type T_ModalProps = {
    handleClick: () => void;
    modalOpen: boolean;
    toggleModalOpen: Dispatch<SetStateAction<boolean>>;
};
