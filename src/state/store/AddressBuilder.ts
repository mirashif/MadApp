import {makeAutoObservable} from 'mobx';
import {Store} from './index';
import {AddressType, UnsavedAddress} from './AddressStore';
import axios from 'axios';
import {config} from '../../config';
import {toGenerator} from '../helpers/toGenerator';

interface GeocoderResult {
    results: {
        types: string[];
        formatted_address: string;
        address_components: {
            short_name: string;
            long_name: string;
            postcode_localities: string[];
            types: string[];
        }[];
        partial_match: boolean;
        place_id: string;
        postcode_localities: string[];
        geometry: {
            location: {
                lat: number;
                lng: number;
            };
            location_type: string;
            viewport: any;
            bounds: any;
        };
    }[];
}

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
            const request = yield* toGenerator(
                axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        key: config.geocodingAPIKey,
                    },
                }),
            );

            const result: GeocoderResult = request.data;

            this.address = result.results
                .map((result) => result.formatted_address)
                .sort((a, b) => b.length - a.length)[0];

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
            const request = yield* toGenerator(
                axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                    params: {
                        key: config.geocodingAPIKey,
                    },
                }),
            );

            const result: GeocoderResult = request.data;

            this.location = result.results.map((result) => ({
                lat: result.geometry.location.lat,
                lon: result.geometry.location.lng,
            }))[0];

            this.isAddressInferred = true;
        } catch {
            this.isAddressInferred = false;
        } finally {
            this.isAddressInferring = false;
        }
    }

    get addressable(): UnsavedAddress {
        return {
            address: this.address,
            directions: this.directions,
            lat: this.location?.lat || 0,
            lon: this.location?.lon || 0,
            label: this.label,
        };
    }
}
