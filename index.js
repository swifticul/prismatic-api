const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { sendImageMessage } = require('./imageSender');

// Function to delete .DS_Store files in a directory
function deleteDSStoreFiles(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
	const filePath = path.join(directory, file);
	if (file === '.DS_Store') {
	  console.log(`Deleting .DS_Store file: ${filePath}`);
	  fs.unlinkSync(filePath);
	} else if (fs.statSync(filePath).isDirectory()) {
	  deleteDSStoreFiles(filePath);
	}
  }
}

// Delete .DS_Store files in the commands directory
deleteDSStoreFiles(path.join(__dirname, 'commands'));

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
	  client.commands.set(command.data.name, command);
	} else {
	  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
  }
}

client.once(Events.ClientReady, async () => {
  console.log('Prismatic API');

  // Find the channel by ID where you want the startup message to be sent
  const channelId = 'CHANNEL ID HERE';
  const channel = client.channels.cache.get(channelId);

  if (!channel) {
	console.log(`[WARNING] Channel with ID ${channelId} not found.`);
	return;
  }

  try {
	// Send the startup message with the date and time in the specified channel
	await channel.send(`This bot has successfully been deployed!`);
  } catch (error) {
	console.error(error);
  }

  sendImageMessage(client);
  
  function repeatFunction() {
	
	  var min = 1200, max = 5400; // 20 minutes - 1.5 hours
	  var nextInterval = Math.floor(Math.random() * (max - min + 1) + min) * 1000; // Convert to milliseconds
	
	  console.log(nextInterval);
	  setTimeout(() => {
		sendImageMessage(client);
		repeatFunction(); // Call the function again to start the next cycle.
	  }, nextInterval);
  
};

repeatFunction(); // Initial call
	
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
	await command.execute(interaction);
  } catch (error) {
	console.error(error);
	if (interaction.replied || interaction.deferred) {
	  await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
	} else {
	  await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
  }
});

client.login(token);
