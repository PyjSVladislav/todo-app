# To-Do App

A production-level To-Do application built with Express, Postgres, Redis, React, Redux, and TypeScript.

## Prerequisites
- Node.js v20.x (LTS) installed
- npm v10.x or later installed

- TypeScript v5.6.x or later installed globally (`npm i -g typescript`)

- ts-node v10.9.x or later installed globally (`npm i -g ts-node`)

## Project Setup
- TypeScript configuration initialized in `tsconfig.json` for backend and frontend.

- Updated `tsconfig.json` with `target: ES6`, `module: commonjs`, `strict: true`, and additional settings for Node.js and React compatibility.

## Backend Setup
- Installed Express (`npm i express`) in `backend` directory.

- Added `tsconfig.json` in `backend` for TypeScript configuration, extending root config.

- Fixed TypeScript errors in `backend`: reinstalled `@types/express` and updated `src/index.ts` to resolve unused parameter warning.

- Added `GET /api/health` route in `backend/src/index.ts` for server health check.

- Added CRUD routes (`GET /api/todos`, `GET /api/todos/:id`, `POST /api/todos`, `PUT /api/todos/:id`, `DELETE /api/todos/:id`) in `backend/src/index.ts` using in-memory storage.

- Added PostgreSQL integration in `backend`: installed `pg`, created `todos` table, updated CRUD routes to use database.
