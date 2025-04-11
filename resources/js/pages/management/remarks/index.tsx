import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PaginatedResults, Remarks } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { EyeIcon, PencilIcon, Search, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CreateRemarksDialog from "./create";
import EditRemarksDialog from "./edit";
import ShowRemarksDialog from "./show";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Remarks',
        href: route('remarks.index'),
    },
];

export default function RemarksIndex({ remarks }: { remarks: PaginatedResults<Remarks> }) {

    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [isCreateRemarksDialogOpen, setIsCreateRemarksDialogOpen] = useState(false);
    const [isEditRemarksDialogOpen, setIsEditRemarksDialogOpen] = useState(false);
    const [isShowRemarksDialogOpen, setIsShowRemarksDialogOpen] = useState(false);
    const [selectedRemarks, setSelectedRemarks] = useState<Remarks | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: flash.success,
            });
        }
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error,
            });
        }
    }, [flash]);

    const handleEditClick = (remark: Remarks) => {
        setSelectedRemarks(remark);
        setIsEditRemarksDialogOpen(true);
    }

    const handleShowClick = (remark: Remarks) => {
        setSelectedRemarks(remark);
        setIsShowRemarksDialogOpen(true);
    }

    const handleDeleteClick = (remark: Remarks) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('remarks.destroy', remark.id), {
                    preserveScroll: true,
                });
            }
        });
    }
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        router.get(route('remarks.index'), { search: e.target.value }, {
            preserveState: true,
            preserveScroll: true
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Remarks" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <Button
                                className="w-full sm:w-auto active:scale-95"
                                onClick={() => setIsCreateRemarksDialogOpen(true)}
                            >
                                Add New Remarks
                            </Button>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search Remarks..."
                                    className="pl-8"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {remarks.data.map((remark) => (
                                    <TableRow key={remark.id}>
                                        <TableCell>{remark.name}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${remark.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {remark.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShowClick(remark)}
                                                >
                                                    <EyeIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(remark)}
                                                >
                                                    <PencilIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(remark)}
                                                >
                                                    <Trash2Icon />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <Pagination>
                            <div className="flex items-center justify-between gap-4">
                                <PaginationContent className="flex justify-center items-center space-x-2">
                                    {remarks.links.map((link: { url: string | null; active: boolean; label: string }, index: number) => (
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
                                    Showing {remarks.from || 0} to {remarks.to || 0} of {remarks.total || 0} entries
                                </div>
                            </div>
                        </Pagination>
                    </div>
                </div>
            </div>

            <CreateRemarksDialog
                open={isCreateRemarksDialogOpen}
                onOpenChange={setIsCreateRemarksDialogOpen}
            />

            {selectedRemarks && (
                <>
                    <EditRemarksDialog
                        open={isEditRemarksDialogOpen}
                        onOpenChange={setIsEditRemarksDialogOpen}
                        remark={selectedRemarks}
                    />
                    <ShowRemarksDialog
                        open={isShowRemarksDialogOpen}
                        onOpenChange={setIsShowRemarksDialogOpen}
                        remark={selectedRemarks}
                    />
                </>
            )}
        </AppLayout>
    );
}