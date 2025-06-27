# Student Registration System

*የተማሪ መመዝገቢያ እና መገኘት መቁጠሪያ ስርዓት*

A comprehensive student registration and attendance tracking system built with Next.js and Amharic language support. This system works in the v0 preview using localStorage and can be easily upgraded to use a database in production.

## 🚀 Features

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

### 📈 Analytics & Statistics
- **Individual Stats**: Detailed attendance statistics for each student
- **Session Breakdown**: Separate tracking for each day of the week
- **Attendance Percentage**: Overall and session-specific attendance rates
- **Visual Progress**: Progress bars and color-coded performance indicators
- **Date Range Filtering**: View statistics for specific time periods

### 🌙 User Experience
- **Dark Mode**: Complete dark/light theme support
- **Responsive Design**: Mobile-friendly interface
- **Amharic Support**: Full Amharic language interface with proper font rendering
- **Real-time Updates**: Live data synchronization

## 🏗️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Storage**: localStorage (preview) / Database (production)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Theme**: next-themes for dark mode support
- **Icons**: Lucide React
- **Fonts**: Noto Sans Ethiopic for Amharic text

## 💾 Storage Options

### Current (Preview-Compatible)
- **localStorage**: Works in v0 preview, data persists in browser
- **Automatic Backup**: Data is automatically saved to browser storage
- **No Setup Required**: Works immediately without configuration

### Production Options

#### 1. **Supabase** (Recommended)
\`\`\`bash
npm install @supabase/supabase-js
\`\`\`
- **Free Tier**: 500MB database, 50MB file storage
- **Real-time**: Live updates across devices
- **Authentication**: Built-in user management
- **Easy Setup**: Simple configuration

#### 2. **Vercel KV** (Redis)
\`\`\`bash
npm install @vercel/kv
\`\`\`
- **Serverless**: No server management
- **Fast**: In-memory performance
- **Vercel Integration**: Seamless deployment

#### 3. **PlanetScale** (MySQL)
\`\`\`bash
npm install @planetscale/database
\`\`\`
- **Serverless MySQL**: No connection limits
- **Branching**: Database version control
- **Free Tier**: 1 database, 1GB storage

#### 4. **MongoDB Atlas**
\`\`\`bash
npm install mongodb mongoose
\`\`\`
- **Document Database**: Flexible schema
- **Free Tier**: 512MB storage
- **Global Clusters**: Worldwide availability

## 🚀 Getting Started

### Preview (Current)
1. The system works immediately in v0 preview
2. Data is stored in browser localStorage
3. All features are fully functional

### Production Deployment

1. **Clone and Install**
   \`\`\`bash
   git clone <repository-url>
   cd student-registration-system
   npm install
   \`\`\`

2. **Choose Database** (pick one):

   **Option A: Supabase**
   \`\`\`bash
   npm install @supabase/supabase-js
   \`\`\`
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   \`\`\`

   **Option B: Vercel KV**
   \`\`\`bash
   npm install @vercel/kv
   \`\`\`
   \`\`\`env
   KV_REST_API_URL=your-kv-url
   KV_REST_API_TOKEN=your-kv-token
   \`\`\`

   **Option C: PlanetScale**
   \`\`\`bash
   npm install @planetscale/database
   \`\`\`
   \`\`\`env
   DATABASE_URL=your-planetscale-url
   \`\`\`

3. **Update Storage Layer**
   - Replace `lib/storage.ts` with database-specific implementation
   - Update API routes to use new storage layer

4. **Deploy**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## 📱 Usage

### Age Groups (የእድሜ ቡድኖች)
- **ቡድን ሀ**: 4-6 ዓመት (Ages 4-6)
- **ቡድን ለ**: 7-10 ዓመት (Ages 7-10)  
- **ቡድን ሐ**: 11-14 ዓመት (Ages 11-14)
- **ቡድን መ**: 15-18 ዓመት (Ages 15-18)

### Navigation
1. **አዲስ ተማሪ መመዝገቢያ** - Register new students
2. **የተመዘገቡ ተማሪዎች** - View all registered students
3. **መገኘት መቁጠሪያ** - Track daily attendance
4. **የእድሜ ቡድኖች** - View students by age groups
5. **የመገኘት ስታቲስቲክስ** - Detailed attendance analytics

## 🔧 Customization

### Adding New Features
1. Update `lib/storage.ts` for data operations
2. Create new API routes in `app/api/`
3. Add new pages in `app/`
4. Update navigation in `app/page.tsx`

### Changing Age Groups
1. Modify age ranges in `lib/storage.ts`
2. Update group names throughout the application
3. Adjust color schemes in components

## 📊 Data Structure

### Student
\`\`\`typescript
{
  id: string
  fullName: string
  spiritualName: string
  sex: 'ወንድ' | 'ሴት'
  age: number
  class: string
  familyName: string
  phone: string
  address: string
  photo?: string
  group: string
  registrationDate: string
}
\`\`\`

### Attendance
\`\`\`typescript
{
  id: string
  studentId: string
  date: string
  sessions: {
    monday: boolean
    wednesday: boolean
    friday: boolean
  }
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Ethiopian Sunday Schools**

*Works in v0 preview • Ready for production deployment*
