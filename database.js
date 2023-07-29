const Enmap = require('enmap');
const config = require('./config.json');

// Create a new Enmap instance for the users database
const users = new Enmap({ name: 'users' });

// Define a default object for new users
const defaultUser = {
	images: []
};

// Function to get or create a user in the database
function getUser(id) {
	// Ensure the user exists in the database
	users.ensure(id, defaultUser);

	// Return the user data
	return users.get(id);
}

// Function to add an item to a user's inventory
function addItemToInventory(id, item) {
  // Get the user data
  const userData = getUser(id);

  // Add the item to the user's inventory
  userData.images.push(item);

  // Save the updated user data
  users.set(id, userData);
}

function removeItemFromInventory(id, item) {
  // Get the user data
  const userData = getUser(id);

  // Find the index of the item in the user's inventory
  const itemIndex = userData.images.findIndex((prismaticImage) => prismaticImage === item);

  // If the item is found, remove it from the inventory
  if (itemIndex !== -1) {
	userData.images.splice(itemIndex, 1);

	// Save the updated user data
	users.set(id, userData);
  }
}

function updateUser(userId, userData) {
	// Update the user's data in the enmap database
	// Replace `myEnmap` with the name of your enmap instance
	users.set(userId, userData);
}

function sleep(milliseconds) {
const date = Date.now();
let currentDate = null;
do {
  currentDate = Date.now();
} while (currentDate - date < milliseconds);
}

// Export the functions and database instance
module.exports = {
	users,
	getUser,
	addItemToInventory,
	removeItemFromInventory,
	updateUser,
	sleep,
};