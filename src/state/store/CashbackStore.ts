import {makeAutoObservable} from 'mobx';
import {Store} from './index';

export interface CashbackType {
    id: string;

    name: string;
    requiredPoints: number;
    minimumOrderAmount: number;

    cashbackCouponCode: string;
}

export interface CashbackWithAvailabilityType extends CashbackType {
    isAvailable: boolean;
}

export class CashbackStore {
    parent: Store;
    listener: (() => void) | null = null;

    cashbacks: {
        [id: string]: CashbackType;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: CashbackType): void {
        this.cashbacks[id] = data;
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

    get all(): CashbackWithAvailabilityType[] {
        return Object.values(this.cashbacks)
            .sort((a, b) => {
                return (
                    (this.parent.app.globals?.cashbackOrder[a.id] || 0) -
                    (this.parent.app.globals?.cashbackOrder[b.id] || 0)
                );
            })
            .map((cashback) => {
                return {
                    ...cashback,
                    isAvailable:
                        cashback?.requiredPoints <=
                        (this.parent.user.userAttributes?.points || 0),
                };
            });
    }

    get(id: string): CashbackType | null {
        return this.cashbacks[id] || null;
    }
}
