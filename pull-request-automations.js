const axios = require('axios');
const fs = require("fs");
const { documentationGenerator } = require('./methods/documentationGenerator.js');

const postComment = async (token, owner, repo, pr_number, pr_diff) => {
  try {
    const body = await documentationGenerator(pr_diff);
    const response = await axios({
      method: 'POST',
      url: `https://api.github.com/repos/${owner}/${repo}/issues/${pr_number}/comments`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
      },
      data: {
        body: JSON.stringify(body)
      },
    });

    console.log(`Comment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post comment: ${error.message}`);
    return error;
  }
};

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

main().catch((err) => new Error(err));