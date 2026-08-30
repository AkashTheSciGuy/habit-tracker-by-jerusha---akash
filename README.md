# Habit Tracker - https://habit-tracker-by-a-j.netlify.app/

A simple, modern habit-tracking web application built as a collaborative
project by Akash V and Jerusha Jutike.

The project was designed around one idea: make habit tracking simple
enough to use every day while still giving the interface a polished,
modern feel.

------------------------------------------------------------------------

## Project Overview

The Habit Tracker allows users to:

-   Create personal habits
-   Track daily completion
-   View the current streak for each habit
-   Open a detailed view of a habit
-   View completion information through a yearly calendar
-   Delete habits
-   Prevent duplicate habit names
-   Stay logged in when the page is refreshed
-   Sign up and log in using email authentication
-   Switch between light mode and dark mode
-   Use the application on desktop and mobile devices (Currently only the website is available to use, The mobile app is still in development)

The interface uses a **glassmorphism / Apple-inspired design**, with
translucent cards, blur effects, gradients, soft shadows, animations(The animations are a bit scuffed but it works :),
and responsive layouts.

------------------------------------------------------------------------

## Team

### Jerusha David Jutike.

Worked on the overall application development, functionality, interface
implementation, debugging, testing, and integration.

### Akash Ashok Vishwakarma

Worked collaboratively on the project development, testing, UI/UX
decisions, implementation, debugging, and overall refinement of the
application.

> This project was developed collaboratively. Both contributors
> participated in building, improving, testing, and finalizing the
> application.

------------------------------------------------------------------------

## Main Features

### 1. User Authentication

The application uses **Supabase Authentication**.

Users can:

-   Create an account
-   Log in
-   Log out
-   Verify their email address (This is disabled because Supabase only allows 2 Emails per hour for verification)
-   Remain signed in after refreshing the page

Authentication allows each user's habits to remain associated with their
own account, The user can also open the website on their phone browser and access it.

------------------------------------------------------------------------

### 2. Habit Creation

Users can enter a habit name and click **Add Habit**.

The application also supports:

-   Pressing **Enter** to add a habit
-   Preventing empty habit names
-   Preventing duplicate habit names
-   Habit name character limit is 45 Alphabets

This keeps the habit list clean and avoids accidentally creating
multiple cards for the same habit.

------------------------------------------------------------------------

### 3. Daily Habit Completion

Each habit is represented by a glass-style card.

The card displays:

-   Habit name
-   Today's completion status
-   Completion count
-   "Tap to complete" interaction
-   Current streak
-   Details button
-   Delete button

Clicking the completion area records the habit as completed for the
current day.

------------------------------------------------------------------------

### 4. Streak Tracking

The application calculates the user's current streak based on
consecutive completed days.

This provides users with immediate feedback about their consistency.

------------------------------------------------------------------------

### 5. Habit Details

Every habit has a **Details** page.

The details view provides additional information about the habit and its
completion history.

It includes:

-   Habit statistics
-   Completion information
-   Yearly calendar
-   Completed days
-   Incomplete days
-   Future days
-   Highlighting for the current day

The details page was kept separate from the main dashboard so that the
home screen stays simple.

------------------------------------------------------------------------

### 6. Yearly Calendar

The habit details page contains a calendar covering the year.

Days are visually separated into states such as:

-   Completed
-   Incomplete
-   Future
-   Today

This gives the user a quick visual representation of their consistency
throughout the year.

------------------------------------------------------------------------

### 7. Light and Dark Mode

The application supports both:

-   Light mode
-   Dark mode

The dark mode was specifically styled to preserve the glassmorphism
aesthetic while maintaining readable text and controls.

We tried to keep the dark mode same as the apple's glassmorphism theme.

------------------------------------------------------------------------

### 8. Responsive Design

The interface adapts to different screen sizes.

On smaller screens:

-   Habit cards become single-column
-   The add-habit form becomes vertical
-   Buttons become easier to tap
-   Calendar layouts adapt to available width
-   Typography and spacing are adjusted

The goal was to keep the application usable on both computers and
phones.

------------------------------------------------------------------------

## Design

The visual design is inspired by modern Apple/macOS interfaces.

The project uses:

-   Glassmorphism
-   Transparent surfaces
-   `backdrop-filter` blur
-   Soft gradients
-   Rounded corners
-   Subtle borders
-   Soft shadows
-   Glass highlights
-   Hover animations
-   Completion animations
-   Dark-mode glass effects

The design was refined iteratively rather than being created all at
once.

We experimented with spacing, card sizes, colors, shadows, typography,
and alignment until the dashboard felt clean and consistent.

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   HTML5
-   CSS3
-   JavaScript

### Backend / Database

-   Supabase
-   Supabase Authentication
-   Supabase Database

### Deployment / Version Control

