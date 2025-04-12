import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Remarks } from '@/types';
import { Label } from '@/components/ui/label';

interface ShowRemarksDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    remark: Remarks;
}

export default function ShowRemarksDialog({ open, onOpenChange, remark }: ShowRemarksDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Remarks Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <div className="text-sm text-gray-700">{remark.name}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                remark.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {remark.is_active ? 'Active' : 'Inactive'}
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