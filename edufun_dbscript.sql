-- funedudb Schema Creation Script

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
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_deck_card_count_trigger
AFTER INSERT OR DELETE OR UPDATE ON flashcards
FOR EACH ROW EXECUTE FUNCTION update_deck_card_count();

-- Add timestamp triggers to update 'updated_at' fields
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW() AT TIME ZONE 'UTC';
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

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


