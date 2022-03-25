CREATE DATABASE enuhdatabase;
--connect to enuhdatabase
\c enuhdatabase;

--add uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--create users table
CREATE TABLE IF NOT EXISTS users (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email text UNIQUE,
    user_password text NOT NULL,
    avatar text
);

-- create art schema
-- DROP TABLE art_piece;
CREATE TABLE IF NOT EXISTS art_piece (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    art_desc text,
    file_path text NOT NULL
);
-- DROP TABLE article;
CREATE TABLE IF NOT EXISTS article (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    file_path text UNIQUE,
    date_of_publication date DEFAULT NOW(),
    authors text[],
    article_path text UNIQUE
);

--create scientific drawing table
-- DROP TABLE scientific_drawing;
CREATE TABLE IF NOT EXISTS scientific_drawing (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(50) UNIQUE,
    file_path text NOT NULL UNIQUE,
    image_desc text
);

--create a blog table
-- DROP TABLE  blog CASCADE;
CREATE TABLE IF NOT EXISTS blog (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_title text NOT NULL,
    file_path text NOT NULL,
    teaser VARCHAR(160) NOT NULL,
    post text NOT NULL,
    reads bigint DEFAULT 0,
    author uuid REFERENCES users (id),
    -- comments uuid[] REFERENCES comment [id] UNIQUE,
    date_posted timestamp DEFAULT CURRENT_TIMESTAMP
);
--creat comments table
-- DROP TABLE comment;
CREATE TABLE IF NOT EXISTS comment (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment text NOT NULL,
    date_commented timestamp DEFAULT CURRENT_TIMESTAMP,
    blog uuid REFERENCES blog (id)
);
--create a uploads table
-- DROP TABLE upload;
CREATE TABLE IF NOT EXISTS upload (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_name text NOT NULL,
    file_path text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS subscriber (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_of_subcriber text NOT NULL,
    email text NOT NULL UNIQUE,
    date_subscribed timestamp DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS notifn (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_message text NOT NULL,
    notification_subject text,
    file_path text,
    date_of_notification timestamp DEFAULT CURRENT_TIMESTAMP
);