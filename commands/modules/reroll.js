const { SlashCommandBuilder } = require('@discordjs/builders');
const { handleReverseCommand } = require('../../imageSender');

// THIS IS A POWERFUL COMMAND! I SUGGEST MAKING IT REQUIRE A ROLE TO EXECUTE

module.exports = {
  data: new SlashCommandBuilder()
	.setName('reroll')
	.setDescription('Invalidate the current unclaimed image (if there is one) and refresh the onboarding of an image'),
  async execute(interaction) {
	await handleReverseCommand(interaction);
  }
};