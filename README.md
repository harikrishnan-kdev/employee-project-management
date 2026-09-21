# Employee & Project Management Application

A full-stack web application to manage employees and projects, and assign employees to projects.

## Tech Stack
- **Frontend**: React.js (Vite), Tailwind CSS, React Router
- **Backend**: NestJS, Neon cloud PostgreSQL
- **Language**: TypeScript

## Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

## Local Setup

### 1. Database Configuration
Create a PostgreSQL database named `employee_project_db`:
```sql
CREATE DATABASE employee_project_db;
```
Since this project does not use an ORM like TypeORM to automatically create tables, you must initialize the database schema manually. Run the provided `schema.sql` file against your new database to create the necessary tables.

Create a `.env` file in the `backend` directory and configure your database connection string:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/employee_project_db"
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run start:dev
\`\`\`
The backend will run at http://localhost:3000. 
Swagger API documentation is available at http://localhost:3000/api/docs.

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
The frontend will run at http://localhost:5173.

## Features
- **Dashboard**: Overview of total and active employees/projects.
- **Employee Management**: CRUD operations, search, pagination.
- **Project Management**: CRUD operations, filter by status.
- **Project Assignments**: Assign and remove employees to/from specific projects.

## Deployment to Vercel
1. Set up a cloud PostgreSQL database (e.g., Neon, Supabase, Vercel Postgres) and run the `schema.sql` file against it to create your tables.
2. Connect your repository to Vercel.
3. Configure the environment variables in the Vercel dashboard:
   - `DATABASE_URL`: Your cloud PostgreSQL connection string.
   - `VITE_API_URL`: `/api` (This ensures the frontend can reach the serverless backend).
4. Vercel will automatically build the frontend and deploy the backend as serverless functions (using `vercel.json`).

## Postman Collection / API Docs
- Swagger docs are auto-generated and can be accessed at `/api/docs` while the backend is running.
