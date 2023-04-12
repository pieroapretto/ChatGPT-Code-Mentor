const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();

async function cypressTestsGenerator(input) {
  try {
    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .chatCompletions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Write Cypress tests for this PR diff: ' + input }]
    });

    const cypress_test_recommendations = res.data.choices[0].message.content.trim();
    
    console.log(`\n${cypress_test_recommendations}`);

    return `Cypress tests suggestion for this pull request:\n\`\`\`diff\n${cypress_test_recommendations}\n\`\`\``;

  } catch (err) {
    if (err?.response) {
      const { status = null, statusText = '' } = err.response;
      console.error(`${status} - ${statusText}`);
      return err?.response;
    } else {
      console.error(err);
      return err;
    }
  }
}

module.exports = {
  cypressTestsGenerator
};