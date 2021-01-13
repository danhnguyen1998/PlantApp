interface IProps {
  componentId: string;
  item: any;
  username: string;
  onLoadingAction?: () => void;
  offLoadingAction?: () => void;
}
interface IState {
  listFolder: any;
  images: any;
  name: string;
  showModalEmail: boolean;
  item: any;
}

export {IProps, IState};
