interface IProps {
  componentId: string;
  item: any;
  username: string;
  onLoadingAction?: () => void;
  offLoadingAction?: () => void;
}
interface IState {
  images: string;
}

export {IProps, IState};
