import { Address } from "./address.model";

export class User {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    createdAt?: Date;
    address?: Address;
    favouriteFacility?: any;

    get fullName(): string {
        if (this.firstName && this.lastName) {
            return this.firstName + ' ' + this.lastName;
        }
        return '';
    }
}
