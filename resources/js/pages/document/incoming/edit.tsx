import { Head, Link, useForm } from "@inertiajs/react";
import { BreadcrumbItem, IncomingDocument } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Edit Document',
        href: route('incoming-documents.index'),
    },
];

export default function Edit({ document }: { document: IncomingDocument }) {
    const { data, setData, put, processing, errors } = useForm({
        document_no: document.document.document_no,
        title_subject: document.document.title_subject,
        docs_types: document.document.docs_types,
        other_ref_no: document.other_ref_no,
        date_time_received: document.date_time_received,
        from_office_department_unit: document.from_office_department_unit,
        sender_name: document.sender_name,
        instructions_action_requested: document.instructions_action_requested,
    });

    useEffect(() => {
        if (errors) {
            toast.error("Please check the form for errors", {
                action: {
                    label: 'Dismiss',
                    onClick: () => { }
                }
            });
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('incoming-documents.update', document.id), {
            onSuccess: () => {
                toast.success("Document updated successfully", {
                    action: {
                        label: 'Dismiss',
                        onClick: () => { }
                    }
                });
            },
        });
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Document No */}
                                <div className="space-y-2">
                                    <Label htmlFor="document_no">Document No.</Label>
                                    <Input
                                        id="document_no"
                                        value={data.document_no}
                                        onChange={e => setData('document_no', e.target.value)}
                                        className={errors.document_no ? 'border-red-500' : ''}
                                    />
                                    {errors.document_no && (
                                        <p className="text-sm text-red-500">{errors.document_no}</p>
                                    )}
                                </div>

                                {/* Title/Subject */}
                                <div className="space-y-2">
                                    <Label htmlFor="title_subject">Title/Subject</Label>
                                    <Input
                                        id="title_subject"
                                        value={data.title_subject}
                                        onChange={e => setData('title_subject', e.target.value)}
                                        className={errors.title_subject ? 'border-red-500' : ''}
                                    />
                                    {errors.title_subject && (
                                        <p className="text-sm text-red-500">{errors.title_subject}</p>
                                    )}
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
                                    {errors.docs_types && (
                                        <p className="text-sm text-red-500">{errors.docs_types}</p>
                                    )}
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
                                    {errors.other_ref_no && (
                                        <p className="text-sm text-red-500">{errors.other_ref_no}</p>
                                    )}
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
                                    {errors.date_time_received && (
                                        <p className="text-sm text-red-500">{errors.date_time_received}</p>
                                    )}
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
                                    {errors.from_office_department_unit && (
                                        <p className="text-sm text-red-500">{errors.from_office_department_unit}</p>
                                    )}
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
                                    {errors.sender_name && (
                                        <p className="text-sm text-red-500">{errors.sender_name}</p>
                                    )}
                                </div>
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
                                {errors.instructions_action_requested && (
                                    <p className="text-sm text-red-500">{errors.instructions_action_requested}</p>
                                )}
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => window.history.back()}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? 'Updating...' : 'Update Document'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 