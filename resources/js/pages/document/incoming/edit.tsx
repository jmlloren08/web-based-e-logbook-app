import { Head, Link, useForm } from "@inertiajs/react";
import { BreadcrumbItem, IncomingDocument } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon } from "lucide-react";
import InputError from "@/components/input-error";
import Swal from "sweetalert2";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Document',
        href: route('incoming-documents.index'),
    },
];

export default function Edit({ document }: { document: IncomingDocument }) {

    const { data, setData, put, post, processing, errors } = useForm({
        title_subject: document.title_subject,
        docs_types: document.docs_types,
        other_ref_no: document.incoming_document.other_ref_no,
        date_time_received: document.incoming_document.date_time_received,
        from_office_department_unit: document.incoming_document.from_office_department_unit,
        sender_name: document.incoming_document.sender_name,
        instructions_action_requested: document.incoming_document.instructions_action_requested,
        revision_comments: '',
        date_released: '',
        forwarded_to_office_department_unit: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
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
        if (document.current_state_id === 4) {
            post(route('document.submit-revision', document.id), { preserveScroll: true });
        } else {
            put(route('incoming-documents.update', document.id), { preserveScroll: true });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Incoming Document" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Back Button - Improved Mobile Responsiveness */}
                <div className="mb-6 flex justify-between items-center">
                    <Button variant="outline" asChild className="w-full sm:w-auto active:scale-95">
                        <Link href={route('incoming-documents.index')} className="flex items-center justify-center">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to list
                        </Link>
                    </Button>
                </div>
                <div className="bg-white shadow-md rounded-xl overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Revision */}
                            {document.current_state_id === 4 && (
                                <>
                                    <h3 className="text-lg font-medium mt-6 mb-3">Revision Details</h3>
                                    <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 mb-4">
                                        <p className="text-sm text-yellow-800">
                                            This document has been returned for revision. Please make the necessary changes and resubmit.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <Label>Revision Comments *</Label>
                                        <Textarea value={data.revision_comments} onChange={e => setData('revision_comments', e.target.value)} required />
                                    </div>

                                    <h3 className="text-lg font-medium mt-6 mb-3">Release Information</h3>
                                    <div className="mb-4">
                                        <Label>Date Released *</Label>
                                        <Input type="datetime-local" value={data.date_released} onChange={e => setData('date_released', e.target.value)} required />
                                    </div>

                                    <div className="mb-4">
                                        <Label>Forward To *</Label>
                                        <Input value={data.forwarded_to_office_department_unit} onChange={e => setData('forwarded_to_office_department_unit', e.target.value)} required />
                                    </div>
                                </>
                            )}
                            {/* Document Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Document No - Read Only */}
                                <div className="space-y-2">
                                    <Label htmlFor="document_no">Document No.</Label>
                                    <Input id="document_no" value={document.document_no} readOnly className="bg-gray-100" />
                                </div>
                                {/* Title/Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="title_subject">Title/Subject</Label>
                                    <Input id="title_subject" value={data.title_subject} onChange={e => setData('title_subject', e.target.value)} className={errors.title_subject ? 'border-red-500' : ''} />
                                    <InputError message={errors.title_subject} className="mt-1" />
                                </div>
                                {/* Document Types */}
                                <div className="space-y-2">
                                    <Label htmlFor="docs_types">Document Types</Label>
                                    <Input
                                        id="docs_types"
                                        value={data.docs_types}
                                        onChange={e => setData('docs_types', e.target.value)}
                                        className={errors.docs_types ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.docs_types} className="mt-1" />
                                </div>
                                {/* Other Ref No */}
                                <div className="space-y-2">
                                    <Label htmlFor="other_ref_no">Other Ref No</Label>
                                    <Input
                                        id="other_ref_no"
                                        value={data.other_ref_no}
                                        onChange={e => setData('other_ref_no', e.target.value)}
                                        className={errors.other_ref_no ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.other_ref_no} className="mt-1" />
                                </div>
                                {/* Date/Time Received */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_time_received">Date/Time Received</Label>
                                    <Input
                                        id="date_time_received"
                                        type="datetime-local"
                                        value={data.date_time_received}
                                        onChange={e => setData('date_time_received', e.target.value)}
                                        className={errors.date_time_received ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.date_time_received} className="mt-1" />
                                </div>
                                {/* From Office/Department */}
                                <div className="space-y-2">
                                    <Label htmlFor="from_office_department_unit">From Office/Department</Label>
                                    <Input
                                        id="from_office_department_unit"
                                        value={data.from_office_department_unit}
                                        onChange={e => setData('from_office_department_unit', e.target.value)}
                                        className={errors.from_office_department_unit ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.from_office_department_unit} className="mt-1" />
                                </div>
                                {/* Sender Name */}
                                <div className="space-y-2">
                                    <Label htmlFor="sender_name">Sender Name</Label>
                                    <Input
                                        id="sender_name"
                                        value={data.sender_name}
                                        onChange={e => setData('sender_name', e.target.value)}
                                        className={errors.sender_name ? 'border-red-500' : ''}
                                    />
                                    <InputError message={errors.sender_name} className="mt-1" />
                                </div>
                                {/* Instructions/Action Requested */}
                                <div className="space-y-2">
                                    <Label htmlFor="instructions_action_requested">Instructions/Action Requested</Label>
                                    <Textarea
                                        id="instructions_action_requested"
                                        value={data.instructions_action_requested}
                                        onChange={e => setData('instructions_action_requested', e.target.value)}
                                        className={errors.instructions_action_requested ? 'border-red-500' : ''}
                                        rows={4}
                                    />
                                    <InputError message={errors.instructions_action_requested} className="mt-1" />
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                                    <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Submit'}</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}