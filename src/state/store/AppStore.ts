import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {profile} from '../helpers/profile';

export interface GlobalsType {
    bannerOrder?: {
        [id: string]: number;
    };

    restaurantOrder?: {
        [id: string]: number;
    };

    cashbackOrder?: {
        [id: string]: number;
    };

    storyOrder?: {
        [id: string]: number;
    };

    dealOrder?: {
        [id: string]: number;
    };

    deliveryCharge?: number;
    vatPercentage?: number;
    serviceChargePercentage?: number;
    pointToTaka?: number;
    takaToPoint?: number;

    crossOrdering?: boolean;
}

export class AppStore {
    parent: Store;
    listener: (() => void) | null = null;
    globals: GlobalsType | null = null;

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    setGlobals(data: GlobalsType) {
        const _p = profile('AppStore.setGlobals');

        this.globals = data;

        _p();
    }

    listen() {
        const _p = profile('AppStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('globals')
            .doc('globals')
            .onSnapshot((snap) => {
                this.setGlobals(<GlobalsType>snap.data());
                this.setReady();
            });

        _p();
    }

    unlisten() {
        const _p = profile('AppStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }
}
