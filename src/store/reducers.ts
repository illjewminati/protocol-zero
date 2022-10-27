import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import { StoreState } from '../types/store';

import ReducerUI from './ui/reducers';
import ReducerBlockchain from './blockchain/reducers';

import * as actions from './actions';

export type RootAction = ActionType<typeof actions>;

export const createRootReducer = () => 
    combineReducers<StoreState>({
        ui: ReducerUI,
        blockchain: ReducerBlockchain,
    }
);