-   Git
-   GitHub

------------------------------------------------------------------------

## How the Application Works

The general flow is:

``` text
User
  |
  v
Authentication
  |
  v
Habit Dashboard
  |
  +----> Create Habit
  |
  +----> Complete Habit
  |
  +----> View Streak
  |
  +----> View Details
  |          |
  |          v
  |      Yearly Calendar
  |
  +----> Delete Habit
```

User-specific data is stored through Supabase so that authenticated
users can access their own habits.

------------------------------------------------------------------------

## Development Process

The project was developed incrementally.

### Phase 1 --- Basic Habit Tracker

We started with the basic concept:

-   Add a habit
-   Display the habit as a card
-   Mark the habit as complete
-   Delete the habit

### Phase 2 --- Habit Management

We improved the basic tracker by adding:

-   Duplicate habit prevention
-   Enter-key submission
-   Better card organization
-   Improved interaction

### Phase 3 --- Visual Design

The interface was redesigned around a glassmorphism style.

We added:

-   Glass cards
-   Gradients
-   Blur
-   Shadows
-   Rounded corners
-   Hover effects
-   Completion animations

### Phase 4 --- Authentication

Supabase Authentication was introduced so users could have individual
accounts.

We added:

-   Sign up
-   Login
-   Logout
-   Email verification
-   Persistent sessions

### Phase 5 --- Data Persistence

The application was connected to Supabase so that habit data could
persist rather than disappearing when the page was refreshed.

### Phase 6 --- Dark Mode

A complete dark-mode visual system was added, including:

-   Dark backgrounds
-   Dark glass cards
-   Adjusted borders
-   Adjusted shadows
-   Readable text colors
-   Dark-mode controls

### Phase 7 --- Habit Details

A dedicated details view was added with:

-   Habit statistics
-   Completion information
-   Yearly calendar
-   Daily completion states

### Phase 8 --- Responsive Refinement

The application was tested and adjusted for smaller screens.

### Phase 9 --- Final UI Refinement

The final stage focused on small visual problems such as:

-   Card alignment
-   Title spacing
-   Consistent vertical positioning
-   Button placement
-   Readability
-   Overall visual consistency

------------------------------------------------------------------------

## Important Security Note

The frontend uses a **Supabase publishable/anonymous key** to
communicate with Supabase. This type of public client key is designed to
be used in frontend applications.

However, database security must still be enforced using **Supabase Row
Level Security (RLS)** and appropriate policies.

### Never commit these to GitHub:

-   Supabase service-role keys
-   Private API keys
-   Server passwords
-   Database passwords
-   Other secret credentials

If the project contains sensitive credentials, move them into
environment variables before publishing the repository.

For example:

``` env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Do not commit a real `.env` file containing secrets.

------------------------------------------------------------------------

## Suggested Project Structure

A simple structure for the repository could be:

``` text
habit-tracker/
│
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

If the project contains additional files, folders, images, or
configuration files, keep them organized according to their purpose.

------------------------------------------------------------------------

## Running the Project Locally

### 1. Clone the repository

``` bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
```

### 2. Open the project

You can open the HTML file directly for a simple static setup, or use a
local development server such as VS Code's Live Server extension.

### 3. Configure Supabase

Make sure the application has the correct Supabase project URL and
publishable key configured.

### 4. Run the application

Open the application in a browser and test:

-   Sign up
-   Email verification
-   Login
-   Creating habits
-   Completing habits
-   Refreshing the page
-   Viewing details
-   Dark mode
-   Deleting habits

------------------------------------------------------------------------

## GitHub Collaboration

Because this project was developed by two people, the recommended setup
is to keep **one GitHub repository** and add both contributors to it.

### Recommended workflow

``` text
GitHub Repository
       |
       +---- Your branch
       |
       +---- Jerusha's branch
```

Each person can work on their own branch and merge finished work into
`main`.

For example:

``` text
main
├── akash-development
└── jerusha-development
```

This reduces the chance of accidentally overwriting each other's work.

------------------------------------------------------------------------

## Credits

**Habit Tracker**

Developed collaboratively by:

-   **Jerusha**
-   **Akash**

Built with HTML, CSS, JavaScript, and Supabase.

The project focuses on simplicity, consistency, and a polished user
experience.

------------------------------------------------------------------------

## Future Improvements

Possible future additions include:

-   Habit editing
-   Weekly/monthly statistics
-   Custom habit colors
-   Habit categories
-   Reminders
-   More detailed analytics
-   Progressive Web App (PWA) support
-   Offline support
-   Accessibility improvements
-   Custom themes

These features were intentionally left out of the current version to
keep the application focused and simple.

------------------------------------------------------------------------

## License

This project is currently a personal/academic collaborative project.

If you want others to reuse or modify the code, consider adding an
open-source license such as the MIT License.
