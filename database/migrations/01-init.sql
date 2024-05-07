-- +migrate Up

CREATE TYPE "todo_size" AS ENUM (
  'small',
  'medium',
  'big'
);

CREATE TABLE "users" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "pets" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" integer,
  "name" varchar,
  "xp" integer DEFAULT 0,
  "happiness" integer DEFAULT 0,
  "happiness_reduction_rate" integer DEFAULT 10,
  "happiness_last_updated" timestamptz DEFAULT (now()),
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "todos" (
  "id" INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  "user_id" integer,
  "title" varchar,
  "size" todo_size,
  "completed" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (now())
);

ALTER TABLE "pets" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "todos" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
