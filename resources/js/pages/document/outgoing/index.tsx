import { Head, Link, usePage, router } from "@inertiajs/react";
import { BreadcrumbItem, OutgoingDocument, PaginatedResults } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useEffect, useState } from "react";
import Receive from "./receive";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, ArrowLeftIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Swal from "sweetalert2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Outgoing',
        href: route('outgoing-documents.index'),
    },
];

type SortField = 'document_no' | 'date_released' | 'forwarded_to_office_department_unit' | 'received_by' | 'date_time_received' | 'remarks' | 'updated_at';
type SortDirection = 'asc' | 'desc';

const officeTabs = [
    { value: 'all', label: 'All' },
    { value: 'odg', label: 'ODG' },
    { value: 'oddgo', label: 'ODDGO' },
    { value: 'oddgaf', label: 'ODDGAF' },
    { value: 'oddgl', label: 'ODDGL' },
    { value: 'rfo', label: 'RFO' },
    { value: 'cmeo', label: 'CMEO' },
    { value: 'bro', label: 'BRO' },
    { value: 'dbd', label: 'DBD' },
    { value: 'rmtd', label: 'RMTD' },
    { value: 'sulong', label: 'SULONG' },
    { value: 'admin', label: 'ADMIN' },
    { value: 'finance', label: 'FINANCE' },
];

export default function Index({ documents }: { documents: PaginatedResults<OutgoingDocument> }) {

    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [searchQuery, setSearchQuery] = useState('');
    const [sortField, setSortField] = useState<SortField>('updated_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [activeTab, setActiveTab] = useState('all');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success
            });
        } else if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error
            });
        }
    }, [flash]);

    // Debounce search query to avoid too many requests
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Trigger search when debounced query changes
    useEffect(() => {
        router.get(
            route('outgoing-documents.index'),
            { search: debouncedSearchQuery },
            { preserveState: true, preserveScroll: true }
        );
    }, [debouncedSearchQuery]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Filter by tab only (search is now handled by the server)
    const filteredDocuments = documents.data.filter(doc => {
        const matchesTab = activeTab === 'all' ||
            doc.document_no.toLowerCase().includes(activeTab.toLowerCase());
        return matchesTab;
    });

    const sortedDocuments = [...filteredDocuments].sort((a, b) => {
        const aValue = sortField === 'document_no' ? a.document_no :
            sortField === 'date_released' ? new Date(a.outgoing_document.date_released).getTime() :
                sortField === 'forwarded_to_office_department_unit' ? a.outgoing_document.forwarded_to_office_department_unit :
                    sortField === 'received_by' ? (a.outgoing_document.received_by || '') :
                        sortField === 'date_time_received' ? (a.outgoing_document.date_time_received ? new Date(a.outgoing_document.date_time_received).getTime() : 0) :
                            sortField === 'updated_at' ? new Date(a.updated_at).getTime() :
                                (a.remarks || '');

        const bValue = sortField === 'document_no' ? b.document_no :
            sortField === 'date_released' ? new Date(b.outgoing_document.date_released).getTime() :
                sortField === 'forwarded_to_office_department_unit' ? b.outgoing_document.forwarded_to_office_department_unit :
                    sortField === 'received_by' ? (b.outgoing_document.received_by || '') :
                        sortField === 'date_time_received' ? (b.outgoing_document.date_time_received ? new Date(b.outgoing_document.date_time_received).getTime() : 0) :
                            sortField === 'updated_at' ? new Date(b.updated_at).getTime() :
                                (b.remarks || '');

        if (typeof aValue === 'string') {
            return sortDirection === 'asc'
                ? aValue.localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue);
        } else {
            return sortDirection === 'asc'
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
        }
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Outgoing" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <Button variant="outline" asChild className="w-full sm:w-auto active:scale-95">
                                <Link href={route('incoming-documents.index')} className="flex items-center justify-center">
                                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                    Back to list
                                </Link>
                            </Button>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search documents..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                        <div className="border-b border-gray-200">
                            <TabsList className="w-full justify-start overflow-x-auto">
                                {officeTabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.value}
                                        value={tab.value}
                                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                                    >
                                        {tab.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </Tabs>

                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead className="hidden sm:table-cell cursor-pointer" onClick={() => handleSort('document_no')}>
                                        <div className="flex items-center gap-1">
                                            Document No.
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'document_no' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('date_released')}>
                                        <div className="flex items-center gap-1">
                                            Date Release
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'date_released' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort('forwarded_to_office_department_unit')}>
                                        <div className="flex items-center gap-1">
                                            Forwarded to Office/Department
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'forwarded_to_office_department_unit' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('received_by')}>
                                        <div className="flex items-center gap-1">
                                            Received By
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'received_by' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell cursor-pointer" onClick={() => handleSort('date_time_received')}>
                                        <div className="flex items-center gap-1">
                                            Date/Time Received
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'date_time_received' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">Remarks</TableHead>
                                    <TableHead className="hidden lg:table-cell">Signature</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedDocuments.map((doc) => (
                                    <TableRow key={doc.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {!doc.outgoing_document.received_by ? (
                                                    <Receive
                                                        docId={doc.id}
                                                        documentNo={doc.document_no}
                                                        docTitleSubject={doc.title_subject}
                                                    />
                                                ) : (
                                                    <Link href={route('outgoing-documents.show', { id: doc.id })}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className='hover:text-blue-600 active:scale-95'
                                                            title='View Document'
                                                        >
                                                            <EyeIcon />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {doc.document_no}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            {new Date(doc.outgoing_document.date_released).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {doc.outgoing_document.forwarded_to_office_department_unit}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{doc.outgoing_document.received_by || 'Not Yet Received'}</div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                {new Date(doc.outgoing_document.date_released).toLocaleDateString()} | {doc.outgoing_document.remarks}
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            {doc.outgoing_document.date_time_received
                                                ? new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }).format(new Date(doc.outgoing_document.date_time_received))
                                                : 'Pending'}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{doc.outgoing_document.remarks}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {doc.outgoing_document.signature_path ? (
                                                <img
                                                    src={`/storage/${doc.outgoing_document.signature_path}`}
                                                    className="h-8 w-auto object-contain"
                                                    alt="Signature"
                                                />
                                            ) : (
                                                <span className="text-gray-400">No Signature Yet</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sortedDocuments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-4">
                                            No outgoing documents found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <Pagination>
                            <div className="flex items-center justify-between gap-4">
                                <PaginationContent>
                                    {documents.links.map((link: { url: string; label: string; active: boolean }, index: number) => (
                                        <PaginationItem key={index}>
                                            {link.url ? (
                                                <Link
                                                    href={link.url}
                                                    preserveState
                                                    preserveScroll
                                                    className={`${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                                                        } px-3 py-2 rounded-md inline-flex items-center justify-center`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                link.label.includes('Previous') ? (
                                                    <PaginationPrevious disabled className="opacity-50 cursor-not-allowed" />
                                                ) : (
                                                    <PaginationNext disabled className="opacity-50 cursor-not-allowed" />
                                                )
                                            )}
                                        </PaginationItem>
                                    ))}
                                </PaginationContent>
                                <div className="text-sm text-gray-500">
                                    Showing {documents.from || 0} to {documents.to || 0} of {documents.total || 0} entries
                                </div>
                            </div>
                        </Pagination>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}