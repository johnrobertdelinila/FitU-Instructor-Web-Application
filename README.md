# FitU Instructor Web Application

FitU is a web application designed for DMMMSU instructors to manage PathFit 101 classes efficiently. It provides tools for managing student rosters, assigning exercises, tracking student progress, and fostering a healthy lifestyle through structured fitness routines.

## Features

- **Authentication**: Secure Google Sign-in for instructors
- **Dashboard**: Overview of key statistics and performance analytics
- **Class Roster Management**: Add/remove students from your class
- **Exercise Assignment**: Create and manage exercise assignments for students
- **Progress Tracking**: Monitor student performance with visual analytics
- **Announcements**: Communicate with students through announcements
- **Data Export**: Export student data to CSV format

## Technologies Used

- React.js
- Firebase (Authentication & Firestore)
- TailwindCSS
- Chart.js
- Vite
- React Router DOM

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git
- A Firebase account

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/johnrobertdelinila/FitU-Instructor-Web-Application.git
cd FitU-Instructor-Web-Application
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and get your configuration:
- Go to Firebase Console
- Create a new project
- Enable Authentication (Google provider)
- Enable Firestore Database
- Get your Firebase configuration object

4. Create a `.env` file in the root directory with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

6. Open your browser and navigate to `http://localhost:5173`


## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- DMMMSU for the inspiration and support
- PathFit 101 program
- All contributors and users of the application