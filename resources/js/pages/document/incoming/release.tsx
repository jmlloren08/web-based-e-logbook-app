import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FileInput } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { cn } from '@/lib/utils';
import { Inertia } from '@inertiajs/inertia';

export default function Release({ docId }: { docId: string }) {

    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        type: 'outgoing',
        document_id: docId,
        date_released: new Date().toISOString().split('T')[0], // default today's date
        forwarded_to_office_department_unit: '',
    });

    const handleRelease = async () => {
        // Validate fields before submission
        if (!data.date_released || !data.forwarded_to_office_department_unit) {
            return;
        }
        // Proceed with form submission
        await post(route('incoming-documents.release', docId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                Inertia.reload({
                    only: ['documents'],
                    preserveState: true
                });
                setOpen(false);
            },
            onError: () => {
                console.log('Form submission errors: ', errors);
            }
        });
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className='hover:text-blue-600 active:scale-95'
                    title='Release Document'
                >
                    <FileInput />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='sm:max-w-[500px] max-h-[90vh] overflow-y-auto'>
                <AlertDialogHeader className='mb-4'>
                    <AlertDialogTitle className='text-xl font-bold text-gray-800'>Release Document</AlertDialogTitle>
                    <AlertDialogDescription className='text-sm text-muted-foreground'>
                        Confirm document release details.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
                            <Label htmlFor='date_released' className='font-medium'>
                                Date Released
                            </Label>
                            <div>
                                <Input
                                    id='date_released'
                                    type='date'
                                    value={data.date_released}
                                    onChange={(e) => setData('date_released', e.target.value)}
                                    className='w-full'
                                    required
                                />
                                <InputError message={errors.date_released} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 items-center">
                            <Label htmlFor='forwarded_to_office_department' className='font-medium'>
                                Forwarded To
                            </Label>
                            <div>
                                <Input
                                    id='forwarded_to_office_department'
                                    value={data.forwarded_to_office_department_unit}
                                    onChange={(e) => setData('forwarded_to_office_department_unit', e.target.value)}
                                    placeholder='Enter department/office/unit name'
                                    className='w-full'
                                    required
                                />
                                <InputError
                                    message={errors.forwarded_to_office_department_unit}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-lg">
                        <p>
                            <strong>Note:</strong> This action cannot be undone. The document will be permanently released.
                        </p>
                    </div>
                </div>
                <AlertDialogFooter className="flex flex-col-reverse md:flex-row gap-2 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full md:w-auto active:scale-95"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRelease}
                        disabled={processing}
                        className={cn(
                            "w-full md:w-auto",
                            processing
                                ? "opacity-50 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-600/90"
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
                                Releasing...
                            </span>
                        ) : (
                            "Release Document"
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}