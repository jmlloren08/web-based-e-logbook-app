import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: "#",
    },
];

export default function Dashboard({ stats, recentDocuments }: {
    stats: {
        totalIncoming: number;
        totalOutgoing: number;
        totalPending: number;
    };
    monthlyData: Array<{
        month: number;
        total: number;
        incoming: number;
        outgoing: number;
    }>;
    recentDocuments: Array<{
        id: string;
        document_no: string;
        title_subject: string;
        docs_types: 'incoming' | 'outgoing';
        date: string;
        status: 'released' | 'pending';
    }>;
    documentTypes: Array<{
        docs_types: string;
        count: number;
    }>;
}) {
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="rounded-xl bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Incoming</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalIncoming}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outgoing</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOutgoing}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl bg-muted/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalPending}</div>
                        </CardContent>
                    </Card>
                </div>
                {/* Recent Documents Table with Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="all" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="incoming">Incoming</TabsTrigger>
                                <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document No.</TableHead>
                                            <TableHead>Title/Subject</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>CREATED_AT</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentDocuments.all.map((doc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{doc.document_no}</TableCell>
                                                <TableCell>{doc.title_subject}</TableCell>
                                                <TableCell>{doc.docs_types}</TableCell>
                                                <TableCell>{new Date(doc.date).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="incoming">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document No.</TableHead>
                                            <TableHead>Title/Subject</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date and Time Received</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentDocuments.incoming.map((doc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{doc.document_no}</TableCell>
                                                <TableCell>{doc.title_subject}</TableCell>
                                                <TableCell>{doc.docs_types}</TableCell>
                                                <TableCell>{new Date(doc.date).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                            <TabsContent value="outgoing">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document No.</TableHead>
                                            <TableHead>Title/Subject</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date and Time Released</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentDocuments.outgoing.map((doc, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{doc.document_no}</TableCell>
                                                <TableCell>{doc.title_subject}</TableCell>
                                                <TableCell>{doc.docs_types}</TableCell>
                                                <TableCell>{new Date(doc.date).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}