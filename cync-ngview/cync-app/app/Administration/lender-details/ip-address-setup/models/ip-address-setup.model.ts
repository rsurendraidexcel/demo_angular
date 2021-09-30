export interface ListIPAddressSetup {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    show_support_ips: boolean;
    support_ips: IPAddressRecord[];
    ip_whitelists: IPAddressSetup[];
}

export interface IPAddressSetup {
    id: number;
    name: string;
    description: string;
    ip_type: string;
    active: boolean;
    status?: string;
}

export class IPAddressRequestOrResponse {
    ip_whitelist: IPAddressRecord;
    constructor() { }
}

export interface IPAddressRecord {
    id?: number;
    name: string;
    description: string;
    ip_type: string;
    active: boolean;
    ip_ranges: IPAddressType[];
}

export interface IPAddressType {
    id?: number;
    name?: string;
    fixed_ip?: string;
    description?: string;
    range_from?: string;
    range_to?: string;
    _destroy?: boolean;
}

export interface IPTypeList {
    ip_types: Dropdown[];
}

export interface Dropdown {
	column_value: string;
	column_display: string;
}