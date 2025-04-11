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

interface CreateRecipientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateRecipientDialog({ open, onOpenChange }: CreateRecipientDialogProps) {

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        code: '',
        is_active: true
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/auth/verified/management/recipients', {
            onSuccess: () => {
                onOpenChange(false);
                reset();
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Recipient</DialogTitle>
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
                    {/* <Optional /> */}
                    <div className="flex items-center space-x-2">
                        <Label htmlFor="is_active">Status</Label>
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
                            {processing ? 'Please wait...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
} 