import {makeAutoObservable} from 'mobx';
import {Store} from './index';

export interface RestaurantType {
    id: string;
    categoryOrder: {
        [categoryID: string]: number;
    };

    name: string;
    logoImageURI: string;
    bannerImageURI: string;
    bannerTitle: string;
    bannerDescription: string;
    phone: string;
}

export interface RestaurantWithAvailabilityType extends RestaurantType {
    isAvailable: boolean;
}

export class RestaurantStore {
    parent: Store;
    listener: (() => void) | null = null;

    restaurants: {
        [id: string]: RestaurantType;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: RestaurantType): void {
        this.restaurants[id] = data;
    }

    remove(id: string): void {
        delete this.restaurants[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collection('restaurants')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(
                            change.doc.id,
                            <RestaurantType>change.doc.data(),
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

    get all(): RestaurantWithAvailabilityType[] {
        return Object.values(this.restaurants)
            .sort((a, b) => {
                return (
                    (this.parent.app.globals?.restaurantOrder[a.id] || 0) -
                    (this.parent.app.globals?.restaurantOrder[b.id] || 0)
                );
            })
            .map((restaurant) => {
                const isAvailable =
                    this.parent.branches.availableFor(restaurant.id).length > 0;

                return {
                    ...restaurant,
                    isAvailable: isAvailable,
                };
            });
    }

    get(id: string): RestaurantWithAvailabilityType | null {
        if (!this.restaurants[id]) {
            return null;
        }

        const isAvailable = this.parent.branches.availableFor(id).length > 0;

        return {
            ...this.restaurants[id],
            isAvailable: isAvailable,
        };
    }
}
