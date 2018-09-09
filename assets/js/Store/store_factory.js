import { createStore } from 'redux';
import { stateData } from './initialState';
import { main } from '../reducers/main';

export const store_factory = (initialState=stateData) => {
    return createStore(main, initialState);
};
