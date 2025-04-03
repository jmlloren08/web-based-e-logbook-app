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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Add Document',
        href: route('incoming-documents.create'),
    }
];

export default function Create() {

    const { data, setData, post, processing, errors } = useForm<IncomingDocument>({
        type: 'incoming',
        document_no: '',
        title_subject: '',
        docs_types: '',
        // Incoming fields
        other_ref_no: '',
        date_time_received: '',
        from_office_department_unit: '',
        sender_name: '',
        instructions_action_requested: '',
    });

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: flash.error
            });
        }
    }, [flash]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Add form fields to FormData
        const formData = new FormData();
        (Object.keys(data) as Array<keyof IncomingDocument>).forEach((key) => {
            const value = data[key];
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        post(route('incoming-documents.store'), {
            formData,
            onError: () => {
                console.log('Form submission errors: ', errors);
            }
        });
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Document" />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button - Improved Mobile Responsiveness */}
                    <div className="mb-6 flex justify-between items-center">
                        <Button variant="outline" asChild className="w-full sm:w-auto active:scale-95">
                            <Link href={route('incoming-documents.index')} className="flex items-center justify-center">
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
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
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
                                                <Input
                                                    id="docs_types"
                                                    value={data.docs_types}
                                                    onChange={(e) => setData('docs_types', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                                <InputError message={errors.docs_types} />
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
                                                    From Office/Department
                                                </Label>
                                                <Input
                                                    id="from_office_department_unit"
                                                    value={data.from_office_department_unit}
                                                    onChange={(e) => setData('from_office_department_unit', e.target.value)}
                                                    className="mt-1"
                                                    required
                                                />
                                                <InputError message={errors.from_office_department_unit} />
                                            </div>
                                            <div className="col-span-1">
                                                <Label htmlFor="sender_name" className="mb-2">
                                                    Sender Name
                                                </Label>
                                                <Input
                                                    id="sender_name"
                                                    value={data.sender_name}
                                                    onChange={(e) => setData('sender_name', e.target.value)}
                                                    className="mt-1"
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
                                        {processing ? (
                                            <span className="flex items-center justify-center">
                                                <svg
                                                    aria-hidden="true"
                                                    role="status"
                                                    className="inline mr-3 w-4 h-4 text-white animate-spin"
                                                    viewBox="0 0 100 101"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                        fill="#E5E7EB"
                                                    ></path>
                                                    <path
                                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                        fill="currentColor"
                                                    ></path>
                                                </svg>
                                                Please wait...
                                            </span>
                                        ) : ('Save')}
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