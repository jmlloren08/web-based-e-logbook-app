import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DocumentTypes } from '@/types';

interface ShowDocumentTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentTypes;
}

export default function ShowDocumentTypeDialog({ open, onOpenChange, documentType }: ShowDocumentTypeDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Document Type Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Name</Label>
                        <div className="text-sm text-gray-700">{documentType.name}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Code</Label>
                        <div className="text-sm text-gray-700">{documentType.code}</div>
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                documentType.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {documentType.is_active ? 'Active' : 'Inactive'}
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