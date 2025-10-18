# The Cupping Room (an events platform)

[The Cupping Room](https://the-cupping-room.vercel.app/) is a web application for a coffee shop to host and manage coffee events.

## Features

### For customers

-   View a list of upcoming coffee cupping events
-   Sign up for events
-   Add events to Google Calendar
-   Cancel event signups if needed
-   Manage their profile: update name, email, or password

### For staff

In addition to the above:

-   Create, edit, or delete events
-   View the list of users who signed up for each event

## Getting started

Follow these steps to run The Cupping Room on your own computer.

### Prerequisites

Before running the project, make sure you have the following software installed on your computer.
On macOS, you can use [Homebrew](https://brew.sh/), a command-line based package manager, to install the required software.

-   Git (to clone the project repository)
    -   Download and install from https://git-scm.com/
    -   Or install with Homebrew:
        ```
        brew install git
        ```
-   Node.js (version 22 or higher)
    -   Download and install from https://nodejs.org
    -   Or install with Homebrew:
        ```sh
        brew install node
        ```
-   PostgreSQL (version 17 or higher)
    -   Download and install from https://www.postgresql.org/download/
    -   Or install with Homebrew:
        ```
        brew install postgresql@17
        brew link postgresql@17 --force
        ```
-   Optional: A code editor like [VS Code](https://code.visualstudio.com/)
    -   Not required, but will make it easier to see and edit the files

### Download the project

-   From your Terminal, clone the Git repository
    ```
    git clone https://github.com/jen-jim/events-platform.git
    ```
-   Alternatively, you can also click the green "Code" button and select Download ZIP to download a ZIP file with the project.
-   Open the folder in your code editor (optional).

### Install project dependencies

The project uses Node.js packages. To install them:

-   Open the terminal (or command prompt) in the project folder.
-   Run:
    ```
    npm install
    ```

This downloads all the necessary files and libraries the app needs.

### Create environment file

This file will hold variables that are necessary for running the app.

-   Create a new file in the events-platform folder (root folder) named `.env`
-   Copy and paste the following into your `.env` file
    ```
    STAFF_REG_KEY="pinkbourbon"
    ```
    The value of `STAFF_REG_KEY` will be what staff members need to enter when registering for a staff account.

### Configure the database

The app uses a database to store events, users, and signups.
To set up a pre-populated database locally:

-   Make sure you have PostgreSQL running locally.
-   In the terminal, run:
    ```
    npm run setup-db
    ```
-   When this command finishes, it will give you a `DATABASE_URL` variable that should look something like:
    ```
    DATABASE_URL="postgresql://localuser:password@localhost:5432/cupping_room?schema=public"
    ```
    Paste this line into the `.env` file.

### Run the app locally

-   In the terminal, run:
    ```
    npm start
    ```
-   Open your browser and go to http://localhost:3000

You should see the home page of the app.

![Homepage screenshot](public/home.png)

![Profile page screenshot](public/profile.png)
