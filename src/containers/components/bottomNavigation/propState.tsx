interface IProps {
  componentId: string;
  activeTab: string;
  showAddCommitments?: boolean;
  hasPaymentFailed?: boolean;
}
interface IState {
  showConfirmLogout: boolean;
  name: string,
  showModalName: boolean
}

export {IProps, IState};
