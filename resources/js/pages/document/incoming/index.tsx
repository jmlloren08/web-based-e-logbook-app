import { Head, Link, usePage, router } from "@inertiajs/react";
import { BreadcrumbItem, IncomingDocument, PaginatedResults } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import Release from "./release";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, EyeIcon, FilePenLine, RotateCcw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Swal from "sweetalert2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incoming',
        href: route('incoming-documents.index'),
    },
];

type SortField = 'document_no' | 'other_ref_no' | 'date_time_received' | 'from_office_department_unit' | 'sender_name' | 'title_subject' | 'docs_types' | 'updated_at';
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

export default function Index({ documents }: { documents: PaginatedResults<IncomingDocument> }) {

    const { flash } = usePage().props as { flash?: { success?: string } };
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
            route('incoming-documents.index'),
            { search: debouncedSearchQuery, tab: activeTab },
            { preserveState: true, preserveScroll: true }
        );
    }, [debouncedSearchQuery, activeTab]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // No need to filter by tab anymore as it's handled by the server
    const sortedDocuments = [...documents.data].sort((a, b) => {
        const aValue = sortField === 'document_no' ? a.document_no :
            sortField === 'other_ref_no' ? a.incoming_document.other_ref_no :
                sortField === 'date_time_received' ? new Date(a.incoming_document.date_time_received).getTime() :
                    sortField === 'from_office_department_unit' ? a.incoming_document.from_office_department_unit :
                        sortField === 'sender_name' ? a.incoming_document.sender_name :
                            sortField === 'title_subject' ? a.title_subject :
                                sortField === 'updated_at' ? new Date(a.updated_at).getTime() :
                                    a.docs_types;

        const bValue = sortField === 'document_no' ? b.document_no :
            sortField === 'other_ref_no' ? b.incoming_document.other_ref_no :
                sortField === 'date_time_received' ? new Date(b.incoming_document.date_time_received).getTime() :
                    sortField === 'from_office_department_unit' ? b.incoming_document.from_office_department_unit :
                        sortField === 'sender_name' ? b.incoming_document.sender_name :
                            sortField === 'title_subject' ? b.title_subject :
                                sortField === 'updated_at' ? new Date(b.updated_at).getTime() :
                                    b.docs_types;

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
            <Head title="Incoming" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <Link href={route("incoming-documents.create")} className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto active:scale-95">Add New Document</Button>
                            </Link>
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
                                    <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('document_no')}>
                                        <div className="flex items-center gap-1">
                                            Document No.
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'document_no' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort('other_ref_no')}>
                                        <div className="flex items-center gap-1">
                                            Other Ref No
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'other_ref_no' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort('date_time_received')}>
                                        <div className="flex items-center gap-1">
                                            Date/Time Received
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'date_time_received' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell cursor-pointer" onClick={() => handleSort('from_office_department_unit')}>
                                        <div className="flex items-center gap-1">
                                            From Office/Department
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'from_office_department_unit' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('sender_name')}>
                                        <div className="flex items-center gap-1">
                                            Sender
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'sender_name' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSort('title_subject')}>
                                        <div className="flex items-center gap-1">
                                            Title/Subject
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'title_subject' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden sm:table-cell cursor-pointer" onClick={() => handleSort('docs_types')}>
                                        <div className="flex items-center gap-1">
                                            Docs/Types
                                            <ArrowUpDown className="h-4 w-4" />
                                            {sortField === 'docs_types' && (
                                                <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="hidden lg:table-cell">Instructions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedDocuments.map((doc) => (
                                    <TableRow key={doc.id} className="hover:bg-gray-50">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('incoming-documents.edit', doc.id)}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className='hover:text-blue-600 active:scale-95'
                                                        title={doc.current_state_id === 4 ? "Revise Document" : "Edit Document"}
                                                    >
                                                        {doc.current_state_id === 4 ? (
                                                            <RotateCcw />
                                                        ) : (
                                                            <FilePenLine />
                                                        )}
                                                    </Button>
                                                </Link>
                                                {doc.current_state_id !== 4 && (
                                                    <Release docId={doc.id} />
                                                )}
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
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">{doc.document_no}</TableCell>
                                        <TableCell className="hidden md:table-cell">{doc.incoming_document.other_ref_no}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {doc.incoming_document.date_time_received ? (
                                                new Intl.DateTimeFormat('en-US', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }).format(new Date(doc.incoming_document.date_time_received))
                                            ) : (
                                                "Invalid date"
                                            )}
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">{doc.incoming_document.from_office_department_unit}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{doc.incoming_document.sender_name}</div>
                                            <div className="text-sm text-gray-500 md:hidden">
                                                {doc.document_no} | {doc.incoming_document.date_time_received}
                                            </div>
                                        </TableCell>
                                        <TableCell>{doc.title_subject}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{doc.docs_types}</TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            {doc.incoming_document.instructions_action_requested}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {sortedDocuments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-4">
                                            No documents found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <Pagination>
                            <div className="flex items-center justify-between gap-4">
                                <PaginationContent className="flex justify-center items-center space-x-2">
                                    {documents.links.map((link: { url: string | null; active: boolean; label: string }, index: number) => (
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
