import { useState } from 'react';

export default function AssignExerciseModal({ onClose, onSubmit }) {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exercise list data
  const exercises = [
    {
      id: 1,
      name: "Push up",
      level: "Intermediate",
      calorie: 3.2
    },
    {
      id: 2,
      name: "Lunge",
      level: "Intermediate",
      calorie: 3.0
    },
    {
      id: 3,
      name: "Squat",
      level: "Strength",
      calorie: 3.8
    },
    {
      id: 4,
      name: "Sit up",
      level: "Strength",
      calorie: 5.0
    },
    {
      id: 9,
      name: "Warrior Yoga",
      level: "Yoga",
      calorie: 1.5
    },
    {
      id: 10,
      name: "Tree Yoga",
      level: "Yoga",
      calorie: 1.0
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const selectedExerciseData = exercises.find(ex => ex.id === parseInt(selectedExercise));
      
      const assignmentData = {
        exerciseId: selectedExerciseData.id,
        exerciseName: selectedExerciseData.name,
        exerciseLevel: selectedExerciseData.level,
        exerciseCalorie: selectedExerciseData.calorie,
        repetitions: isUnlimited ? null : parseInt(repetitions),
        dueDate: new Date(dueDate).toISOString(),
        isUnlimited
      };

      await onSubmit(assignmentData);
      onClose();
    } catch (error) {
      setError('Failed to create assignment');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl transform transition-all">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Assign Exercise</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create a new exercise assignment
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-500 transition-colors disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Exercise Selection Dropdown */}
            <div>
              <label htmlFor="exerciseSelect" className="block text-sm font-medium text-gray-700">
                Select Exercise
              </label>
              <div className="mt-1">
                <select
                  id="exerciseSelect"
                  required
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  disabled={isSubmitting}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:opacity-50"
                >
                  <option value="">Select an exercise</option>
                  {exercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} - {exercise.level} ({exercise.calorie} cal/rep)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Exercise Details (if exercise is selected) */}
            {selectedExercise && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Exercise Details</h4>
                {(() => {
                  const exercise = exercises.find(ex => ex.id === parseInt(selectedExercise));
                  return (
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>Level: {exercise.level}</p>
                      <p>Calories per rep: {exercise.calorie}</p>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Repetitions Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="repetitions" className="block text-sm font-medium text-gray-700">
                  Number of Repetitions
                </label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="unlimitedReps"
                    checked={isUnlimited}
                    onChange={(e) => {
                      setIsUnlimited(e.target.checked);
                      if (e.target.checked) {
                        setRepetitions('');
                      }
                    }}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="unlimitedReps" className="ml-2 text-sm text-gray-600">
                    Unlimited repetitions
                  </label>
                </div>
              </div>
              {!isUnlimited && (
                <div className="mt-1">
                  <input
                    type="number"
                    id="repetitions"
                    required={!isUnlimited}
                    min="1"
                    value={repetitions}
                    onChange={(e) => setRepetitions(e.target.value)}
                    disabled={isSubmitting || isUnlimited}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:opacity-50"
                    placeholder="Enter number of repetitions"
                  />
                </div>
              )}
            </div>

            {/* Due Date Input */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                Due Date
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  id="dueDate"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Assignment...
                  </span>
                ) : (
                  'Create Assignment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 