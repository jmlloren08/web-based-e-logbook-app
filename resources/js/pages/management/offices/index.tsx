import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { BreadcrumbItem, Offices, PaginatedResults } from "@/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { EyeIcon, PencilIcon, Search, Trash2Icon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useEffect, useState } from 'react';
import CreateOfficeDialog from '@/pages/management/offices/create';
import EditOfficeDialog from '@/pages/management/offices/edit';
import ShowOfficeDialog from '@/pages/management/offices/show';
import Swal from 'sweetalert2';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Offices',
        href: route('offices.index'),
    },
];

export default function OfficeIndex({ offices }: { offices: PaginatedResults<Offices> }) {

    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState<Offices | null>(null);
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

    const handleEditClick = (office: Offices) => {
        setSelectedOffice(office);
        setIsEditDialogOpen(true);
    }

    const handleShowClick = (office: Offices) => {
        setSelectedOffice(office);
        setIsShowDialogOpen(true);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        router.get(route('offices.index'), { search: e.target.value }, {
            preserveState: true,
            preserveScroll: true
        });
    }

    const handleDeleteClick = (office: Offices) => {
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
                router.delete(route('offices.destroy', office.id), {
                    preserveScroll: true,
                });
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Offices" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <Button
                                className="w-full sm:w-auto active:scale-95"
                                onClick={() => setIsCreateDialogOpen(true)}
                            >
                                Add New Office
                            </Button>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search offices..."
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
                                    <TableHead>Code</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {offices.data.map((office) => (
                                    <TableRow key={office.id}>
                                        <TableCell>{office.name}</TableCell>
                                        <TableCell>{office.code}</TableCell>
                                        <TableCell>{office.email}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${office.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {office.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShowClick(office)}
                                                >
                                                    <EyeIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(office)}
                                                >
                                                    <PencilIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(office)}
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
                                    {offices.links.map((link: { url: string | null; active: boolean; label: string }, index: number) => (
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
                                    Showing {offices.from || 0} to {offices.to || 0} of {offices.total || 0} entries
                                </div>
                            </div>
                        </Pagination>
                    </div>
                </div>
            </div>

            <CreateOfficeDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
            />

            {selectedOffice && (
                <>
                    <EditOfficeDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        office={selectedOffice}
                    />
                    <ShowOfficeDialog
                        open={isShowDialogOpen}
                        onOpenChange={setIsShowDialogOpen}
                        office={selectedOffice}
                    />
                </>
            )}
        </AppLayout>
    );
}
