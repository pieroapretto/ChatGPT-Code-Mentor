const axios = require('axios');
const fs = require("fs");

const postComment = async (token, owner, repo, pr_number, body) => {
  try {
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

    console.log(`Comment posted successfully: ${response.data.html_url}`);
  } catch (error) {
    console.error(`Failed to post comment: ${error.message}`);
  }
};

const main = async () => {
  // Read the content of the pr_diff.txt file
  const pr_diff = fs.readFileSync("pr_diff.txt", "utf8");

  console.log('pr_diff', pr_diff)

  // Set your variables
  const token = process.env.GITHUB_TOKEN;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const pr_number = process.env.PR_NUMBER;
  const body = `Changes in this pull request:\n\`\`\`diff\n${pr_diff}\n\`\`\``;

  // Post the comment
  await postComment(token, owner, repo, pr_number, body);
};

main().catch((err) => console.error(err));