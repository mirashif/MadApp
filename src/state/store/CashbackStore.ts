import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {profile} from '../helpers/profile';

export interface CashbackType {
    id: string;

    name: string;
    requiredPoints: number;
    minimumOrderAmount: number;

    cashbackCouponCode: string;
}

export class Cashback {
    parent: CashbackStore;
    data: CashbackType;

    constructor(parent: CashbackStore, data: CashbackType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get id() {
        const _p = profile('Cashback.id');

        return _p(this.data.id);
    }

    get isAvailable() {
        const _p = profile('Cashback.isAvailable');

        return _p(
            this.data?.requiredPoints <=
                (this.parent.parent.user.userAttributes?.points || 0),
        );
    }
}

export class CashbackStore {
    parent: Store;
    listener: (() => void) | null = null;

    cashbacks: {
        [id: string]: Cashback;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: CashbackType): void {
        const _p = profile('CashbackStore.upsert');

        this.cashbacks[id] = new Cashback(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('CashbackStore.remove');

        delete this.cashbacks[id];

        _p();
    }

    listen(): void {
        const _p = profile('CashbackStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('cashbacks')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <CashbackType>change.doc.data(),
                        );
                    } else if (change.type === 'removed') {
                        this.remove(change.doc.id);
                    }
                });

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('CashbackStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Cashback[] {
        const _p = profile('CashbackStore.all');

        return _p(
            Object.values(this.cashbacks).sort((a, b) => {
                return (
                    (this.parent.app.globals?.cashbackOrder?.[a.data.id] || 0) -
                    (this.parent.app.globals?.cashbackOrder?.[b.data.id] || 0)
                );
            }),
        );
    }

    get(id: string): Cashback | null {
        const _p = profile('CashbackStore.get');

        return _p(this.cashbacks[id] || null);
    }
}
