import { makeAutoObservable } from "mobx";

import type { AddressType, UnsavedAddress } from "./AddressStore";

import type { Store } from "./index";

export class AddressBuilder {
  parent: Store;

  address = "";
  location: { lat: number; lon: number } | null = null;
  directions = "";
  label = "";

  locationTouched = false;
  addressTouched = false;

  isAddressInferred = false;
  isAddressInferring = false;
  isLocationInferred = false;
  isLocationInferring = false;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(parent: Store, data: AddressType | {} = {}) {
    this.parent = parent;

    this.directions =
      "directions" in data && data.directions ? data?.directions : "";

    this.address = "address" in data && data.address ? data?.address : "";

    this.label = "label" in data && data.label ? data?.label : "";

    if ("lat" in data && data.lat && "lon" in data && data.lon) {
      this.location =
        {
          lat: data.lat,
          lon: data.lon,
        } || null;

      this.locationTouched = true;
    }

    if ("address" in data && data.address) {
      this.addressTouched = true;
    }

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setLocation(lon: number, lat: number) {
    this.location = { lon, lat };
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
    // TODO
  }

  *inferAddress() {
    // TODO
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
