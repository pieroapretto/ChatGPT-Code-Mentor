const readline = require('readline');

// Import methods supports by tectalicOpenai
const { chatCompletion } = require('./methods/chatGenerator.js');
const { generateImages } = require('./methods/imageGenerator.js');

// Create a readline interface for handling user input and output.
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Display a prompt to the user, indicating that they can enter input.
userInterface.prompt();

// Listen for 'line' events (input from the user) and handle them.
userInterface.on("line", async (input) => {
  // Check the GENERATOR_TYPE environment variable and call the appropriate function.
  switch (process.env.GENERATOR_TYPE) {
    case 'images':
      // Call the 'generateImages' function if GENERATOR_TYPE is 'images'.
      await generateImages(input);
      // Add a break statement to exit the switch block after executing the generateImages function.
      break;
    case 'chat':
    default:
      // Call the 'chatCompletion' function if GENERATOR_TYPE is 'chat' or not specified.
      await chatCompletion(input);
  }

  // Display the prompt again, allowing the user to enter more input.
  userInterface.prompt();
});