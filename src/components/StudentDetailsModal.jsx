export default function StudentDetailsModal({ student, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Student Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Personal Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.name || 'Not Set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Age</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.age || 'Not Set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Height (cm)</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.height || 'Not Set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Weight (kg)</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.weight || 'Not Set'}</dd>
              </div>
            </dl>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Academic Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Course</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.course || 'Not Set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.yearLevel || 'Not Set'}</dd>
              </div>
            </dl>
          </div>

          {/* Fitness Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Fitness Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Fitness Level</dt>
                <dd className="mt-1 text-sm text-gray-900">{student.fitnessLevel || 'Not Set'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : student.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status || 'Not Set'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Account Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Account Information</h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {student.createdAt?.toDate().toLocaleString() || 'Not Set'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Active</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {student.lastActive?.toDate().toLocaleString() || 'Not Set'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">User ID</dt>
                <dd className="mt-1 text-sm text-gray-900 break-all">{student.id}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 