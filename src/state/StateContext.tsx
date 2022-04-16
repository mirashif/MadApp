import React, {createContext, useContext} from 'react';
import {RootStoreType, Store} from './store';

const StateContext = createContext<Store | null>(null);

export interface StateContextPropType {
    store: Store;
}

export const StateProvider: React.FC<StateContextPropType> = ({
    store,
    children,
}) => {
    return (
        <StateContext.Provider value={store}>{children}</StateContext.Provider>
    );
};

export function useAppState<KEY extends keyof RootStoreType>(
    name: KEY,
): Store[KEY];

export function useAppState<KEY extends keyof RootStoreType>(): Store;

export function useAppState<KEY extends keyof RootStoreType>(
    name?: KEY,
): Store[KEY] | Store {
    const context = useContext(StateContext);

    if (!context) {
        throw new Error('Store not provided.');
    }

    if (name) {
        return context[name];
    } else {
        return context;
    }
}
