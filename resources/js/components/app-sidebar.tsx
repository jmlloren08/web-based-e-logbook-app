import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, FileInput, FileOutput, Warehouse, Archive } from 'lucide-react';
import AppLogo from './app-logo';
import { NavDocument } from './nav-document';
import { NavOffice } from './nav-office';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        icon: LayoutGrid,
    },
];

const documentNavItems: NavItem[] = [
    {
        title: 'Incoming Documents',
        href: route('incoming-documents.index'),
        icon: FileInput,
    },
    {
        title: 'Outgoing Documents',
        href: route('outgoing-documents.index'),
        icon: FileOutput,
    },
    {
        title: 'Archive',
        href: route('archives.index'),
        icon: Archive,
    }
];

const officeNavItems: NavItem[] = [
    {
        title: 'ODG',
        href: '#',
        icon: Warehouse,
    },
    {
        title: 'BRO',
        href: '#',
        icon: Warehouse,
    },
    {
        title: 'CMEO',
        href: '#',
        icon: Warehouse,
    },
    {
        title: 'RFO',
        href: '#',
        icon: Warehouse,
    },
    {
        title: 'Admin',
        href: '#',
        icon: Warehouse,
    },
    {
        title: 'Finance',
        href: '#',
        icon: Warehouse,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavDocument items={documentNavItems} />
                <NavOffice items={officeNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
