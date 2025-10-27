# 🏨 Hotel Management System

A comprehensive hotel management system built with Next.js 15, TypeScript, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd hotel-management

# Install dependencies
npm install

# Setup database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 Features

### 🏠 Room Management
- Room type configuration
- Room status tracking
- Availability management
- Room search and filtering

### 📅 Booking System
- Customer reservations
- Check-in/Check-out process
- Booking calendar
- Availability checking

### 🔧 Maintenance Management
- Maintenance task tracking
- Category-based organization
- Status monitoring
- Task assignment

### 🧹 Housekeeping
- Cleaning task management
- Room assignment
- Status tracking
- Task scheduling

### 💰 Financial Management
- Income/expense tracking
- Financial reports
- Transaction management
- Analytics dashboard

### 📊 Dashboard
- Real-time statistics
- Interactive charts
- Quick actions
- System overview

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Database**: Prisma ORM with SQLite
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── rooms/            # Room management
│   ├── bookings/         # Booking system
│   ├── maintenance/      # Maintenance management
│   ├── housekeeping/     # Housekeeping management
│   ├── financial/        # Financial management
│   └── globals.css       # Global styles
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   └── forms/           # Form components
├── lib/                 # Utility functions
│   ├── db.ts           # Database client
│   ├── auth.ts         # Authentication config
│   └── utils.ts        # Helper functions
└── types/              # TypeScript definitions
```

## 🗄️ Database Schema

The application uses Prisma ORM with the following main models:

- **Room & RoomType**: Room configurations
- **Booking**: Reservation management
- **MaintenanceTask**: Maintenance tracking
- **HousekeepingTask**: Cleaning management
- **FinancialRecord**: Financial transactions
- **Staff**: User management

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
```

### Environment Variables
Create a `.env.local` file:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

See [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md) for detailed deployment instructions.

### Other Platforms
- Railway
- Netlify
- Digital Ocean

## 🧪 Testing

### API Health Check
```bash
curl http://localhost:3000/api/health
```

### Database Connection
```bash
npm run db:studio
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px-1023px)
- Mobile (320px-767px)

## 🔒 Security

- JWT-based authentication
- Secure API routes
- Environment variable protection
- Input validation
- SQL injection prevention

## 📊 Performance

- Optimized bundle size
- Lazy loading components
- Efficient database queries
- Caching strategies
- Image optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check documentation
- Review existing issues

---

Built with ❤️ using Next.js 15 and modern web technologies.