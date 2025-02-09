# React + TypeScript + Vite Project Setup Guide

This guide provides step-by-step instructions to set up and run this React + TypeScript + Vite project from scratch on a system with no pre-installed dependencies.

## Prerequisites

Before starting, ensure your system meets the following requirements:

- **Operating System**: Windows, macOS, or Linux
- **Internet Connection**: Required to download dependencies

## Step 1: Install Node.js and npm

Vite requires Node.js to run. Follow these steps to install Node.js (which includes npm, the Node package manager):

### Download:

1. Download and install Node.js from [Node.js official website](https://nodejs.org/).
2. During installation, ensure you select the option to install `npm`.
3. Verify installation by running the following command in Command Prompt (cmd) or PowerShell:
   ```sh
   node -v
   npm -v

## Step 2: Clone the Project Repository

Use Git to clone the project repository (if Git is not installed, refer to Step 3 below):

```sh
git clone https://github.com/IljaFonarevs/my-react-app.git
cd <project-folder>
```

## Step 3: Install Git (If Not Installed)

If Git is not installed on your system, follow the steps below to install it.

### Download:

1. Download Git from the [official Git website](https://git-scm.com/).
2. Run the installer and follow the setup instructions. Ensure you select the option to add Git to your system's PATH.
3. After installation, verify Git is installed by running the following command in Command Prompt (cmd) or PowerShell:
   ```sh
   git --version
   ```
## Step 4: Install Project Dependencies

Once you have cloned the repository and navigated into the project folder, you need to install the required dependencies.

Run the following command inside the project directory:

```sh
npm install
```

## Step 5: Start the Development Server

After installing the dependencies, you can start the Vite development server to run the project locally.

Run the following command:

```sh
npm run dev
```

## You're done!

