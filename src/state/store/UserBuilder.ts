import { makeAutoObservable } from "mobx";

import type { UserType } from "./UserStore";

import type { Store } from "./index";

export class UserBuilder {
  parent: Store;

  firstName = "";
  lastName = "";
  dob = "";
  email = "";
  phone = "";

  constructor(parent: Store, data: UserType) {
    this.parent = parent;

    this.firstName = data.firstName || "";
    this.lastName = data.lastName || "";
    this.dob = data.dob || "";
    this.email = data.email || "";
    this.phone = data.phone || "";

    makeAutoObservable(this, {}, { autoBind: true });
  }

  setFirstName(name: string) {
    this.firstName = name.replace(/[^A-Za-z.\-']/g, "");
  }

  setLastName(name: string) {
    this.lastName = name.replace(/[^A-Za-z.\-']/g, "");
  }

  setEmail(email: string) {
    this.email = email;
  }

  setDob(year: number | string, month: number | string, date: number | string) {
    const y = `${year}`.padStart(2, "0");
    const m = `${month}`.padStart(2, "0");
    const d = `${date}`.padStart(2, "0");

    this.dob = `${y}-${m}-${d}`;
  }

  get userable() {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      dob: this.dob,
      email: this.email,
      phone: this.phone,
    };
  }
}
