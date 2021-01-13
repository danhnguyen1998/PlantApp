interface IProps {
  componentId: string;
  item: any;
  username: string;
  onLoadingAction?: () => void;
  offLoadingAction?: () => void;
}
interface IState {
  listImages: any;
  images: any;
  region: any;
  locationName: string
}

export {IProps, IState};
