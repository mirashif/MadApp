import {makeAutoObservable} from 'mobx';
import {Store} from './index';

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
        return this.data.id;
    }

    get isAvailable() {
        return (
            this.data?.requiredPoints <=
            (this.parent.parent.user.userAttributes?.points || 0)
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

    upsert(id: string, data: CashbackType): void {
        this.cashbacks[id] = new Cashback(this, data);
    }

    remove(id: string): void {
        delete this.cashbacks[id];
    }

    listen(): void {
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
            });
    }

    unlisten(): void {
        if (this.listener) {
            this.listener();
            this.listener = null;
        }
    }

    get all(): Cashback[] {
        return Object.values(this.cashbacks).sort((a, b) => {
            return (
                (this.parent.app.globals?.cashbackOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.cashbackOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Cashback | null {
        return this.cashbacks[id] || null;
    }
}
