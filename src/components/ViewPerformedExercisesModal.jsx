import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function ViewPerformedExercisesModal({ assignmentId, exerciseName, onClose }) {
  const [performedExercises, setPerformedExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      
      // Fetch all exercises and their corresponding student names
      const exercisesPromises = querySnapshot.docs.map(async (doc) => {
        const exerciseData = doc.data();
        const studentName = await fetchStudentName(exerciseData.uid);
        return {
          id: doc.id,
          ...exerciseData,
          studentName
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden">
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
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repetitions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {performedExercises.map((exercise) => (
                    <tr key={exercise.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {exercise.studentName}
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