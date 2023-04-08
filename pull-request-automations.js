const axios = require('axios');
const fs = require("fs");
const { documentationGenerator } = require('./methods/documentationGenerator.js');

// Function to post generated comment on GitHub PR
const postComment = async (token, owner, repo, pr_number, pr_diff) => {
  let comment_payload = null;

  try {
    comment_payload = await documentationGenerator(pr_diff, 'Write documentation for this git diff');
  } catch (error) {
    console.error('An error occurred with documentationGenerator', error);
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
        body: JSON.stringify(comment_payload)
      },
    });

    console.log(`Comment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post comment: ${error.message}`);
    return error;
  }
};

// Main function to execute the post comment script on pull request
const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;

  // Post the comment
  await postComment(token, owner, repo, pr_number, pr_diff);
};

// Run the main function and handle any errors
main().catch((err) => new Error(err));