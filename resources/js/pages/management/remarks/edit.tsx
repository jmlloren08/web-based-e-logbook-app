import { useForm } from '@inertiajs/react';
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
import { Remarks } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { useEffect } from 'react';

interface EditRemarksDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    remark: Remarks;
}

export default function EditRemarksDialog({ open, onOpenChange, remark }: EditRemarksDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: remark.name,
        is_active: remark.is_active
    });

    // Update form data when remark prop changes
    useEffect(() => {
        setData({
            name: remark.name,
            is_active: remark.is_active
        });
    }, [remark]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/auth/verified/management/remarks/${remark.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                Inertia.reload({
                    only: ['remarks'],
                    preserveState: true,
                });
            }
        });
    };

    // Reset form when dialog closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Remarks</DialogTitle>
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

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="is_active"
                            checked={data.is_active}
                            onCheckedChange={(checked: boolean) => setData('is_active', checked)}
                        />
                        <Label htmlFor="is_active">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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