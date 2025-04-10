import React from 'react';
import { format } from 'date-fns';

interface User {
  name?: string;
  office_department_unit?: string;
  [key: string]: unknown;
}

interface HistoryEvent {
  id: number;
  state_id: number;
  state: string;
  comments: string;
  timestamp: string;
  user: User;
  is_current: boolean;
  metadata: Record<string, unknown>;
  revision_number: number;
}

interface DocumentTimelineProps {
  historyEvents: HistoryEvent[];
}

const DocumentTimeline: React.FC<DocumentTimelineProps> = ({ historyEvents }) => {
  // Sort events by date (newest first)
  const sortedEvents = [...historyEvents].sort((a, b) =>
    b.state_id - a.state_id && new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Function to get the appropriate icon based on event state
  const getEventIcon = (state: string) => {
    // Convert to lowercase for case-insensitive comparison
    const type = state.toLowerCase();

    // Check for specific document states
    if (type.includes('draft')) return '📝';
    if (type.includes('sent')) return '📤';
    if (type.includes('received')) return '📥';
    if (type.includes('returned')) return '↩️';
    if (type.includes('revised')) return '✏️';
    if (type.includes('finalized')) return '✅';
    if (type.includes('archived')) return '📦';

    // Fallback for other event types
    if (type.includes('created')) return '📝';
    if (type.includes('updated')) return '✏️';
    if (type.includes('approved')) return '👍';
    if (type.includes('rejected')) return '❌';

    return '📄';
  };

  // Function to get the appropriate color based on event state
  const getEventColor = (state: string) => {
    // Convert to lowercase for case-insensitive comparison
    const type = state.toLowerCase();

    // Check for specific document states
    if (type.includes('draft')) return 'bg-gray-100 text-gray-800';
    if (type.includes('sent')) return 'bg-blue-100 text-blue-800';
    if (type.includes('received')) return 'bg-green-100 text-green-800';
    if (type.includes('returned')) return 'bg-red-100 text-red-800';
    if (type.includes('revised')) return 'bg-purple-100 text-purple-800';
    if (type.includes('finalized')) return 'bg-indigo-100 text-indigo-800';
    if (type.includes('archived')) return 'bg-yellow-100 text-yellow-800';

    // Fallback for other event types
    if (type.includes('created')) return 'bg-blue-100 text-blue-800';
    if (type.includes('updated')) return 'bg-purple-100 text-purple-800';
    if (type.includes('approved')) return 'bg-green-100 text-green-800';
    if (type.includes('rejected')) return 'bg-red-100 text-red-800';

    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

      <div className="space-y-6">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-3 top-1.5 h-4 w-4 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
              <span className="text-xs">{getEventIcon(event.state)}</span>
            </div>

            {/* Event content */}
            <div className={`p-4 rounded-lg shadow-sm ${getEventColor(event.state)}`}>
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{event.state}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
              </div>

              <p className="mt-1 text-sm">{event.comments}</p>

              {event.user && Object.keys(event.user).length > 0 && !event.state.includes('Received') && (
                <div className="mt-2 text-xs text-gray-600">
                  <span>By: {event.user.name || 'Unknown User'}</span>
                </div>
              )}
              {event.metadata && Object.keys(event.metadata).length > 0 && event.state === 'Received' && (
                <>
                  <div className="mt-2 text-xs text-gray-600">
                    <span>By: {event.metadata.received_by}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <img
                      src={`/public/public/${event.metadata.signature_path}`}
                      alt="Signature"
                      className="w-24"
                    />
                  </div>
                </>
              )}
              {event.metadata && Object.keys(event.metadata).length > 0 && event.state === 'Returned' && (
                <div className="mt-2 text-xs text-gray-600">
                  <span>Reason: {event.metadata.return_reason}</span>
                </div>
              )}
              {event.is_current && (
                <div className="mt-2 text-xs font-medium text-blue-600">
                  Current State
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentTimeline;
