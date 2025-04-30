import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Offices } from '@/types';
import { Label } from '@/components/ui/label';

interface ShowOfficeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    office: Offices;
}

export default function ShowOfficeDialog({ open, onOpenChange, office }: ShowOfficeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Office Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <div className="text-sm text-gray-700">{office.name}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Code</Label>
                        <div className="text-sm text-gray-700">{office.code}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="text-sm text-gray-700">{office.email}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                office.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {office.is_active ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 