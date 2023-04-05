const readline = require('readline');

// Import methods supports by tectalicOpenai
const { chatCompletion } = require('./methods/chatGenerator.js');
const { generateImages } = require('./methods/imageGenerator.js');
const { audioTransScriptionGenerator } = require('./methods/audioTransScriptionGenerator.js');
const { documentationGenerator } = require('./methods/documentationGenerator.js');
const { cypressTestsGenerator } = require('./methods/cypressTestsGenerator.js');

// Create a readline interface for handling user input and output.
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// loadingAnimation() returns an interval that can be used to show a loading animation until a response is received from the API.
const loadingAnimation = () => {
  let animationFrames = ['-', '\\', '|', '/'];
  let currentFrame = 0;

  // new line
  console.log(`\n`);

  // Return an interval that will display a loading animation until it is cleared.
  return setInterval(() => {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`Loading epic response ${animationFrames[currentFrame]}`);
    currentFrame = (currentFrame + 1) % animationFrames.length;
  }, 250);
};

// Display a prompt to the user, indicating that they can enter input.
userInterface.prompt();

// Listen for 'line' events (input from the user) and handle them.
userInterface.on("line", async (input) => {
  const loadingInterval = loadingAnimation();

  // Check the GENERATOR_TYPE environment variable and call the appropriate function.
  switch (process.env.GENERATOR_TYPE) {
    case 'transcript':
      await audioTransScriptionGenerator(input);
      break;
    case 'images':
      await generateImages(input);
      break;
    case 'documentation':
      await documentationGenerator(input);
      break;
    case 'cypress':
      await cypressTestsGenerator(input);
      break;
    case 'chat':
    default:
      await chatCompletion(input);
  }

  // clear the loading animation
  clearInterval(loadingInterval);

  // Display the prompt again, allowing the user to enter more input.
  userInterface.prompt();
});