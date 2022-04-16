import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {AddressType, UnsavedAddressType} from './AddressStore';
import {profile} from '../helpers/profile';

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
        const _p = profile('AddressBuilder.setLocation');

        this.location = {lon, lat};
        this.locationTouched = true;

        _p();
    }

    setDirections(directions: string) {
        const _p = profile('AddressBuilder.setDirections');

        this.directions = directions;

        _p();
    }

    setAddress(address: string) {
        const _p = profile('AddressBuilder.setAddress');

        this.address = address;
        this.addressTouched = true;

        _p();
    }

    setLabel(label: string) {
        const _p = profile('AddressBuilder.setLabel');

        this.label = label;

        _p();
    }

    *inferLocation() {
        const _p = profile('AddressBuilder.inferLocation');

        this.isLocationInferring = true;

        try {
            // TODO
            this.isLocationInferred = true;
        } catch {
            this.isLocationInferred = false;
        } finally {
            this.isLocationInferring = false;
        }

        _p();
    }

    *inferAddress() {
        const _p = profile('AddressBuilder.inferAddress');

        this.isAddressInferring = true;

        try {
            // TODO
            this.isAddressInferred = true;
        } catch {
            this.isAddressInferred = false;
        } finally {
            this.isAddressInferring = false;
        }

        _p();
    }

    get addressable(): UnsavedAddressType {
        const _p = profile('AddressBuilder.addressable');

        return _p({
            address: this.address,
            directions: this.directions,
            lat: this.location?.lat || 0,
            lon: this.location?.lon || 0,
            label: this.label,
        });
    }
}
