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
import { Offices } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { useEffect } from 'react';

interface EditOfficeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    office: Offices;
}

export default function EditOfficeDialog({ open, onOpenChange, office }: EditOfficeDialogProps) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: office.name,
        code: office.code,
        is_active: office.is_active
    });

    // Update form data when office prop changes
    useEffect(() => {
        setData({
            name: office.name,
            code: office.code,
            is_active: office.is_active
        });
    }, [office]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/auth/verified/management/offices/${office.id}`, {
            onSuccess: () => {
                onOpenChange(false);
                reset();
                Inertia.reload({
                    only: ['offices'],
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
                    <DialogTitle>Edit Office</DialogTitle>
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