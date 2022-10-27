import { StepsModalState } from "./steps-modal";

export enum ModalDisplay {
    InstallMetamask = 'INSTALL_METAMASK',
    EnablePermissions = 'ACCEPT_PERMISSIONS',
    SignIn = 'SIGN_IN',
}

export interface UI {
    stepsModal: StepsModalState
}
