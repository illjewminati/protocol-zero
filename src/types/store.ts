import { ActionCreator, AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ExtraArgument } from '../store/index';
import { Blockchain } from './blockchain';
import { UI } from './ui';


export type ThunkCreator<R = Promise<any>> = ActionCreator<ThunkAction<R, StoreState, ExtraArgument, AnyAction>>;


export interface StoreState {
    readonly ui: UI | null,
    readonly blockchain: Blockchain | null,
}
