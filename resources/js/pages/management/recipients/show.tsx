import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Recipients } from '@/types';
import { Label } from '@/components/ui/label';

interface ShowRecipientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    recipient: Recipients;
}

export default function ShowRecipientDialog({ open, onOpenChange, recipient }: ShowRecipientDialogProps) {
    // console.log(recipient);
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Recipient Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <div className="text-sm text-gray-700">{recipient.name}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Code</Label>
                        <div className="text-sm text-gray-700">{recipient.code}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Office</Label>
                        <div className="text-sm text-gray-700">{recipient.offices.name}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                recipient.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {recipient.is_active ? 'Active' : 'Inactive'}
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