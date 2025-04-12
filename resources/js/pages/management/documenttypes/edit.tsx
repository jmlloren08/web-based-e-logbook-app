import { router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { DocumentTypes } from '@/types';
import { useEffect } from 'react';

interface EditDocumentTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentTypes;
}

export default function EditDocumentTypeDialog({ open, onOpenChange, documentType }: EditDocumentTypeDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: documentType.name,
        code: documentType.code,
        is_active: documentType.is_active
    });

    // Update form data when documentType prop changes
        useEffect(() => {
            setData({
                name: documentType.name,
                code: documentType.code,
                is_active: documentType.is_active
            });
        }, [documentType]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/auth/verified/management/document-types/${documentType.id}`, {
            onSuccess: () => {
                router.reload({
                    only: ['documentTypes'],
                });
                onOpenChange(false);
                reset();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Document Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name (Required)</Label>
                        <Input
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="code">Code (Required)</Label>
                        <Input
                            id="code"
                            name="code"
                            value={data.code}
                            onChange={e => setData('code', e.target.value)}
                            required
                        />
                        {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Please wait...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 