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
