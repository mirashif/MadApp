import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {profile} from '../helpers/profile';

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

    isAvailable: boolean;
    isShown: boolean;
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
        const _p = profile('Restaurant.id');

        return _p(this.data.id);
    }

    get bannerTitle() {
        const _p = profile('Restaurant.bannerTitle');

        return _p(this.data.bannerTitle);
    }

    get bannerDescription() {
        const _p = profile('Restaurant.bannerDescription');

        return _p(this.data.bannerDescription);
    }

    get items() {
        const _p = profile('Restaurant.items');

        return _p(this.parent.parent.items.getForRestaurant(this.data.id));
    }

    get popularItems() {
        const _p = profile('Restaurant.popularItems');

        return _p(this.parent.parent.items.popularForRestaurant(this.data.id));
    }

    get isAvailable() {
        const _p = profile('Restaurant.isAvailable');

        return _p(this.data.isAvailable && this.availableBranches.length > 0);
    }

    get branches() {
        const _p = profile('Restaurant.branches');

        return _p(
            this.parent.parent.branches.all.filter(
                (branch) => branch.data.restaurantID === this.id,
            ),
        );
    }

    get availableBranches() {
        const _p = profile('Restaurant.availableBranches');

        return _p(this.branches.filter((branch) => branch.isAvailable));
    }

    get categories() {
        const _p = profile('Restaurant.categories');

        return _p(
            Object.keys(
                this.parent.parent.categories.categoriesByRestaurant[this.id] ||
                    {},
            ).map((key) => this.parent.parent.categories.categories[key]),
        );
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

    ready = false;

    setReady(ready: boolean = true) {
        this.ready = ready;
    }

    upsert(id: string, data: RestaurantType): void {
        const _p = profile('RestaurantStore.upsert');

        this.restaurants[id] = new Restaurant(this, data);

        _p();
    }

    remove(id: string): void {
        const _p = profile('RestaurantStore.remove');

        delete this.restaurants[id];

        _p();
    }

    listen(): void {
        const _p = profile('RestaurantStore.listen');

        this.listener = this.parent.firebase
            .firestore()
            .collection('restaurants')
            .where('isShown', '==', true)
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

                this.setReady();
            });

        _p();
    }

    unlisten(): void {
        const _p = profile('RestaurantStore.unlisten');

        if (this.listener) {
            this.listener();
            this.listener = null;
        }

        _p();
    }

    get all(): Restaurant[] {
        const _p = profile('RestaurantStore.all');

        return _p(
            Object.values(this.restaurants).sort((a, b) => {
                return (
                    (this.parent.app.globals?.restaurantOrder?.[a.data.id] ||
                        0) -
                    (this.parent.app.globals?.restaurantOrder?.[b.data.id] || 0)
                );
            }),
        );
    }

    get(id: string): Restaurant | null {
        const _p = profile('RestaurantStore.get');

        return _p(this.restaurants[id] || null);
    }
}
