A full-stack job application tracker built with Next.js, TypeScript, and MariaDB. Features secure authentication, RESTful APIs, and a responsive UI for managing and tracking job applications in real time.

- Features:
  - Authentication system
    - Secure user registration and login
    - bcypt password hashing system
    - session-only based authentication using cookies
  - Application management
    - Add, view, and delete job applications
    - Update application status (Applied, Interviewed, Rejected, Offer)
    - Track company, position, and optional salary
  - Persistent data
    - Data stored in MariaDB database
    - User only sees their own applications
  - Responsive UI
    - Build with Tailwind CSS
  - API-Driven Architecture
    - RESTful API routes using Next.js App Router
    - CRUD operations for applications and authentication

  - Tech Stack:
    - Frontend: React, Tailwind CSS, Next.js (App Router), TypeScript
    - Backend: Next.js API routes
    - Database: MariaDB (Railway)
    - Authentication: bcrypt and session cookies
    - Deployment: Vercel
