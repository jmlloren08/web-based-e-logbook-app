import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, FileInput, FileOutput, ArchiveIcon, Archive, Building, SquareUserRound, MessageSquareText } from 'lucide-react';
import AppLogo from './app-logo';
import { NavDocument } from './nav-document';
import { NavOffice } from './nav-office';
import { ScrollArea } from './ui/scroll-area';
import { Manage } from './nav-manage';

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
];

const officeNavItems: NavItem[] = [
    {
        title: 'ODG',
        href: route('document.archive.odg.index'),
        icon: Archive,
    },
    {
        title: 'ODDGO',
        href: route('document.archive.oddgo.index'),
        icon: Archive,
    },
    {
        title: 'ODDGL',
        href: route('document.archive.oddgl.index'),
        icon: Archive,
    },
    {
        title: 'ODDGAF',
        href: route('document.archive.oddgaf.index'),
        icon: Archive,
    },
    {
        title: 'BRO',
        href: route('document.archive.bro.index'),
        icon: ArchiveIcon,
    },
    {
        title: 'CMEO',
        href: route('document.archive.cmeo.index'),
        icon: ArchiveIcon,
    },
    {
        title: 'RFO',
        href: route('document.archive.rfo.index'),
        icon: ArchiveIcon,
    },
    {
        title: 'Admin',
        href: route('document.archive.admin.index'),
        icon: ArchiveIcon,
    },
    {
        title: 'Finance',
        href: route('document.archive.finance.index'),
        icon: ArchiveIcon,
    },
];

const manageNavItems: NavItem[] = [
    {
        title: 'Offices',
        href: '#',
        icon: Building,
    },
    {
        title: 'Recipients',
        href: '#',
        icon: SquareUserRound,
    },
    {
        title: 'Remarks',
        href: '#',
        icon: MessageSquareText,
    }
]

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
                <ScrollArea>
                    <NavMain items={mainNavItems} />
                    <NavDocument items={documentNavItems} />
                    <NavOffice items={officeNavItems} />
                    <Manage items={manageNavItems} />
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
