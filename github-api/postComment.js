const generateMarkdown = require('./utils/markdown-generation.js');
// Import methods supports by tectalicOpenai
const { chatCompletion } = require('./methods/chatGenerator.js');
const { documentationGenerator } = require('./methods/documentationGenerator.js');
const { cypressTestsGenerator } = require('./methods/cypressTestsGenerator.js');

// Function to post generated comment on GitHub PR
async function postComment (comment_type, token, owner, repo, pr_number, pr_diff, generate_markdown=false) {
  let comment_payload = null;

  try {
    switch (comment_type) {
      case 'documentation':
        comment_payload = await documentationGenerator(pr_diff, 'Write documentation for this git diff');
        break;
      case 'cypress':
        comment_payload = await cypressTestsGenerator(pr_diff, 'Write Cypress tests for this PR diff');
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
    // update comment_payload with markdown if generate_markdown flag is set to true
    const body = generate_markdown ? generateMarkdown(comment_payload) : comment_payload;

    const response = await axios({
      method: 'POST',
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${pr_number}/comments`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
      data: {
        body
      },
    });

    console.log(`Github omment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post Github comment: ${error.message}`);
    return error;
  }
}

module.exports = {
  postComment
};