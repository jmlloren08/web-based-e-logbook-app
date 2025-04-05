import { router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import SignatureCanvas from 'react-signature-canvas';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FileOutput } from 'lucide-react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

export default function Receive({ docId, documentNo, docTitleSubject }: { docId: string; documentNo: string; docTitleSubject: string }) {

    const [open, setOpen] = useState(false);
    const signaturePadRef = useRef<SignatureCanvas | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    // 
    const { data, setData, processing, errors } = useForm({
        received_by: '',
        date_time_received: '',
        remarks: '',
        signature_path: '',
    });
    // Ensure canvas clears when dialog opens
    useEffect(() => {
        if (open && signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    }, [open]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen && signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    }

    const handleSubmit = async () => {
        // Reset validation errors
        setValidationErrors({});
        // Validate required fields
        const newErrors: Record<string, string> = {};
        if (!data.received_by) {
            newErrors.received_by = 'Received By is required';
        }
        if (signaturePadRef.current?.isEmpty()) {
            newErrors.signature = 'Signature is required';
        }
        if (!data.date_time_received) {
            newErrors.date_time_received = 'Date Time Received is required';
        }
        // If there are validation errors, display them and return
        if (Object.keys(newErrors).length > 0) {
            setValidationErrors(newErrors);
            return;
        }
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
        // Add form fields to FormData
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
        }
        await router.post(route('outgoing-documents.update', { id: docId }), formData, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                Swal.close();
                setOpen(false);
            },
            onError: () => {
                Swal.close();
                console.log('Form submission errors: ', errors);
            }
        });
    }

    const clearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="default"
                    size="sm"
                    className='hover:bg-blue-600 active:scale-95'
                    title='Receive Document'
                >
                    <FileOutput />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='sm:max-w-[600px] max-h-[90vh] overflow-y-auto'>
                <AlertDialogHeader className='mb-4'>
                    <AlertDialogTitle className='text-xl font-bold text-gray-800'>{documentNo}</AlertDialogTitle>
                    <AlertDialogDescription className='text-sm text-muted-foreground'>
                        {docTitleSubject}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        {/* Receiver Details */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-base font-semibold text-gray-700 mb-3">
                                Receiver Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="received_by" className="mb-2">
                                        Received By
                                    </Label>
                                    <Input
                                        id="received_by"
                                        value={data.received_by}
                                        onChange={(e) => setData('received_by', e.target.value)}
                                        placeholder="Enter name"
                                        required
                                    />
                                    <InputError message={validationErrors.received_by || errors.received_by} />
                                </div>
                                <div>
                                    <Label htmlFor="date_time_received" className="mb-2">
                                        Date/Time Received
                                    </Label>
                                    <Input
                                        id="date_time_received"
                                        type="datetime-local"
                                        value={data.date_time_received}
                                        onChange={(e) => setData('date_time_received', e.target.value)}
                                        required
                                    />
                                    <InputError message={validationErrors.date_time_received || errors.date_time_received} />
                                </div>
                            </div>
                        </div>

                        {/* Remarks */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-base font-semibold text-gray-700 mb-3">
                                Remarks (Optional)
                            </h3>
                            <Textarea
                                id="remarks"
                                value={data.remarks}
                                onChange={(e) => setData('remarks', e.target.value)}
                                placeholder="Enter any additional remarks"
                                rows={3}
                            />
                            <InputError message={errors.remarks} />
                        </div>

                        {/* Signature */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-3">
                                <Label htmlFor="signature" className="text-base font-semibold">
                                    Signature <span className='text-red-500'>(Required)</span>
                                </Label>
                                <Button type="button" variant="outline" size="sm" onClick={clearSignature}>
                                    Clear
                                </Button>
                            </div>
                            <div className="border border-gray-300 rounded-md overflow-hidden">
                                <SignatureCanvas
                                    ref={signaturePadRef}
                                    canvasProps={{ className: 'w-full h-40 touch-none' }}
                                />
                                <InputError message={validationErrors.signature || errors.signature_path} />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Draw your signature in the box above
                            </p>
                        </div>
                    </div>

                    {/* Submit */}
                    <AlertDialogFooter className="flex flex-col-reverse md:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="w-full md:w-auto active:scale-95"
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            className={cn(
                                "w-full md:w-auto",
                                processing
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-blue-600"
                            )}
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Receiving...
                                </span>
                            ) : (
                                "Receive Document"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
}