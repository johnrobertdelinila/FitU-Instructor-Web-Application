import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import NavigationBar from '../components/NavigationBar';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { format, subDays, startOfDay, endOfDay, parseISO } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    rosterStudents: 0,
    assignedExercises: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [timeRange, setTimeRange] = useState('daily'); // 'daily', 'monthly', 'yearly'

  useEffect(() => {
    fetchStats();
    fetchPerformanceData();
  }, [currentUser, timeRange]);

  const fetchStats = async () => {
    try {
      console.log('Fetching stats...');
      const totalQuery = query(collection(db, 'users'));
      const totalSnapshot = await getDocs(totalQuery);
      
      const activeQuery = query(collection(db, 'users'), where('status', '==', 'active'));
      const activeSnapshot = await getDocs(activeQuery);

      // Fetch instructor's roster count
      const rosterRef = doc(db, 'classRosters', currentUser.uid);
      const rosterSnap = await getDoc(rosterRef);
      const rosterCount = rosterSnap.exists() ? (rosterSnap.data().students || []).length : 0;

      // Fetch assigned exercises count
      const exercisesQuery = query(
        collection(db, 'exerciseAssignments'),
        where('instructorId', '==', currentUser.uid)
      );
      const exercisesSnapshot = await getDocs(exercisesQuery);

      setStats({
        totalStudents: totalSnapshot.size,
        activeStudents: activeSnapshot.size,
        rosterStudents: rosterCount,
        assignedExercises: exercisesSnapshot.size,
        recentActivity: []
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceData = async () => {
    try {
      // Get all exercise assignments for this instructor
      const assignmentsQuery = query(
        collection(db, 'exerciseAssignments'),
        where('instructorId', '==', currentUser.uid)
      );
      const assignmentsSnapshot = await getDocs(assignmentsQuery);
      
      let allPerformances = [];
      
      // For each assignment, get its performed exercises
      for (const assignmentDoc of assignmentsSnapshot.docs) {
        const performedRef = collection(db, `exerciseAssignments/${assignmentDoc.id}/performedExercises`);
        const performedSnapshot = await getDocs(performedRef);
        
        const performances = performedSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        
        allPerformances = [...allPerformances, ...performances];
      }

      setPerformanceData(allPerformances);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    }
  };

  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      return format(subDays(new Date(), i), 'MMM dd');
    }).reverse();

    const dailyCount = new Array(7).fill(0);

    performanceData.forEach(performance => {
      const performanceDate = performance.time_and_date?.toDate();
      if (performanceDate) {
        const dayIndex = last7Days.indexOf(format(performanceDate, 'MMM dd'));
        if (dayIndex !== -1) {
          dailyCount[dayIndex]++;
        }
      }
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Performed Exercises',
          data: dailyCount,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Exercise Performance Trend',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-blue-100 rounded-md">
                      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
                      <p className="mt-1 text-3xl font-semibold text-gray-700">{stats.totalStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-green-100 rounded-md">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Active Students</h3>
                      <p className="mt-1 text-3xl font-semibold text-gray-700">{stats.activeStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-purple-100 rounded-md">
                      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">My Roster Students</h3>
                      <p className="mt-1 text-3xl font-semibold text-gray-700">{stats.rosterStudents}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 bg-orange-100 rounded-md">
                      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Assigned Exercises</h3>
                      <p className="mt-1 text-3xl font-semibold text-gray-700">{stats.assignedExercises}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Exercise Performance Analytics
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimeRange('daily')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      timeRange === 'daily'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setTimeRange('monthly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      timeRange === 'monthly'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setTimeRange('yearly')}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      timeRange === 'yearly'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
              <div className="h-[400px]">
                <Line data={getChartData()} options={chartOptions} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 