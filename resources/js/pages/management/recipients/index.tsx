import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, PaginatedResults, Recipients } from "@/types";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { EyeIcon, PencilIcon, Search, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import CreateRecipientDialog from "./create";
import EditRecipientDialog from "./edit";
import ShowRecipientDialog from "./show";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Recipients',
        href: route('recipients.index'),
    },
];

export default function RecipientsIndex({ recipients }: { recipients: PaginatedResults<Recipients> }) {

    const { flash } = usePage().props as { flash?: { success?: string; error?: string } };
    const [isCreateDialogROpen, setIsCreateDialogROpen] = useState(false);
    const [isEditDialogROpen, setIsEditDialogROpen] = useState(false);
    const [isShowDialogROpen, setIsShowDialogROpen] = useState(false);
    const [selectedRecipient, setSelectedRecipient] = useState<Recipients | null>(null);
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

    const handleEditClick = (recipient: Recipients) => {
        setSelectedRecipient(recipient);
        setIsEditDialogROpen(true);
    }

    const handleShowClick = (recipient: Recipients) => {
        setSelectedRecipient(recipient);
        setIsShowDialogROpen(true);
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        router.get(route('recipients.index'), { search: e.target.value }, {
            preserveState: true,
            preserveScroll: true
        });
    }

    const handleDeleteClick = (recipient: Recipients) => {
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
                router.delete(route('recipients.destroy', recipient.id), {
                    preserveScroll: true,
                });
            }
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Recipients" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
                            <Button
                                className="w-full sm:w-auto active:scale-95"
                                onClick={() => setIsCreateDialogROpen(true)}
                            >
                                Add New Recipient
                            </Button>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <Input
                                    placeholder="Search recipients..."
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
                                    <TableHead>Office</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recipients.data.map((recipient) => (
                                    <TableRow key={recipient.id}>
                                        <TableCell>{recipient.name}</TableCell>
                                        <TableCell>{recipient.code}</TableCell>
                                        <TableCell>{recipient.offices.code}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${recipient.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {recipient.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShowClick(recipient)}
                                                >
                                                    <EyeIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditClick(recipient)}
                                                >
                                                    <PencilIcon />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(recipient)}
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
                                    {recipients.links.map((link: { url: string | null; active: boolean; label: string }, index: number) => (
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
                                    Showing {recipients.from || 0} to {recipients.to || 0} of {recipients.total || 0} entries
                                </div>
                            </div>
                        </Pagination>
                    </div>
                </div>
            </div>

            <CreateRecipientDialog
                open={isCreateDialogROpen}
                onOpenChange={setIsCreateDialogROpen}
            />

            {selectedRecipient && (
                <>
                    <EditRecipientDialog
                        open={isEditDialogROpen}
                        onOpenChange={setIsEditDialogROpen}
                        recipient={selectedRecipient}
                    />
                    <ShowRecipientDialog
                        open={isShowDialogROpen}
                        onOpenChange={setIsShowDialogROpen}
                        recipient={selectedRecipient}
                    />
                </>
            )}
        </AppLayout>
    );
}