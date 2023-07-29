# Prismatic API

![Warranty Disclaimer Gandhi](IMG_0758.gif)

**READ:**
This project is provided as-is, without any warranty or guarantee. The user assumes all risks and responsibilities for its usage. I and contributors will not be held liable for any damages or issues caused by the use of this software. THROUGHOURLY read this entire README before asking me questions.

## Installation

### Step 1: Clone the Source Code

1. Open your web browser and go to the Prismatic API GitHub repository: https://github.com/swifticul/prismatic-api

2. Click on the green "Code" button located near the top-right of the repository page.

3. Click on "Download ZIP" from the dropdown menu. This will download the source code as a ZIP file to your computer.

4. Extract the ZIP file to a location where you can easily access it, like your "Documents" or "Downloads" folder. Once extracted, you'll have a folder named `prismatic-api-master`.

### Step 2: Install Node.js/npm

1. Open your web browser and go to the official Node.js website: https://nodejs.org/en

2. Download the Node.js installer for your operating system (Windows, macOS, or Linux).

3. Run the Node.js installer and follow the installation wizard's instructions. You can use the default settings for most options.

### Step 3: Navigate to the Cloned Folder

1. Open a terminal or command prompt on your computer.

2. Use the `cd` (change directory) command to navigate to the newly cloned folder `prismatic-api-master`. For example, if you extracted the ZIP file to your "Downloads" folder on Windows, use the following command:

   ```
   cd C:\Users\YourUserName\Downloads\prismatic-api-master
   ```

   On macOS or Linux, you can navigate to the "Downloads" folder using:

   ```
   cd ~/Downloads/prismatic-api-master
   ```

### Step 4: Install Prismatic API dependencies

1. In the previously opened terminal or command prompt window, run the following command within the cloned folder to initialize the project and create a `package.json` file:

   ```
   npm init -y
   ```

2. Next, run the following commands one by one while still located in the folder to install the required dependencies:

   ```
   npm install discord.js
   npm install axios
   npm install enmap
   ```

   These commands will download and install the necessary packages for your bot to work.

## Deployment

### Step 1: Create a Discord bot application
For this step, I suggest you follow these 2 tutorials:

https://discordjs.guide/preparations/setting-up-a-bot-application.html
https://discordjs.guide/preparations/adding-your-bot-to-servers.html

Your Discord bot must have administrator privileges and must already be in your Discord server by the time you follow the next step.

### Step 2: Replace default values
1. Throughout the files in the root directory, you'll see values like "CHANNEL ID HERE" and "ROLE ID HERE". Please replace those values with the Channel IDs and Role IDs of your liking (You can search how to get these from your own server)
2. Open the "config.json" file, and replace all values with the correct replacements (You should get these values from your bot in https://discord.com/developers/ and the "guild ID" is your own Discord server's ID).

### Step 3: Run your bot
Open a terminal/command prompt in your bot's directory, and run the following two commands:
```
node deploy-commands.js
node index.js
```

As long as you keep the window open, your bot will be active. You will have to run these commands every time you want to start up your bot again.











