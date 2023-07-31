import { ILayoutBlock } from '../initialState';
import { ActionTypes } from '../reducer';

type PayloadType ={
  payload: ILayoutBlock[];
  changedByEditor?: boolean;
}

export type UpdatePayloadAction = {
  type: ActionTypes.UpdatePayload,
  payload:PayloadType,
};

export const updatePayloadAction = (payload: PayloadType): UpdatePayloadAction => ({
  type: ActionTypes.UpdatePayload,
  payload,
});