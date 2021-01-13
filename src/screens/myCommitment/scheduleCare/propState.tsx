interface IStateToProps {
  fullname: string;
  countActive: number;
  countFinish: number;
  status_id: number;
  status_name: string;
  barcode: any;
}

interface IProps extends IStateToProps, IDispatchToProps {
  componentId: string;
  avatar_img: string;
}

interface IDispatchToProps {
  onLoadingAction?: () => void;
  offLoadingAction?: () => void;
}

interface IState {
  listFolder: any;
  showModalEmail: boolean;
  email: string;
  item: any;
  date: Date;
  show: boolean;
  mode: boolean;
}

export {IProps, IState};
