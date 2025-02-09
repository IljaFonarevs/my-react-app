Step 1: Install Node.js and npm

Vite requires Node.js to run. Follow these steps to install Node.js (which includes npm, the Node package manager):

Windows:

Download and install Node.js from Node.js official website.

During installation, ensure you select the option to install npm.

Verify installation by running the following command in Command Prompt (cmd) or PowerShell:

node -v
npm -v

macOS:

Open Terminal and install Homebrew if not already installed:

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

Install Node.js using Homebrew:

brew install node

Verify installation:

node -v
npm -v

Linux:

Open Terminal and install Node.js via package manager:

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

Verify installation:

node -v
npm -v

Step 2: Clone the Project Repository

Use Git to clone the project repository (if Git is not installed, refer to Step 3 below):

 git clone <repository-url>
 cd <project-folder>

Step 3: Install Git (If Not Installed)

If Git is not installed, install it using the following steps:

Windows:

Download and install Git from Git official website.

Verify installation:

git --version

macOS:

brew install git

Linux:

sudo apt install git

Step 4: Install Project Dependencies

Once inside the project folder, install dependencies using npm:

npm install

Step 5: Start the Development Server

To run the Vite development server, execute:

npm run dev

This will start the project and provide a local URL (e.g., http://localhost:5173/).
