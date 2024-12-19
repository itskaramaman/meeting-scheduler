# Meeting Scheduler

## Overview

Meeting Scheduler is a powerful and intuitive web application that allows users to manage their meetings efficiently. The app enables users to:

- Sign in using their Google account (OAuth).
- Set their availability for meetings.
- Create public and private events.
- Define a gap between meetings.
- Schedule meetings that automatically sync with Google Calendar for both the organizer and participants.
- Hold meetings via Google Meet.

## Features

1. **Google OAuth Integration**:

   - Securely log in using your Google account.

2. **Availability Management**:

   - Define your availability to control when meetings can be scheduled.

3. **Event Types**:

   - Create public events (accessible via a shared link).
   - Create private events (only accessible to invited participants).

4. **Meeting Gap Customization**:

   - Specify a time gap between consecutive meetings to avoid overlap.

5. **Google Calendar Sync**:

   - Meetings are automatically added to both the event creator's and participant's Google Calendar.

6. **Google Meet Integration**:
   - Automatically generate Google Meet links for scheduled meetings.

## Tech Stack

The application is built with the following technologies:

### Frontend:

- **Next.js (v14.2.20)**: React-based framework for server-side rendering and static site generation.
- **React (v18)**: JavaScript library for building user interfaces.
- **Tailwind CSS (v3.4.1)**: Utility-first CSS framework for styling.

### Backend:

- **Prisma (v6.0.1)**: ORM for database management.
- **Google APIs**: For Google Calendar and Google Meet integration.

### Other Libraries:

- **react-hook-form**: For managing forms.
- **zod**: For schema validation.
- **date-fns**: For date manipulation.

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd meeting-scheduler
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
   CLERK_SECRET_KEY=<your-clerk-secret>
   DATABASE_URL=<your-database-url>
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   ```

4. Set up the database:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## Usage

1. Log in using your Google account.
2. Set your availability for meetings.
3. Create public or private events.
4. Share the public event link with participants or invite specific people to private events.
5. Scheduled meetings will:
   - Be added to Google Calendar.
   - Include a Google Meet link for the meeting.

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run linting checks.
- `npm run postinstall`: Automatically generate Prisma client after dependencies installation.

### Acknowledgments

- Built with ❤️ using Next.js, Prisma, Tailwind CSS, and Google APIs.
