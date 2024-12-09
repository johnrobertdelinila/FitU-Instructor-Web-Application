import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ViewPerformedExercisesModal({ 
  assignmentId, 
  exerciseName, 
  onClose,
  onExerciseDeleted 
}) {
  const [performedExercises, setPerformedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPerformedExercises();
  }, [assignmentId]);

  const fetchStudentName = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().name;
      }
      return 'Unknown Student';
    } catch (error) {
      console.error('Error fetching student name:', error);
      return 'Unknown Student';
    }
  };

  const fetchPerformedExercises = async () => {
    try {
      const performedRef = collection(db, `exerciseAssignments/${assignmentId}/performedExercises`);
      const querySnapshot = await getDocs(performedRef);
      
      const exercisesPromises = querySnapshot.docs.map(async (doc) => {
        const exerciseData = doc.data();
        const studentName = await fetchStudentName(exerciseData.uid);
        return {
          id: doc.id,
          ...exerciseData,
          studentName,
          isAccomplished: exerciseData.isAccomplished || false
        };
      });

      const exercisesData = await Promise.all(exercisesPromises);
      setPerformedExercises(exercisesData);
    } catch (error) {
      console.error('Error fetching performed exercises:', error);
      setError('Failed to load performed exercises');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAccomplishment = async (exerciseId, currentStatus) => {
    setUpdatingId(exerciseId);
    try {
      const exerciseRef = doc(db, `exerciseAssignments/${assignmentId}/performedExercises/${exerciseId}`);
      await updateDoc(exerciseRef, {
        isAccomplished: !currentStatus
      });

      // Update local state
      setPerformedExercises(exercises => 
        exercises.map(exercise => 
          exercise.id === exerciseId 
            ? { ...exercise, isAccomplished: !currentStatus }
            : exercise
        )
      );
    } catch (error) {
      console.error('Error updating exercise status:', error);
      setError('Failed to update exercise status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this performed exercise?')) {
      return;
    }

    setDeletingId(exerciseId);
    try {
      const exerciseRef = doc(db, `exerciseAssignments/${assignmentId}/performedExercises/${exerciseId}`);
      await deleteDoc(exerciseRef);

      // Update local state
      setPerformedExercises(exercises => 
        exercises.filter(exercise => exercise.id !== exerciseId)
      );

      // Notify parent component to update completion count
      onExerciseDeleted();
    } catch (error) {
      console.error('Error deleting exercise:', error);
      setError('Failed to delete exercise');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Performed Exercises - {exerciseName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-md">{error}</div>
          ) : performedExercises.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No students have performed this exercise yet.
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Exercise Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repetitions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performedExercises.map((exercise) => (
                    <tr key={exercise.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exercise.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exercise.exercise_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exercise.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exercise.repetition}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {exercise.time_and_date?.toDate().toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleAccomplishment(exercise.id, exercise.isAccomplished)}
                            disabled={updatingId === exercise.id || deletingId === exercise.id}
                            className={`group relative p-2 rounded-full transition-colors ${
                              exercise.isAccomplished 
                                ? 'bg-green-100 hover:bg-green-200' 
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            {updatingId === exercise.id ? (
                              <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <svg 
                                className={`h-5 w-5 ${
                                  exercise.isAccomplished ? 'text-green-600' : 'text-gray-400'
                                }`} 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  strokeWidth={2} 
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                            <span className="sr-only">
                              {exercise.isAccomplished ? 'Mark as incomplete' : 'Mark as complete'}
                            </span>
                            
                            {/* Tooltip */}
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                              {exercise.isAccomplished ? 'Mark as incomplete' : 'Mark as complete'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleDeleteExercise(exercise.id)}
                            disabled={updatingId === exercise.id || deletingId === exercise.id}
                            className="group relative p-2 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                          >
                            {deletingId === exercise.id ? (
                              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            ) : (
                              <>
                                <svg 
                                  className="h-5 w-5" 
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
                                <span className="sr-only">Delete exercise</span>
                                
                                {/* Delete Tooltip */}
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                  Delete exercise
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 