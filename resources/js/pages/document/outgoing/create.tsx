import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { cn } from '@/lib/utils';
import InputError from '@/components/input-error';
import { ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Receive Document',
        href: route('outgoing-documents.create'),
    },
];

export default function Create({ docId, documentNo, docTitleSubject }: { docId: string; documentNo: string; docTitleSubject: string }) {

    const signaturePadRef = useRef<SignatureCanvas | null>(null);
    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.error) {
            toast.error(flash.error, {
                action: {
                    label: 'Dismiss',
                    onClick: () => { }
                }
            });
        }
    }, [flash]);

    const { data, setData, processing, errors } = useForm({
        received_by: '',
        date_time_received: new Date().toISOString().slice(0, 16),
        remarks: '',
        signature_path: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('_method', 'PATCH');
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        // Handle signature if exists
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
            // Convert signature to blob
            const signatureData = signaturePadRef.current.toDataURL('image/png');
            const blobBin = atob(signatureData.split(',')[1]);
            const array = [];
            for (let i = 0; i < blobBin.length; i++) {
                array.push(blobBin.charCodeAt(i));
            }
            const file = new Blob([new Uint8Array(array)], { type: 'image/png' });
            // Create a file object
            const signatureFile = new File([file], 'signature.png', { type: 'image/png' });
            formData.append('signature_path', signatureFile);
            console.log('Signature File Appended:', signatureFile);
        }
        console.log("Form Data: ", formData);
        router.post(route('outgoing-documents.update', { id: docId }), formData);
    }

    const clearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Document Log" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="py-6">
                        <div className="max-w-full mx-auto sm:px-6 px-8">
                            <div className="mb-6 flex justify-between items-center">
                                <Button variant="outline" asChild>
                                    <Link href={route('outgoing-documents.index')}>
                                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                        Back to Logs
                                    </Link>
                                </Button>
                            </div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{documentNo}</CardTitle>
                                    <CardDescription>{docTitleSubject}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="received_by">Receive by</Label>
                                                <Input
                                                    id="received_by"
                                                    value={data.received_by}
                                                    onChange={(e) => setData('received_by', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.received_by} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="date_time_received">Date and Time Received</Label>
                                                <Input
                                                    id="date_time_received"
                                                    type="datetime-local"
                                                    value={data.date_time_received}
                                                    onChange={e => setData('date_time_received', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.date_time_received} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="signature">Signature (Optional)</Label>
                                                <div className="border border-gray-300 rounded-md">
                                                    <SignatureCanvas
                                                        ref={signaturePadRef}
                                                        canvasProps={{
                                                            className: 'w-full h-40',
                                                        }}
                                                    />
                                                </div>
                                                <div className="mt-2 flex justify-end">
                                                    <Button type="button" variant="outline" onClick={clearSignature}>
                                                        Clear Signature
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-4">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className={cn(processing ? "opacity-75 cursor-wait" : "")}
                                            >
                                                {processing ? (
                                                    <span className="flex items-center justify-center">
                                                        <svg aria-hidden="true" role="status" className="inline mr-3 w-4 h-4 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"></path>
                                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"></path>
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
                </div>
            </div>
        </AppLayout>
    );
}