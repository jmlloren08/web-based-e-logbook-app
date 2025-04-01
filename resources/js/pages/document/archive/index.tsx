import { Head, Link, usePage } from "@inertiajs/react";
import { Archives, BreadcrumbItem, PaginatedResults } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Search, ArrowUpDown, EditIcon, Badge } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Archive',
    href: route('archives.index'),
  },
];

type SortField = 'document_no' | 'title_subject' | 'origin_office' | 'date_time_received_incoming' | 'doc_type' | 'sender';
type SortDirection = 'asc' | 'desc';

export default function Index({ archives }: { archives: PaginatedResults<Archives> }) {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('document_no');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success, {
        action: {
          label: 'Dismiss',
          onClick: () => { }
        }
      });
    }
  }, [flash]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredArchives = archives.data.filter(archive => {
    const searchLower = searchQuery.toLowerCase();
    return (
      archive.document_no.toLowerCase().includes(searchLower) ||
      archive.title_subject.toLowerCase().includes(searchLower) ||
      archive.origin_office.toLowerCase().includes(searchLower) ||
      archive.sender.toLowerCase().includes(searchLower) ||
      archive.doc_type.toLowerCase().includes(searchLower)
    );
  });

  const sortedArchives = [...filteredArchives].sort((a, b) => {
    const aValue = sortField === 'document_no' ? a.document_no :
      sortField === 'title_subject' ? a.title_subject :
        sortField === 'origin_office' ? a.origin_office :
          sortField === 'date_time_received_incoming' ? new Date(a.date_time_received_incoming).getTime() :
            sortField === 'doc_type' ? a.doc_type :
              a.sender;

    const bValue = sortField === 'document_no' ? b.document_no :
      sortField === 'title_subject' ? b.title_subject :
        sortField === 'origin_office' ? b.origin_office :
          sortField === 'date_time_received_incoming' ? new Date(b.date_time_received_incoming).getTime() :
            sortField === 'doc_type' ? b.doc_type :
              b.sender;

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
      <Head title="Archive" />
      <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search archives..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('document_no')}>
                    <div className="flex items-center gap-1">
                      Document No.
                      <ArrowUpDown className="h-4 w-4" />
                      {sortField === 'document_no' && (
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('origin_office')}>
                    <div className="flex items-center gap-1">
                      Origin Office
                      <ArrowUpDown className="h-4 w-4" />
                      {sortField === 'origin_office' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('date_time_received_incoming')}>
                    <div className="flex items-center gap-1">
                      Date Received
                      <ArrowUpDown className="h-4 w-4" />
                      {sortField === 'date_time_received_incoming' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('doc_type')}>
                    <div className="flex items-center gap-1">
                      Document Type
                      <ArrowUpDown className="h-4 w-4" />
                      {sortField === 'doc_type' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('sender')}>
                    <div className="flex items-center gap-1">
                      Sender
                      <ArrowUpDown className="h-4 w-4" />
                      {sortField === 'sender' && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedArchives.map((archive) => (
                  <TableRow key={archive.id} className="hover:bg-gray-50">
                    <TableCell>{archive.document_no}</TableCell>
                    <TableCell>{archive.title_subject}</TableCell>
                    <TableCell>{archive.origin_office}</TableCell>
                    <TableCell>
                      {archive.date_time_received_incoming ? (
                        new Intl.DateTimeFormat('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).format(new Date(archive.date_time_received_incoming))
                      ) : (
                        "Invalid date"
                      )}
                    </TableCell>
                    <TableCell>{archive.doc_type}</TableCell>
                    <TableCell>{archive.sender}</TableCell>
                    <TableCell>{archive.remarks}</TableCell>
                  </TableRow>
                ))}
                {sortedArchives.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No archives found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Pagination>
              <PaginationContent className="flex justify-center items-center space-x-2">
                {archives.links.map((link: { url: string | null; active: boolean; label: string }, index: number) => (
                  <PaginationItem key={index}>
                    {link.url ? (
                      <PaginationLink
                        href={link.url}
                        isActive={link.active}
                        className={`${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-gray-100'
                          } px-3 py-2 rounded-md`}
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
            </Pagination>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 