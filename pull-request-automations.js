const axios = require('axios');
const fs = require("fs");
const postComment = require('./github-api/postComment.js');

const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;

  // Post the comment to the PR with documentation suggestions
  await postComment('documentation', token, owner, repo, pr_number, pr_diff, true);
  // Post the comment to the PR with cypress tests suggestions
  await postComment('cypress', token, owner, repo, pr_number, pr_diff);
};

main().catch((err) => new Error(err));