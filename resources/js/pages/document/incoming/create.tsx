import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { BreadcrumbItem, IncomingDocument } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { ArrowLeftIcon } from "lucide-react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { FormEventHandler } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Document',
        href: route('incoming-documents.create'),
    }
];

interface Props {
    offices: Array<{
        id: string;
        name: string;
        code: string;
    }>;
    documentTypes: Array<{
        id: string;
        name: string;
        code: string;
    }>;
}

export default function Create({ offices, documentTypes }: Props) {
    
    const { flash } = usePage().props as { flash?: { error?: string } };
    const { data, setData, post, processing, errors } = useForm<IncomingDocument>({
        type: 'incoming',
        document_no: '',
        title_subject: '',
        docs_types: '',
        other_ref_no: '',
        date_time_received: '',
        from_office_department_unit: '',
        sender_name: '',
        instructions_action_requested: '',
    });

    useEffect(() => {
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error
            });
        }
    }, [flash]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('incoming-documents.store'), {
            onSuccess: () => {
                // Handle success
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Document" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-6">
                        <Button variant="outline" asChild>
                            <Link href={route('incoming-documents.index')} className="flex items-center">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Back to list
                            </Link>
                        </Button>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                                New Document Entry
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Document Identification Section */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold mb-4">
                                        Document Identification
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="col-span-1">
                                            <Label htmlFor="document_no" className="mb-2">
                                                Document Code
                                            </Label>
                                            <Input
                                                id="document_no"
                                                value={data.document_no}
                                                onChange={(e) => setData('document_no', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            <InputError message={errors.document_no} />
                                        </div>

                                        <div className="col-span-1">
                                            <Label htmlFor="docs_types" className="mb-2">
                                                Document Type
                                            </Label>
                                            <Select
                                                value={data.docs_types}
                                                onValueChange={(value) => setData('docs_types', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Document Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {documentTypes.map((dt) => (
                                                        <SelectItem key={dt.id} value={dt.code}>
                                                            {dt.code}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.type} className="mt-2" />
                                        </div>

                                        <div className="col-span-1">
                                            <Label htmlFor="other_ref_no" className="mb-2">
                                                Other Reference No
                                            </Label>
                                            <Input
                                                id="other_ref_no"
                                                value={data.other_ref_no}
                                                onChange={(e) => setData('other_ref_no', e.target.value)}
                                                className="mt-1"
                                            />
                                            <InputError message={errors.other_ref_no} />
                                        </div>
                                    </div>
                                </div>

                                {/* Document Details Section */}
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                                        Document Details
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <Label htmlFor="title_subject" className="mb-2">
                                                Title/Subject
                                            </Label>
                                            <Input
                                                id="title_subject"
                                                value={data.title_subject}
                                                onChange={(e) => setData('title_subject', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            <InputError message={errors.title_subject} />
                                        </div>

                                        <div className="col-span-1">
                                            <Label htmlFor="date_time_received" className="mb-2">
                                                Date & Time Received
                                            </Label>
                                            <Input
                                                id="date_time_received"
                                                type="datetime-local"
                                                value={data.date_time_received}
                                                onChange={(e) => setData('date_time_received', e.target.value)}
                                                className="mt-1"
                                                required
                                            />
                                            <InputError message={errors.date_time_received} />
                                        </div>
                                    </div>
                                </div>

                                {/* Sender Information Section */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                                        Sender Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="col-span-1">
                                            <Label htmlFor="from_office_department_unit" className="mb-2">
                                                From Office/Department/Unit
                                            </Label>
                                            <Select
                                                value={data.from_office_department_unit}
                                                onValueChange={(value) => setData('from_office_department_unit', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Office/Department/Unit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {offices.map((office) => (
                                                        <SelectItem key={office.id} value={office.code}>
                                                            {office.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.from_office_department_unit} className="mt-2" />
                                        </div>

                                        <div className="col-span-1">
                                            <Label htmlFor="sender_name" className="mb-2">
                                                Sender Name
                                            </Label>
                                            <Input
                                                id="sender_name"
                                                value={data.sender_name}
                                                onChange={(e) => setData('sender_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.sender_name} />
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions Section */}
                                <div className="bg-white p-4 rounded-lg">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-4">
                                        Instructions
                                    </h3>
                                    <div>
                                        <Label htmlFor="instructions_action_requested" className="mb-2">
                                            Instructions/Action Requested
                                        </Label>
                                        <Textarea
                                            id="instructions_action_requested"
                                            value={data.instructions_action_requested}
                                            onChange={(e) => setData('instructions_action_requested', e.target.value)}
                                            className="mt-1"
                                            required
                                        />
                                        <InputError message={errors.instructions_action_requested} />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end mt-6">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className={cn(
                                            "w-full sm:w-auto px-6 py-2 rounded-md",
                                            processing
                                                ? "opacity-50 cursor-not-allowed"
                                                : "hover:bg-blue-600"
                                        )}
                                    >
                                        {processing ? 'Saving...' : 'Save Document'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}