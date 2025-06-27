# Student Registration System with MongoDB

*የተማሪ መመዝገቢያ እና መገኘት መቁጠሪያ ስርዓት*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/fasikazergaw-6082s-projects/v0-student-registration-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/qhGTQ7GwHMw)

## Overview

A comprehensive student registration and attendance tracking system built with Next.js, MongoDB, and Amharic language support. This system is designed for Sunday schools and educational institutions that need to manage student information and track attendance efficiently.

## Features

### 🎓 Student Management
- **Student Registration**: Complete registration form with validation
- **Age-based Grouping**: Automatic grouping based on age (4-6, 7-10, 11-14, 15-18 years)
- **Search & Filter**: Advanced search by name, spiritual name, or class
- **Photo Upload**: Support for student profile pictures
- **Duplicate Prevention**: Automatic detection of duplicate registrations

### 📊 Attendance Tracking
- **Session-based Attendance**: Track attendance for Monday, Wednesday, and Friday sessions
- **Date Selection**: Flexible date selection for attendance records
- **Group-based View**: View attendance by age groups
- **Bulk Operations**: Save multiple attendance records efficiently

### 🌙 User Experience
- **Dark Mode**: Complete dark/light theme support
- **Responsive Design**: Mobile-friendly interface
- **Amharic Support**: Full Amharic language interface with proper font rendering
- **Real-time Updates**: Live data synchronization

### 🗄️ Database Features
- **MongoDB Integration**: Robust data persistence with MongoDB
- **Data Validation**: Server-side validation with Mongoose schemas
- **Indexing**: Optimized database queries with proper indexing
- **Backup & Recovery**: Reliable data storage and retrieval

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS, shadcn/ui components
- **Theme**: next-themes for dark mode support
- **Icons**: Lucide React
- **Fonts**: Noto Sans Ethiopic for Amharic text

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd student-registration-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Edit `.env.local` and add your MongoDB connection string:
   \`\`\`env
   MONGODB_URI=mongodb://localhost:27017/student-registration
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/student-registration?retryWrites=true&w=majority
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Database Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/student-registration`

#### MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace username, password, and cluster details in the connection string

## API Endpoints

### Students
- `GET /api/students` - Get all students (with optional filtering)
- `POST /api/students` - Create new student
- `GET /api/students/[id]` - Get single student
- `PUT /api/students/[id]` - Update student
- `DELETE /api/students/[id]` - Delete student

### Attendance
- `GET /api/attendance` - Get attendance records
- `POST /api/attendance` - Save attendance record
- `POST /api/attendance/bulk` - Save multiple attendance records

### Statistics
- `GET /api/stats` - Get system statistics

## Data Models

### Student Schema
\`\`\`typescript
{
  fullName: string (required)
  spiritualName: string (required)
  sex: 'ወንድ' | 'ሴት' (required)
  age: number (4-18, required)
  class: string (required)
  familyName: string (required)
  phone: string (required, unique)
  address: string (required)
  photo?: string
  group: string (auto-calculated)
  registrationDate: Date
}
\`\`\`

### Attendance Schema
\`\`\`typescript
{
  studentId: string (required)
  date: Date (required)
  sessions: {
    monday: boolean
    wednesday: boolean
    friday: boolean
  }
}
\`\`\`

## Age Groups (የእድሜ ቡድኖች)

- **ቡድን ሀ**: 4-6 ዓመት (Ages 4-6)
- **ቡድን ለ**: 7-10 ዓመት (Ages 7-10)  
- **ቡድን ሐ**: 11-14 ዓመት (Ages 11-14)
- **ቡድን መ**: 15-18 ዓመት (Ages 15-18)

## Deployment

### Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production
\`\`\`env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for Ethiopian Sunday Schools**
