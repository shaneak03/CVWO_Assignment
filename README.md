# CVWO Winter Assignment (Movie Web Forum)

## About
Created by Shane Arkar Kyaw

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
### 1. Set up a supabase account 
#### - Create supabase account and start a new project
#### - Under authentication -> providers -> email -> confirm email(make sure its turned off)
### 3. Migrate DB
### 4. Clone the repository
### 5. Set up .env files
#### Add a .env file in frontend and backend
#### Fill the frontend .env files with these key value pairs
- VITE_SUPABASE_URL=SUPABASE_DB_URL (get this info from supabase)
- VITE_SUPABASE_ANON_KEY=SUPABASE_KEY (get this info from supabase, make sure its the secret key)
- VITE_SERVER_API_URL=http://localhost:8080 (or whichever port u choose to run backend on)
#### Fill the backend .env files with these key value pairs
- DB_URL=(session pooler link from supabase)
- OMDB_API_KEY=(can be generated from omdb website)
- SUPABASE_JWT_SECRET=(can be found as JWT Secret in supabase)
### 6. Start frontend and backend servers
#### - cd into the frontend folder and type "npm run dev"
#### - cd into the backend folder and type "go run main.go"
