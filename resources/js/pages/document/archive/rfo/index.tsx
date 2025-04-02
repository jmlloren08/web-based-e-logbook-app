import { Head, usePage } from "@inertiajs/react";
import { BreadcrumbItem, RFOs } from "@/types";
import AppLayout from "@/layouts/app-layout";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import $ from 'jquery';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import '../../../../../css/datatables.css';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'RFO',
    href: route('rfos.index'),
  },
];

export default function Index({ rfos }: { rfos: RFOs[] }) {
  const { flash } = usePage().props as { flash?: { success?: string } };
  const tableRef = useRef<HTMLTableElement>(null);
  const dataTableRef = useRef<any>(null);

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success, {
        action: {
          label: 'Dismiss',
          onClick: () => { }
        }
      });
    }
  }, [flash]);

  // Cleanup function
  const destroyDataTable = () => {
    if (dataTableRef.current) {
      try {
        // Remove any event listeners first
        $(tableRef.current).off();
        // Destroy the DataTable instance
        dataTableRef.current.destroy();
        dataTableRef.current = null;
      } catch (error) {
        console.warn('Warning during DataTable cleanup:', error);
      }
    }
  };

  useEffect(() => {
    if (!tableRef.current) return;
    // Cleanup on unmount
    return () => {
      destroyDataTable();
    };
  }, []);

  useEffect(() => {
    if (!tableRef.current) return;
    // Destroy existing table if it exists
    destroyDataTable();
    // Initialize new table
    try {
      dataTableRef.current = $(tableRef.current).DataTable({
        data: rfos,
        columns: [
          { data: 'document_no' },
          { data: 'title_subject' },
          { data: 'origin_office' },
          { data: 'date_time_received_incoming' },
          { data: 'doc_type' },
          { data: 'sender' },
          { data: 'remarks' }
        ],
        order: [[0, 'desc']],
        pageLength: 10,
        responsive: true,
        dom: '<"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4"<"flex gap-2"<"px-4 py-2 bg-white border rounded-md"l><"relative w-full sm:w-64"f>>>rt<"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4"<"flex-1 flex justify-center"p><"flex-1 flex justify-end"i>>',
        language: {
          search: "",
          searchPlaceholder: "Search documents...",
          lengthMenu: "Show _MENU_ entries",
          info: "Showing _START_ to _END_ of _TOTAL_ entries",
          infoEmpty: "Showing 0 to 0 of 0 entries",
          infoFiltered: "(filtered from _MAX_ total entries)",
          paginate: {
            first: "First",
            last: "Last",
            next: "Next",
            previous: "Previous"
          }
        },
        initComplete: function() {
          // Add custom classes to elements
          $('.dataTables_length select').addClass('text-sm');
          $('.dataTables_info').addClass('text-sm');
          $('.dataTables_paginate').addClass('text-sm');
          $('.dataTables_filter input').addClass('text-sm');
        }
      });
    } catch (error) {
      console.error('Error initializing DataTable:', error);
    }

    return () => {
      destroyDataTable();
    };
  }, [rfos]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="RFOs" />
      <div className="container max-w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table ref={tableRef} className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-sm font-medium">Document No.</th>
                  <th className="text-sm font-medium">Title/Subject</th>
                  <th className="text-sm font-medium">Origin Office</th>
                  <th className="text-sm font-medium">Date Received</th>
                  <th className="text-sm font-medium">Document Type</th>
                  <th className="text-sm font-medium">Sender</th>
                  <th className="text-sm font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rfos.map((rfo, index) => (
                  <tr key={index}>
                    <td className="text-sm">{rfo.document_no}</td>
                    <td className="text-sm">{rfo.title_subject}</td>
                    <td className="text-sm">{rfo.origin_office}</td>
                    <td className="text-sm">{rfo.date_time_received_incoming}</td>
                    <td className="text-sm">{rfo.doc_type}</td>
                    <td className="text-sm">{rfo.sender}</td>
                    <td className="text-sm">{rfo.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 