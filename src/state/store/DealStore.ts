import {makeAutoObservable} from 'mobx';
import {Store} from '.';
import {GlobalsType} from './AppStore';
import {UserAttributesType, UserType} from './UserStore';
import {SerializedCartable} from './Cartable';

export interface InterfaceAdditionType {
    addTo?:
        | 'restaurant'
        // | 'category'
        | 'item-header'
        | 'item-builder'
        | 'item-builder-engaged'
        | 'cart';

    title: string;
    body?: string;
    colors?: {
        background: string;
        foreground: string;
    };
}

export interface DealType {
    id: string;
    type: 'general' | 'coupon';

    title: string;
    description: string;
    code: string;
    hash: string;

    categories: string[];
    restaurants: string[];
    items: string[];

    scripts:
        | {
              applicability: string;
              generic: string;
              calc: string;
          }
        | {
              applicability: string;
              calc: string;
          }
        | {
              applicability: string;
              generic: string;
          };

    interfaceAdditions?: InterfaceAdditionType[];
}

export class Deal {
    parent: DealStore;
    data: DealType;

    constructor(parent: DealStore, data: DealType) {
        this.parent = parent;
        this.data = data;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    get applicationScript() {
        try {
            // eslint-disable-next-line no-eval
            const doesApply: any = eval(
                this.data.scripts.applicability + '; doesApply',
            );

            return (
                time: number,
                globals: GlobalsType,
                user: UserType,
                attributes: UserAttributesType,
            ): boolean => {
                try {
                    return !!doesApply(time, globals, user, attributes);
                } catch (error) {
                    console.error(`Matcher script error on invocation.`, error);
                    return false;
                }
            };
        } catch (error) {
            console.error(
                `Matcher Script Parse Error. ID = ${this.data.id}`,
                error,
            );

            return () => false;
        }
    }

    get genericScript() {
        if (!('generic' in this.data.scripts)) {
            return () => false;
        }

        try {
            // eslint-disable-next-line no-eval
            const genericDeal: any = eval(
                this.data.scripts.generic + '; genericDeal',
            );

            return (originalPrice: number): number | boolean => {
                try {
                    const dealPrice = genericDeal(originalPrice);

                    if (!(dealPrice > 0 || dealPrice <= 0)) {
                        return false;
                    }

                    return dealPrice;
                } catch (error) {
                    console.error(
                        `Generic script error on invocation. ID = ${this.data.id}`,
                        error,
                    );

                    return false;
                }
            };
        } catch (error) {
            console.error(
                `Generic Script Parse Error. ID = ${this.data.id}`,
                error,
            );

            return () => false;
        }
    }

    get calcScript() {
        if (!('calc' in this.data.scripts)) {
            return () => false;
        }

        try {
            // eslint-disable-next-line no-eval
            const calcDeal: any = eval(this.data.scripts.calc + '; calcDeal');

            return (
                originalPrice: number,
                genericDealPrice: number,
                cartable: SerializedCartable,
                globals: GlobalsType,
                user: UserType,
                attributes: UserAttributesType,
            ): string | number | boolean => {
                try {
                    const dealPrice = calcDeal(
                        originalPrice,
                        genericDealPrice,
                        cartable,
                        globals,
                        user,
                        attributes,
                    );

                    if (!(dealPrice > 0 || dealPrice <= 0)) {
                        return false;
                    }

                    return dealPrice;
                } catch (error) {
                    console.error(
                        `Calc script error on invocation. ID = ${this.data.id}`,
                        error,
                    );

                    return false;
                }
            };
        } catch (error) {
            console.error(
                `Calc Script Parse Error. ID = ${this.data.id}`,
                error,
            );

            return () => false;
        }
    }

    get isApplicable(): boolean {
        if (
            !this.parent.parent.app?.globals ||
            !this.parent.parent.user?.user ||
            !this.parent.parent.user?.userAttributes
        ) {
            return false;
        }

        return this.applicationScript(
            this.parent.time,
            this.parent.parent.app.globals,
            this.parent.parent.user.user,
            this.parent.parent.user.userAttributes,
        );
    }
}

export class DealStore {
    parent: Store;
    listener: (() => void) | null = null;
    time: number = Date.now();

    deals: {
        [id: string]: Deal;
    } = {};

    universalDeals: string[] = [];

    byItem: {
        [itemID: string]: string[];
    } = {};

    byCategory: {
        [categoryID: string]: string[];
    } = {};

    byRestaurant: {
        [restaurantID: string]: string[];
    } = {};

    constructor(parent: Store) {
        this.parent = parent;

        makeAutoObservable(this, {}, {autoBind: true});
    }

    tick() {
        this.time = Date.now();
    }

    upsert(id: string, data: DealType): void {
        this.deals[id] = new Deal(this, data);

        if (
            data.restaurants.length +
                data.categories.length +
                data.items.length <=
            0
        ) {
            this.universalDeals.push(id);
        }

        data.restaurants.forEach((restaurantID) => {
            if (!(restaurantID in this.byRestaurant)) {
                this.byRestaurant[restaurantID] = [];
            }

            this.byRestaurant[restaurantID].push(id);
        });

        data.categories.forEach((categoryID) => {
            if (!(categoryID in this.byCategory)) {
                this.byCategory[categoryID] = [];
            }

            this.byCategory[categoryID].push(id);
        });

        data.items.forEach((itemID) => {
            if (!(itemID in this.byItem)) {
                this.byItem[itemID] = [];
            }

            this.byItem[itemID].push(id);
        });
    }

    get universals() {
        return this.universalDeals.map((id) => this.deals[id]);
    }

    getForItem(itemID: string) {
        return (this.byItem[itemID] || []).map((id) => this.deals[id]);
    }

    getForCategory(categoryID: string) {
        return (this.byCategory[categoryID] || []).map((id) => this.deals[id]);
    }

    getForRestaurant(restaurantID: string) {
        return (this.byRestaurant[restaurantID] || []).map(
            (id) => this.deals[id],
        );
    }

    remove(id: string): void {
        delete this.deals[id];
    }

    listen(): void {
        this.listener = this.parent.firebase
            .firestore()
            .collection('deals')
            .onSnapshot((snap) => {
                snap.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        this.upsert(change.doc.id, <DealType>change.doc.data());
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

    get all(): Deal[] {
        return Object.values(this.deals).sort((a, b) => {
            return (
                (this.parent.app.globals?.dealOrder?.[a.data.id] || 0) -
                (this.parent.app.globals?.dealOrder?.[b.data.id] || 0)
            );
        });
    }

    get(id: string): Deal | null {
        return this.deals[id] || null;
    }
}
