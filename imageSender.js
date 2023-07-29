const { MessageEmbed, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { getUser, addItemToInventory, sleep } = require('./database');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Define an array of images with rarities (there has to be at least 1 unit in every rarity)
const images = [
  { title: 'Dora (Davidtastic Set)', url: 'https://cdn.discordapp.com/attachments/1117401708662898820/1134567461153411092/Dora2.png', rarity: 'Cool Common Unit' },
  { title: 'Bubble David (Davidtastic Set)', url: 'https://cdn.discordapp.com/attachments/1117401708662898820/1134567579722199060/BubbleDavid.png', rarity: 'Pretty Rare Unit' },
  { title: 'David Land (Davidtastic Set)', url: 'https://cdn.discordapp.com/attachments/1117401708662898820/1134567200989130813/Davidland.png', rarity: 'SUPER ULTRA UNIT' },
]

// Define the chances for each rarity (all the numbers together have to round out to 1)
const rarityChances = {
  'Cool Common Unit': 0.60,
  'Pretty Rare Unit': 0.30,
  'SUPER ULTRA UNIT': 0.10,
};

// Define a variable to hold the current image
let currentImage = null;
let grabbable = false;

// Function to send a new image message
// Function to send a new image message
function sendImageMessage(client) {
  
  console.log('Sending new image...');
  
  const channel = client.channels.cache.get('CHANNEL ID HERE');
  if (channel) {
	console.log(`Sending embed in channel: ${channel.name}`);
	grabbable = false;
  } else {
	console.log('Channel not found!');
  };

  // Get a random image based on rarity
  const rarity = getRandomRarity();
  const filteredImages = images.filter(image => image.rarity === rarity);
  currentImage = filteredImages[Math.floor(Math.random() * filteredImages.length)];
  console.log(`Selected image: ${currentImage.title}`);

  // Create embed object
  const embed = new EmbedBuilder()
  .setTitle(`[${rarity}] ${currentImage.title}`)
  .setDescription(`Insert your custom \`/claim\` message here!`);
  
  console.log(currentImage.url)
  
  axios({
	method: 'GET',
	url: currentImage.url,
	responseType: 'arraybuffer',
  })
	.then(response => {
	// Create a buffer from the downloaded file
	const fileBuffer = Buffer.from(response.data, 'binary');
	
	// Determine the file extension from the URL
	const fileExtension = path.extname(currentImage.url);
	
	// Create the 'temp' directory if it doesn't exist
	const tempDir = './temp';
	if (!fs.existsSync(tempDir)) {
	  fs.mkdirSync(tempDir);
	}
	
	// Create a temporary file path
	const tempFilePath = path.join(tempDir, `file${fileExtension}`);
	fs.writeFileSync(tempFilePath, fileBuffer);
	
	// Create the attachment from the temporary file
	const attachment = new AttachmentBuilder(tempFilePath);
  
	  // Configure the message content
	  const messageOptions = {
		embeds: [embed],
		files: [attachment],
	  };
  
	  // Send the message
	  const channel = client.channels.cache.get('CHANNEL ID HERE');
	  if (channel) {
		console.log(`Sending embed in channel: ${channel.name}`);
		channel.send(messageOptions)
		.catch(console.error)
		.finally(() => {
		  channel.send(`<@&ROLE ID HERE> A new image has been deployed.`);
		  fs.unlinkSync(tempFilePath);
		  grabbable = true;
		});
	  } else {
		console.log('Channel not found!');
	  };
	})
	.catch(error => {
	  console.error('Error downloading file:', error);
	});
}

// Function to get a random rarity based on chances
function getRandomRarity() {
  const random = Math.random();
  let cumulativeChance = 0;

  for (const rarity in rarityChances) {
	cumulativeChance += rarityChances[rarity];
	if (random <= cumulativeChance) {
	  return rarity;
	}
  }

  return null; // Default to null if no rarity is found (shouldn't happen)
}

async function handleClaimCommand(interaction, client) {
  console.log(`Handling /claim command from user: ${interaction.user.username}`);

  // Check if there is a current image
  
  if (!currentImage) {
	console.log('No current image available');
	await interaction.reply('No image available!');
	return;
  }

  // Get the user data from the database
  const userData = getUser(interaction.user.id);

  // Check if the user already has the current image in their inventory
  if (userData.images.includes(currentImage.title)) {
	console.log('User already has current image in their inventory');
	await interaction.reply('You already have this image in your inventory. You cannot claim it again.');
	return;
  }

  if (!grabbable) {
	await interaction.reply('This image is not adoptable at this time. Maybe the image has yet to load?');
	return;
  }

  if (grabbable) {
        // Add the current image to the user's inventory
	console.log(`Adding current image to user's inventory: ${currentImage.title}`);
	
	addItemToInventory(interaction.user.id, currentImage.title);
	
	// Count the number of images in the user's inventory
	const userImagesCount = userData.images.length + 1; // Add +1 here
	
	// Send a confirmation message with the user's image count
	await interaction.reply(`### You have claimed "${currentImage.title}" and added it to your inventory! You now have a total of ${userImagesCount} image(s) in your inventory.`);
	
	grabbable = false;
  }
  
  // Clear the current image
  console.log('Clearing current image');
  currentImage = null;
}

async function handleReverseCommand(interaction) {
  console.log(`Handling /reroll command from user: ${interaction.user.username}`);

  // Invalidate the current unclaimed image
  console.log('Invalidating the current unclaimed image');
  currentImage = null;

  // Refresh the image sender
  sendImageMessage(interaction.client);
}

// Export the functions
module.exports = {
  sendImageMessage,
  handleClaimCommand,
  handleReverseCommand,
  images,
};