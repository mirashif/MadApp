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

export class Restaurant {
    parent: RestaurantStore;
    data: RestaurantType;

    constructor(parent: RestaurantStore, data: RestaurantType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get id() {
        return this.data.id;
    }

    get items() {
        return this.parent.parent.items.getForRestaurant(this.data.id);
    }

    get popularItems() {
        return this.parent.parent.items.popularForRestaurant(this.data.id);
    }

    get isAvailable() {
        return this.availableBranches.length > 0;
    }

    get branches() {
        return this.parent.parent.branches.all.filter(
            (branch) => branch.data.restaurantID === this.id,
        );
    }

    get availableBranches() {
        return this.branches.filter((branch) => branch.isAvailable);
    }

    get categories() {
        return Object.keys(
            this.parent.parent.categories.categoriesByRestaurant[this.id] || {},
        ).map((key) => this.parent.parent.categories.categories[key]);
    }
}

export class RestaurantStore {
    parent: Store;
    listener: (() => void) | null = null;

    restaurants: {
        [id: string]: Restaurant;
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    upsert(id: string, data: RestaurantType): void {
        this.restaurants[id] = new Restaurant(this, data);
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

    get all(): Restaurant[] {
        return Object.values(this.restaurants).sort((a, b) => {
            return (
                (this.parent.app.globals?.restaurantOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.restaurantOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Restaurant | null {
        return this.restaurants[id] || null;
    }
}
