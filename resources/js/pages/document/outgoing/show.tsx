import { Head, Link } from "@inertiajs/react";
import { BreadcrumbItem, Documents, IncomingDocument, OutgoingDocument } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show Document',
        href: route('outgoing-documents.index'),
    },
];
export default function Show({ document, incomingDocument, outgoingDocument }: { document: Documents; incomingDocument: IncomingDocument; outgoingDocument: OutgoingDocument }) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Show Documents" />
            <div className="max-w-full mx-auto p-6 bg-white shadow-lg rounded-lg">
                {/* Back Button - Improved Mobile Responsiveness */}
                <div className="mb-6 flex justify-between items-center">
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                        <Link href={route('outgoing-documents.index')} className="flex items-center justify-center">
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back to list
                        </Link>
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-6 text-center">Document Timeline</h1>

                Document Basic Information
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-semibold">{document.title_subject}</h2>
                    <p className="text-gray-600">Document No: {document.document_no}</p>
                    <p className="text-gray-600">Document Type: {document.docs_types}</p>
                </div>

                {/* Timeline Container */}
                <div className="relative border-l-4 border-blue-500 pl-6">
                    {/* Incoming Document Stage */}
                    {incomingDocument && (
                        <div className="mb-6 relative">
                            <div className="absolute -left-[13px] mt-1 w-6 h-6 bg-blue-500 rounded-full"></div>
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-blue-700">Incoming Document</h3>
                                <div className="space-y-2">
                                    <p><strong>Reference No:</strong> {incomingDocument.other_ref_no}</p>
                                    <p><strong>Date Time Received:</strong> {
                                        new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        }).format(new Date(incomingDocument.date_time_received))
                                    }</p>
                                    <p><strong>From:</strong> {incomingDocument.from_office_department_unit}</p>
                                    <p><strong>Sender:</strong> {incomingDocument.sender_name}</p>
                                    <p><strong>Instructions/Action:</strong> {incomingDocument.instructions_action_requested}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Outgoing Document Stage */}
                    {outgoingDocument && (
                        <div className="mb-6 relative">
                            <div className="absolute -left-[13px] mt-1 w-6 h-6 bg-green-500 rounded-full"></div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-green-700">Outgoing Document</h3>
                                <div className="space-y-2">
                                    <p><strong>Date Released:</strong> {new Date(outgoingDocument.date_released).toLocaleDateString()}</p>
                                    <p><strong>Forwarded To:</strong> {outgoingDocument.forwarded_to_office_department_unit}</p>
                                    <p><strong>Received By:</strong> {outgoingDocument.received_by}</p>
                                    <p><strong>Date Time Received:</strong> {
                                        new Intl.DateTimeFormat('en-US', {
                                            year: 'numeric',
                                            month: '2-digit',
                                            day: '2-digit',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        }).format(new Date(outgoingDocument.date_time_received))
                                    }</p>
                                    <p><strong>Remarks:</strong> {outgoingDocument.remarks}</p>

                                    {outgoingDocument.signature_path && (
                                        <div>
                                            <strong>Signature:</strong>
                                            <img
                                                src={`/public/public/${outgoingDocument.signature_path}`}
                                                alt="Signature"
                                                className="max-w-[200px] mt-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}