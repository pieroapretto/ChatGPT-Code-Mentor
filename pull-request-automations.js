const axios = require('axios');
const fs = require("fs");

const generateMarkdown = require('./utils/markdown-generation.js');
// Import methods supports by tectalicOpenai
const { chatCompletion } = require('./methods/chatGenerator.js');
const { documentationGenerator } = require('./methods/documentationGenerator.js');
const { cypressTestsGenerator } = require('./methods/cypressTestsGenerator.js');

const postComment = async (comment_type, token, owner, repo, pr_number, pr_diff) => {
  let comment_payload = null;

  try {
    switch (comment_type) {
      case 'documentation':
        comment_payload = await documentationGenerator(pr_diff, 'Write documentation for this git diff');
        break;
      case 'cypress':
        comment_payload = await cypressTestsGenerator(pr_diff, 'Write Cypress.io tests for this PR diff');
        break;
      case 'chat':
      default:
        comment_payload = await chatCompletion(pr_diff);
    }

  } catch (error) {
    console.error(`An error occurred with ${comment_type} postComment comment payload generation`, error);
    return;
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${pr_number}/comments`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
      data: {
        body: comment_payload
      },
    });

    console.log(`Github omment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post Github comment: ${error.message}`);
    return error;
  }
}

const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;

  // Post the comment to the PR with documentation suggestions
  // await postComment('documentation', token, owner, repo, pr_number, pr_diff);
  // Post the comment to the PR with cypress tests suggestions
  await postComment('cypress', token, owner, repo, pr_number, pr_diff);
};

main().catch((err) => new Error(err));