# CVWO Winter Assignment (Movie Web Forum)

## About
Created by Shane Arkar Kyaw

This is my NUS Computing for Voluntery Welfare Organisations(CVWO) Winter Assignment project and this is my first time using React as a frontend and Go as a backend.

Click [here](https://cvwo-assignment-c89r.onrender.com/) to access the deployed page.

## Features
- Create an account with your username and email
- Find your favorite Marvel Movie and discuss/review it (more movies to be added in the future)
- Click on your favorite movie to add posts and add reviews
- Upvote/downvote other user posts
- Search for posts related to the genres you like
- See your own posts and reviews in your profile page and choose to edit/delete it
  
## Setting up locally (NOT RECOMMENDED)
### Use deployed page above if possible
### 1. Supabase account created
#### - I have created a new database for local deployment
#### - The supabase API keys below are not for the deployed site
### 2. Clone the repository
### 3. Set up .env files
#### Add a .env file in frontend and backend
#### Fill the frontend .env files with these key value pairs
- VITE_SUPABASE_URL=https://otcodxdsncaqlqnifhhz.supabase.co (get this info from supabase)
- VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90Y29keGRzbmNhcWxxbmlmaGh6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzg4MTAzNSwiZXhwIjoyMDUzNDU3MDM1fQ.jFeISfQrzXuxWINJ611FKb6RPaSRvSNPKE1rgxDZqbQ 
- VITE_SERVER_API_URL=http://localhost:8080 (or whichever port u choose to run backend on)
#### Fill the backend .env files with these key value pairs
- DB_URL=postgresql://postgres.otcodxdsncaqlqnifhhz:@CVWO_Assignment@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres
- OMDB_API_KEY=a4448964
- SUPABASE_JWT_SECRET=qK+wYGO9iU0OUuZWxee0fL+1tlK2t7X7WiKLB/67EQyj4K08UcXmjOe16kg4GPXlM8y57MAJBCEDMCgXwzQuwA==
### 4. Start frontend and backend servers
#### - cd into the frontend folder and type "npm run dev"
#### - cd into the backend folder and type "go run main.go"
