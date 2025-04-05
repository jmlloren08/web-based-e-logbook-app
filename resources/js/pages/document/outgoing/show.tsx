import { Head, Link, router, usePage } from "@inertiajs/react";
import { BreadcrumbItem, Documents } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect, useState } from "react";
import DocumentTimeline from "@/pages/document/document-timeline";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Swal from "sweetalert2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Document',
        href: route('outgoing-documents.index'),
    },
];

interface User {
    name?: string;
    office_department_unit?: string;
    [key: string]: unknown;
}

interface HistoryEvent {
    id: number;
    state: string;
    comments: string;
    timestamp: string;
    user: User;
    is_current: boolean;
    metadata: Record<string, unknown>;
    revision_number: number;
}

// Document state mapping
const DOCUMENT_STATES = {
    1: { name: 'Draft', color: 'bg-gray-100 text-gray-800' },
    2: { name: 'Sent', color: 'bg-blue-100 text-blue-800' },
    3: { name: 'Received', color: 'bg-green-100 text-green-800' },
    4: { name: 'Returned', color: 'bg-red-100 text-red-800' },
    5: { name: 'Revised', color: 'bg-purple-100 text-purple-800' },
    6: { name: 'Finalized', color: 'bg-indigo-100 text-indigo-800' },
    7: { name: 'Archived', color: 'bg-yellow-100 text-yellow-800' },
};

export default function Show({ document, historyEvents }: {
    document: Documents & { current_state_id: number };
    historyEvents: HistoryEvent[]
}) {

    const { flash } = usePage().props as { flash?: { error?: string } };
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [showFinalizeModal, setShowFinalizeModal] = useState(false);
    const [returnReason, setReturnReason] = useState('');
    const [returnComments, setReturnComments] = useState('');
    const [finalizeComments, setFinalizeComments] = useState('');

    const handleReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Show loading state
        Swal.fire({
            title: 'Processing...',
            html: 'Please wait while we process your request',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        await router.post(route('document.return-for-revision', document.id), {
            comments: returnReason,
            return_reason: returnComments,
        }, {
            onSuccess: () => setShowReturnModal(false),
        });
    }

    const handleFinalizeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Show loading state
        Swal.fire({
            title: 'Processing...',
            html: 'Please wait while we process your request',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        await router.post(route('document.finalize-document', document.id), {
            comments: finalizeComments,
        }, {
            onSuccess: () => setShowFinalizeModal(false),
        });
    }

    // Get current document state
    const currentState = DOCUMENT_STATES[document.current_state_id as keyof typeof DOCUMENT_STATES] ||
        { name: 'Unknown', color: 'bg-gray-100 text-gray-800' };

    useEffect(() => {
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error
            });
        }
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Documents" />
            <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
                <div className="mb-6 flex justify-between items-center">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href={route('outgoing-documents.index')} className="flex items-center justify-center">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to list
                        </Link>
                    </Button>
                </div>

                <h1 className="text-2xl font-bold mb-6 text-center">Document Timeline</h1>

                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold">{document.title_subject}</h2>
                    <p className="text-gray-600">Document No: {document.document_no}</p>
                    <p className="text-gray-600">Document Type: {document.docs_types}</p>
                    <div className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${currentState.color}`}>
                        Status: {currentState.name}
                    </div>
                </div>

                {historyEvents?.length > 0 ? (
                    <div className="mt-8">
                        <h2 className="text-lg font-bold mb-4">Document Timeline</h2>
                        <DocumentTimeline historyEvents={historyEvents} />
                    </div>
                ) : (
                    <div className="mt-8 text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No timeline events available for this document.</p>
                    </div>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                    {/* Show Return for Revision button for documents in Sent or Received state */}
                    {(document.current_state_id === 2 || document.current_state_id === 3) && (
                        <Button
                            onClick={() => setShowReturnModal(true)}
                            variant="default"
                            className="hover:bg-yellow-600 active:scale-95"
                        >
                            Return for Revision
                        </Button>
                    )}

                    {/* Show Finalize Document button for documents in Received state */}
                    {document.current_state_id === 3 && (
                        <Button
                            onClick={() => setShowFinalizeModal(true)}
                            variant="default"
                            className="hover:bg-green-600 active:scale-95"
                        >
                            Finalize Document
                        </Button>
                    )}
                </div>

                {/* Return for Revision Dialog */}
                <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Return Document for Revision</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleReturnSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="return_reason">Return Reason</Label>
                                    <Select
                                        value={returnReason}
                                        onValueChange={setReturnReason}
                                        required
                                    >
                                        <SelectTrigger id="return_reason">
                                            <SelectValue placeholder="Select a reason" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Missing Information">Missing Information</SelectItem>
                                            <SelectItem value="Incorrect Information">Incorrect Information</SelectItem>
                                            <SelectItem value="Requires Clarification">Requires Clarification</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="comments">Comments</Label>
                                    <Textarea
                                        id="comments"
                                        value={returnComments}
                                        onChange={(e) => setReturnComments(e.target.value)}
                                        rows={4}
                                        required
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-yellow-500 text-white hover:bg-yellow-600">
                                    Return Document
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Finalize Document Dialog */}
                <Dialog open={showFinalizeModal} onOpenChange={setShowFinalizeModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Finalize Document</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleFinalizeSubmit}>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="finalize-comments">Comments (Optional)</Label>
                                    <Textarea
                                        id="finalize-comments"
                                        value={finalizeComments}
                                        onChange={(e) => setFinalizeComments(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-green-500 text-white hover:bg-green-600">
                                    Finalize Document
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}