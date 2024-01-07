# Build Instructions for EduFun

## Table of Contents

1. Introduction
2. Prerequisites
3. Setting Up the Database
4. Configuring the Backend
5. Building the Frontend
6. Additional Resources

## 1. Introduction

    Welcome to the documentation for EduFun, an interactive web application tailored for personalized learning experiences. EduFun enables users to create individual accounts, log in, and curate a custom learning environment. Users can generate their own study categories, known as "Decks," and within each Deck, create flashcards for effective spaced repetition learning. This methodology enhances the learning experience by allowing users to reinforce their knowledge over time. In addition, EduFun provides graphical insights into study progress.

    The application is developed using Node.js for the backend, with Angular powering the frontend, and Express as the server framework. PostgreSQL serves as the database system, ensuring robust data management. Additionally, we've integrated HighCharts to render the progress graphs, providing a visual representation of the user's learning trajectory.

## 2. Prerequisites

    - Node.js: Necessary for running the JavaScript runtime environment on the server side.
    - npm (Node Package Manager): Used to install and manage package dependencies for Node.js.
    - Angular CLI: A command-line interface tool for initializing, developing, scaffolding, and maintaining Angular applications.
    - PostgreSQL: An advanced open-source object-relational database system with SQL compliance and many features for safe and scalable data storage.
    - Highcharts: A modern charting library that allows for the visualization of data in interactive and intuitive graphical formats.

## 3. Setting Up the Database

    To recreate and verify the database setup, please follow the steps outlined below. These instructions assume that PostgreSQL is installed and running properly on your system.

    1. PostgreSQL Installation: Ensure that PostgreSQL is installed on your system and is functioning correctly.
    2. Database Creation: Create a new PostgreSQL database named funedudb.
    3. User Setup: Set up a new user with the username funedu and password 1234.
    4. Database Connection: Use the following connection string to connect to the PostgreSQL server:
       postgres://funedu:1234@localhost:5432/funedudb
    5. SQL Script Storage: Save the SQL script file sedufun_dbscript.sql to a suitable location on your computer.
    6. Executing the SQL Script: Open the Windows Command Prompt and execute the sedufun_dbscript.sql SQL script to create the database schema and triggers using the following command:
       C:\Users\tipss>psql -U postgres -d funedudb -f "C:\...your path...\edufun_dbscript.sql"
    7. Accessing the Database: Connect to the funedudb database with the following command:
       psql -U postgres -d funedudb
    8. Granting Permissions: Grant the user funedu the necessary permissions with the following commands:
       GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO funedu;
       GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO funedu;
       GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO funedu;

-- funedudb Schema Creation Script is as follows.

-- Drop existing tables if they exist (in reverse order of creation)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS study_sessions CASCADE;
DROP TABLE IF EXISTS flashcards CASCADE;
DROP TABLE IF EXISTS decks CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
id SERIAL PRIMARY KEY,
email VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Decks Table
CREATE TABLE decks (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
name VARCHAR(255) NOT NULL,
cardcount INTEGER DEFAULT 0,
description TEXT,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Flashcards Table
CREATE TABLE flashcards (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
deck_id INTEGER NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
front TEXT NOT NULL,
back TEXT NOT NULL,
easiness_factor FLOAT DEFAULT 2.5 CHECK (easiness_factor >= 1.3),
interval_days INTEGER DEFAULT 0,
repetitions INTEGER DEFAULT 0,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Study Sessions Table
CREATE TABLE study_sessions (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id),
start_time TIMESTAMP WITHOUT TIME ZONE NOT NULL,
end_time TIMESTAMP WITHOUT TIME ZONE,
created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC')
);

-- Reviews Table
CREATE TABLE reviews (
id SERIAL PRIMARY KEY,
flashcard_id INTEGER REFERENCES flashcards(id),
study_session_id INTEGER REFERENCES study_sessions(id),
performance_rating INTEGER NOT NULL CHECK (performance_rating >= 1 AND performance_rating <= 5),
review_time TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'UTC'),
next_review_date TIMESTAMP WITHOUT TIME ZONE,
interval_days INTEGER DEFAULT 0,
easiness_factor FLOAT DEFAULT 2.5 CHECK (easiness_factor >= 1.3),
repetitions INTEGER DEFAULT 0
);

CREATE OR REPLACE FUNCTION update_deck_card_count()
RETURNS TRIGGER AS $$
BEGIN
-- increase
IF TG_OP = 'INSERT' THEN
UPDATE decks SET cardcount = cardcount + 1 WHERE id = NEW.deck_id;
-- decrease
ELSIF TG_OP = 'DELETE' THEN
UPDATE decks SET cardcount = cardcount - 1 WHERE id = OLD.deck_id;
-- update
ELSIF TG_OP = 'UPDATE' AND NEW.deck_id <> OLD.deck_id THEN
UPDATE decks SET cardcount = cardcount - 1 WHERE id = OLD.deck_id;
UPDATE decks SET cardcount = cardcount + 1 WHERE id = NEW.deck_id;
END IF;
RETURN NEW;
END;

$$
LANGUAGE 'plpgsql';

CREATE TRIGGER update_deck_card_count_trigger
AFTER INSERT OR DELETE OR UPDATE ON flashcards
FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

-- Add timestamp triggers to update 'updated_at' fields
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS
$$

BEGIN
NEW.updated_at = NOW() AT TIME ZONE 'UTC';
RETURN NEW;
END;

$$
LANGUAGE 'plpgsql';

CREATE TRIGGER update_decks_modtime
    BEFORE UPDATE ON decks
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_flashcards_modtime
    BEFORE UPDATE ON flashcards
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_study_sessions_modtime
    BEFORE UPDATE ON study_sessions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_reviews_modtime
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();


## 4. Configuring the Backend
  To set up the backend environment for the EduFun application, please follow these steps:

  - Navigate to the Backend Directory:
    First, go to the backend directory located within our project:
     EduFun/backend-nodejs

  - Install Necessary Dependencies:
    Use npm (Node Package Manager) to install all required dependencies. In your terminal, execute the following command within the backend directory:
     npm install

  - Set Up the Environment Variables:
    Define the necessary environment variables. Set the database connection string and the port for the server. You can do this in an environment file or directly in your system. Here are the key variables:

    DB_CONNECTION_STRING=postgres://funedu:1234@localhost:5432/funedudb
    PORT=3000
   - Start the Backend Server:
     Launch the backend server by running the following command:
      node server.js

    This command starts the Express server on the specified port, which defaults to 3000.

## 5. Building the Frontend
    The following steps will guide you through installing dependencies and building the frontend part of the EduFun application:

    - Navigate to the Frontend Directory:
    First, access the frontend directory of the project:
    EduFun/frontend-angular

    - Install Highcharts:
      npm install highcharts

    - Install Dependencies:
    Use npm (Node Package Manager) to install all necessary dependencies for the frontend. In your terminal, run the following command within the frontend-angular directory:
     npm install

    - Start the Frontend Application:
    To launch the frontend part of the application, execute the following command:
     npm start
    This command compiles the Angular application and starts a development server.

    - Access the Application in a Browser:
    Once the build process is complete, the frontend will be accessible through your web browser. Simply open the following URL:
     http://localhost:4200/
    This URL will direct you to the local instance of your EduFun application running on port 4200.

## 6. Additional Resources
    If you have any inquiries or questions while running the EduFun project, please don't hesitate to reach out to me at jinyoung.ko@edu.devinci.fr. I will respond promptly to assist you.
$$
