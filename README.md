# The Cupping Room (an events platform)

**The Cupping Room** is an events platform web application themed around coffee cupping events.
Customers can view and sign up for events, and staff can create and manage events.

Live demo: https://the-cupping-room.vercel.app/

---

## Features

### For customers

-   View a list of coffee cupping events
-   Sign up for events
-   Add events to Google Calendar
-   Cancel event signups
-   Update profile (name, email, password)

### For staff

In addition to the above:

-   Create, edit, or delete events
-   View the list of users who signed up for each event

Here are some test accounts already in the database to log in with:

| Email                 | Password | Role  |
| --------------------- | -------- | ----- |
| staff@cuppingroom.com | coldbrew | staff |
| user@cuppingroom.com  | coldbrew | user  |

---

## Getting started

Follow these exact steps to run the app on your computer.

### 1. Install tools

If you do not already have these programs, install them.

-   **Node.js** (version 22 or higher): https://nodejs.org
-   **PostgreSQL** (version 17 or higher): https://www.postgresql.org/download/
-   (Optional) A code editor like **VS Code**: https://code.visualstudio.com/
    -   Not required, but will make it easier to see and edit the files

On macOS, you can use [Homebrew](https://brew.sh/), a command-line based package manager, to install the required software from your Terminal.

```bash
brew install node
brew install postgresql@17
brew link postgresql@17 --force
```

### 2. Download the project

**Download ZIP**

-   Open the GitHub repository in your browser: https://github.com/jen-jim/events-platform
-   Click the green **Code** button, then **Download ZIP**
-   Unzip the file and open the folder in your code editor

Alternatively, **clone with Git**

-   If you are familiar with Git, open a terminal and run:
    ```
    git clone https://github.com/jen-jim/events-platform.git
    cd events-platform
    ```

### 3. Install the app's dependencies

-   Open the project folder in the terminal and run:
    ```
    npm install
    ```

### 4. Set up the local database

The app uses a database to store events, users, and signups.
To automate database setup and import sample data:

-   Make sure you have PostgreSQL running
-   In the terminal, run:
    ```
    npm run setup-db
    ```

What this does:

-   creates a local database called `cupping_room`
-   creates a database user `cupping_client`
-   imports the sample data (events, users, signups)

When the command finishes, it will print a line like this:

```bash
DATABASE_URL="postgresql://localuser:password@localhost:5432/cupping_room?schema=public"
```

Copy that exact line in the next step.

### 5. Create the `.env` file

This file will hold environment variables that are necessary for running the app.

-   In the project folder, create a file named `.env`
-   Paste the `DATABASE_URL` line copied in the previous step
-   Then, paste these lines:
    ```bash
    STAFF_REG_KEY="pinkbourbon"
    JWT_SECRET="change_this_to_a_long_random_value"
    ```
-   Save the file

The `STAFF_REG_KEY` value will be what staff members need to enter when registering for a staff account.
The `JWT_SECRET` value will be used to generate tokens for secure authorization. Change it to a long random value.

### 6. Start the app

-   In the terminal, run:
    ```
    npm start
    ```
-   Open your browser to http://localhost:3000

You should see the home page of the app

![Homepage screenshot](docs/screenshots/home.png)

![Profile page screenshot](docs/screenshots/profile.png)

---

## Troubleshooting

-   **`npm run setup-db` fails with permission errors** — make sure PostgreSQL is installed and running. On macOS, start the Postgres app, or run `brew services start postgresql@17`.
-   **Database connection errors** — check that `DATABASE_URL` in `.env` matches the printed value from the setup-db script, and that PostgreSQL is running.

---

## Where to find things in the project

-   `src/` - frontend application (React + TypeScript)
-   `api/` - backend API endpoints
-   `prisma/` - database schema and migrations

---

## Deployment

The app is designed to be hosted on **Vercel**, and a managed PostgreSQL like **Neon** for the database.

---

## Support

If something goes wrong, please open a GitHub issue or contact me.
