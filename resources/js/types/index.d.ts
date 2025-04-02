import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface RFOs {
    id: number;
    document_no: string;
    origin_no: string;
    date_time_received_incoming: string;
    origin_office: string;
    sender: string;
    title_subject: string;
    doc_type: string;
    instruction_action_requested: string;
    date_released: string;
    forwarded_to_office_name: string;
    received_by: string;
    date_time_received_outgoing: string;
    remarks: string;
}

export interface Documents {
    id: string;
    document_no: string;
    title_subject: string;
    docs_types: string;
}

export interface IncomingDocument {
    id: string;
    type: string;
    document_no: string;
    title_subject: string;
    docs_types: string;
    incoming_document: {
        id: string;
        other_ref_no: string;
        date_time_received: string;
        from_office_department_unit: string;
        sender_name: string;
        instructions_action_requested: string;
    };
}

export interface OutgoingDocument {
    type: string;
    document_no: string;
    // Outgoing Document
    document_id: string;
    date_released: string;
    forwarded_to_office_department_unit: string;
    received_by: string;
    date_time_received: string;
    remarks: string;
    signature_path: File | string;
}

export type PaginatedResults<T> = {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}