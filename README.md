# MovieHub - Modern Movie Streaming Platform

A modern, responsive movie streaming platform built with React and Vite, featuring a clean UI, movie browsing, blog functionality, and admin panel. Currently implemented as a frontend-only application with mock data.

## 🚀 Features

### ✅ Completed Features
- **Modern UI/UX**: Built with React and custom CSS utilities for a sleek, responsive design
- **Movie Catalog**: Browse movies by genre, quality, and release year with search functionality
- **Movie Details**: Detailed movie pages with download options and related movies
- **Blog System**: Full blog functionality with posts, categories, search, and individual post pages
- **Admin Panel**: Comprehensive admin dashboard for content management
- **Responsive Design**: Mobile-first approach that works perfectly on all devices
- **Fast Performance**: Built with Vite for optimal development and build performance

### 🔄 Current Status
- Frontend fully implemented with mock data
- All major pages and components working
- Responsive navigation and UI components
- Ready for backend integration

## 🛠️ Tech Stack

### Frontend (Completed)
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **Custom CSS** - Responsive utilities and animations
- **Heroicons** - Beautiful SVG icons

### Backend (Future Implementation)
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication tokens

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd moviestream-pro
   ```

2. **Install dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   - Create `.env` file in the backend directory
   - Add your MongoDB connection string and JWT secret
   - Configure any API keys (TMDB, etc.)

4. **Start the development servers**
   ```bash
   npm run dev
   ```

This will start both the frontend (React) and backend (Node.js) servers concurrently.

## 🌐 API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get movie by ID
- `POST /api/movies` - Create new movie (Admin)
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

## 📱 Screenshots

*Screenshots will be added after UI implementation*

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by modern streaming platforms
- Built with modern web technologies
- Designed for optimal user experience