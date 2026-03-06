# Backend built using supabase

## Features (WIP)

- User authentication (signup/login/logout)
- Data persistence with Row Level Security

## (Make sure these are installed)

- Node.js 18+
- Supabase account
- Git

## Install Dependencies in frontend and backend

- npm install

## Create .env file (exists locally)

- cd AdaptFitness/backend/
- touch .env
- copy and paste this into that file (url, anon-key, and service role will be provided through discord)
- # Supabase Configuration
    SUPABASE_URL=replaceThis
    SUPABASE_ANON_KEY=replaceThis
    SUPABASE_SERVICE_ROLE_KEY=replaceThis

## Test the database connection to see if eveeything works

- node test-connection.js
- node test-database.js

- You should see:
Supabase client created successfully!
Database connected!