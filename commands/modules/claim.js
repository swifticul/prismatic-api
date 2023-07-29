const { SlashCommandBuilder } = require('@discordjs/builders');
const { handleClaimCommand } = require('../../imageSender');
const Enmap = require('enmap');

// Create an Enmap to store user cooldown timestamps.
const userCooldowns = new Enmap();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('claim')
		.setDescription('Claim the current ghandi and add it to your inventory'),
	async execute(interaction) {
		// Get the user's ID.
		const userId = interaction.user.id;

		// Check if the user is on cooldown (the cooldown is set to 10 seconds, in milliseconds).
		if (userCooldowns.has(userId)) {
			await interaction.reply("ERROR: Cooldown in effect");
			return;
		}

		// Execute the claim command for the user.
		await handleClaimCommand(interaction);

		// Add the user to the cooldown list with the current timestamp.
		userCooldowns.set(userId, Date.now());

		// Set a timeout to remove the user from the cooldown list after 3 seconds.
		setTimeout(() => userCooldowns.delete(userId), 3000);
	}
};