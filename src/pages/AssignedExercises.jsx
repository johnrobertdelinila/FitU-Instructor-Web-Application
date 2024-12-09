import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';
import AssignExerciseModal from '../components/AssignExerciseModal';
import ViewPerformedExercisesModal from '../components/ViewPerformedExercisesModal';
import EditAssignmentModal from '../components/EditAssignmentModal';

export default function AssignedExercises() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingAssignmentId, setDeletingAssignmentId] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, [currentUser]);

  const fetchAssignments = async () => {
    try {
      const assignmentsRef = collection(db, 'exerciseAssignments');
      const q = query(
        assignmentsRef,
        where('instructorId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      // Fetch assignments and their completion counts
      const assignmentsPromises = querySnapshot.docs.map(async (doc) => {
        const assignmentData = doc.data();
        const performedRef = collection(db, `exerciseAssignments/${doc.id}/performedExercises`);
        const performedSnapshot = await getDocs(performedRef);
        
        return {
          id: doc.id,
          ...assignmentData,
          completionCount: performedSnapshot.size
        };
      });

      const assignmentsData = await Promise.all(assignmentsPromises);
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignExercise = async (assignmentData) => {
    try {
      const newAssignment = {
        instructorId: currentUser.uid,
        classRosterId: currentUser.uid,
        ...assignmentData,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'exerciseAssignments'), newAssignment);
      await fetchAssignments();
      setShowAssignModal(false);
    } catch (error) {
      console.error('Error creating assignment:', error);
      setError('Failed to create assignment');
      throw error; // Propagate error to modal
    }
  };

  const handleEditAssignment = async (updatedData) => {
    try {
      const assignmentRef = doc(db, 'exerciseAssignments', editingAssignment.id);
      
      // Keep all existing fields and only update repetitions and dueDate
      const updates = {
        repetitions: updatedData.repetitions,
        dueDate: updatedData.dueDate
      };

      await updateDoc(assignmentRef, updates);
      await fetchAssignments(); // Refresh the assignments list
      setEditingAssignment(null);
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error; // Propagate error to modal for handling
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this exercise assignment?')) {
      return;
    }

    setDeletingAssignmentId(assignmentId);
    try {
      await deleteDoc(doc(db, 'exerciseAssignments', assignmentId));
      await fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      setError('Failed to delete assignment');
    } finally {
      setDeletingAssignmentId(null);
    }
  };

  const filteredAssignments = assignments.filter(assignment => 
    String(assignment.exerciseName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(assignment.repetitions || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(assignment.dueDate).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBar />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">Assigned Exercises</h1>
              <p className="mt-2 text-sm text-gray-600">
                Track and manage your class exercise assignments
              </p>
            </div>
            <button
              onClick={() => setShowAssignModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Assign Exercise
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <div className="max-w-md">
              <div className="relative rounded-lg shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border-none rounded-lg bg-white focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                  placeholder="Search exercises..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Assignments Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assignments.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No exercises assigned yet</h3>
                <p className="mt-2 text-sm text-gray-500">Get started by assigning an exercise to your class.</p>
                <button
                  onClick={() => setShowAssignModal(true)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-primary-600 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Assign First Exercise
                </button>
              </div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="md:col-span-2 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No matches found</h3>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your search terms.</p>
              </div>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <div key={assignment.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {assignment.exerciseName}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          {assignment.repetitions} repetitions
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          {assignment.completionCount} students completed
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Assigned
                    </span>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    {assignment.completionCount === 0 && (
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        disabled={deletingAssignmentId === assignment.id}
                        className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50"
                      >
                        {deletingAssignmentId === assignment.id ? (
                          <>
                            <svg 
                              className="animate-spin -ml-1 mr-2 h-4 w-4" 
                              xmlns="http://www.w3.org/2000/svg" 
                              fill="none" 
                              viewBox="0 0 24 24"
                            >
                              <circle 
                                className="opacity-25" 
                                cx="12" 
                                cy="12" 
                                r="10" 
                                stroke="currentColor" 
                                strokeWidth="4"
                              />
                              <path 
                                className="opacity-75" 
                                fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg 
                              className="h-4 w-4 mr-1.5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => setEditingAssignment(assignment)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setSelectedAssignment(assignment)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modals */}
        {showAssignModal && (
          <AssignExerciseModal
            onClose={() => setShowAssignModal(false)}
            onSubmit={handleAssignExercise}
          />
        )}

        {selectedAssignment && (
          <ViewPerformedExercisesModal
            assignmentId={selectedAssignment.id}
            exerciseName={selectedAssignment.exerciseName}
            onClose={() => setSelectedAssignment(null)}
          />
        )}

        {editingAssignment && (
          <EditAssignmentModal
            assignment={editingAssignment}
            onClose={() => setEditingAssignment(null)}
            onSubmit={handleEditAssignment}
          />
        )}
      </div>
    </div>
  );
} 