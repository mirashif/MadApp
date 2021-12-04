import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {AddressType, UnsavedAddressType} from './AddressStore';

export class AddressBuilder {
    parent: Store;

    address: string = '';
    location: {lat: number; lon: number} | null = null;
    directions: string = '';
    label: string = '';

    locationTouched: boolean = false;
    addressTouched: boolean = false;

    isAddressInferred: boolean = false;
    isAddressInferring: boolean = false;
    isLocationInferred: boolean = false;
    isLocationInferring: boolean = false;

    constructor(parent: Store, data: AddressType | {} = {}) {
        this.parent = parent;

        this.directions =
            'directions' in data && data.directions ? data?.directions : '';

        this.address = 'address' in data && data.address ? data?.address : '';

        this.label = 'label' in data && data.label ? data?.label : '';

        if ('lat' in data && data.lat && 'lon' in data && data.lon) {
            this.location =
                {
                    lat: data.lat,
                    lon: data.lon,
                } || null;

            this.locationTouched = true;
        }

        if ('address' in data && data.address) {
            this.addressTouched = true;
        }

        makeAutoObservable(this, {}, {autoBind: true});
    }

    setLocation(lon: number, lat: number) {
        this.location = {lon, lat};
        this.locationTouched = true;
    }

    setDirections(directions: string) {
        this.directions = directions;
    }

    setAddress(address: string) {
        this.address = address;
        this.addressTouched = true;
    }

    setLabel(label: string) {
        this.label = label;
    }

    *inferLocation() {
        this.isLocationInferring = true;

        try {
            // TODO
            this.isLocationInferred = true;
        } catch {
            this.isLocationInferred = false;
        } finally {
            this.isLocationInferring = false;
        }
    }

    *inferAddress() {
        this.isAddressInferring = true;

        try {
            // TODO
            this.isAddressInferred = true;
        } catch {
            this.isAddressInferred = false;
        } finally {
            this.isAddressInferring = false;
        }
    }

    get addressable(): UnsavedAddressType {
        return {
            address: this.address,
            directions: this.directions,
            lat: this.location?.lat || 0,
            lon: this.location?.lon || 0,
            label: this.label,
        };
    }
}
