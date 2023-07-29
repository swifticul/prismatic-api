const { SlashCommandBuilder } = require('discord.js');
const { getUser } = require('../../database');
const { images } = require('../../imageSender');

module.exports = {
  data: new SlashCommandBuilder()
	.setName('inventory')
	.setDescription('Sends a generated list of all the images you own!')
	.addIntegerOption(option =>
	  option.setName('page')
		.setDescription('Specify the page number to view')
		.setRequired(true)
	)
	.addUserOption(option =>
	  option.setName('peek')
		.setDescription('Select a user to view their directory')
		.setRequired(false)
	)
	.addIntegerOption(option =>
	  option.setName('view')
		.setDescription('View a specific ghandi by its index')
		.setRequired(false)
	),
  async execute(interaction) {
	// Get user data from the database
	const userId = interaction.options.getUser('peek')?.id || interaction.user.id;
	const userData = getUser(userId);

	// Get the username of the user executing the command
	const commandUser = interaction.user;
	const commandUsername = commandUser.username;

	// Get the username of the user whose inventory is being viewed
	const targetUser = userId === interaction.user.id ? commandUser : await interaction.client.users.fetch(userId.replace(/[^\d]/g, ''));
	const targetUsername = targetUser.username;

	// Sort images by set name (text within parentheses)
	const sortedImages = userData.images.sort((a, b) => {
	  const setNameA = a.match(/\((.*?)\)/)[1].toLowerCase();
	  const setNameB = b.match(/\((.*?)\)/)[1].toLowerCase();
	  return setNameA.localeCompare(setNameB);
	});

	// Define the number of images to display per page
	const imagesPerPage = 10;

	// Get the page number from the user's input or default to page 1
	const page = interaction.options.getInteger('page') || 1;

	// Calculate the start and end indexes for the images to display on the current page
	const startIndex = (page - 1) * imagesPerPage;
	const endIndex = startIndex + imagesPerPage;

	// Check if a specific image index is requested
	const viewIndex = interaction.options.getInteger('view');

	if (viewIndex) {
	  // Check if the requested index is valid
	  if (viewIndex <= 0 || viewIndex > sortedImages.length) {
		await interaction.reply('Invalid ghandi index.');
		return;
	  }

	  const imageTitle = sortedImages[viewIndex - 1];
	  const imageImage = images.find((image) => image.title === imageTitle);

	  // Check if the user owns the requested image
	  if (!imageImage) {
		await interaction.reply('You do not own this image.');
		return;
	  }

	  // Create an embed for the requested image
	  const imageEmbed = {
		title: imageTitle,
		image: { url: imageImage.url },
		footer: {
		  text: `Owned by: ${targetUsername}`,
		  icon_url: targetUser.avatarURL(),
		},
	  };

	  await interaction.reply({ embeds: [imageEmbed] });
	  return;
	}

	// Get the images for the current page
	const imagesOnPage = sortedImages.slice(startIndex, endIndex);

	// Create an array to store inventory entries
	const inventoryEntries = [];

	// Populate inventory entries with download hyperlinks and identifiers for images on the current page
	for (let i = 0; i < imagesOnPage.length; i++) {
	  const title = imagesOnPage[i];
	  const image = images.find((image) => image.title === title);
	  const downloadLink = `[(Download this image)](${image.url})`;
	  const identifier = `#${startIndex + i + 1}`;
	  inventoryEntries.push(`${identifier} - ${title} ${downloadLink}`);
	}

	// Get the total number of images/images owned
	const totalImages = sortedImages.length;

	// Calculate the total number of pages based on the images per page
	const totalPages = Math.ceil(totalImages / imagesPerPage);

	// Create embed object
	const embed = {
	  title: `${targetUsername}'s images (Page ${page}/${totalPages})`,
	  description: totalImages > 0
		? inventoryEntries.join('\n')
		: 'No images in sight here.',
	  footer: {
		text: `Total images: ${totalImages}`,
	  },
	};

	// Add a thumbnail if the user has any images in their inventory
	if (totalImages > 0) {
	  // Get the first image on the current page
	  const firstImageTitle = imagesOnPage[0];
	  const firstImage = images.find((image) => image.title === firstImageTitle);

	  // Set the embed thumbnail to the first image
	  embed.thumbnail = { url: firstImage.url };
	}

	// Add interaction options for navigating to the previous and next pages
	if (totalPages > 1) {
	  // Show "Previous" button if not on the first page
	  if (page > 1) {
		embed.footer.text += ' | ';
		embed.footer.icon_url = commandUser.avatarURL();
		embed.footer.icon_width = 16;
		embed.footer.icon_height = 16;
		embed.footer.text += '◀️ Previous';
	  }

	  // Show "Next" button if not on the last page
	  if (page < totalPages) {
		embed.footer.text += ' | ';
		embed.footer.icon_url = commandUser.avatarURL();
		embed.footer.icon_width = 16;
		embed.footer.icon_height = 16;
		embed.footer.text += 'Next ▶️';
	  }
	}

	// Send embed
	await interaction.reply({ embeds: [embed] });
  },
};