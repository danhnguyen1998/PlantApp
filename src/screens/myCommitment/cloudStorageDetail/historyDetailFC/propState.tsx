interface IProps {
  componentId: string;
  item: any;
  username: string;
  onLoadingAction?: () => void;
  offLoadingAction?: () => void;
}
interface IState {
  images: any;
  listImages: any;
}

export {IProps, IState};
