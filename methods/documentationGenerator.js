const { Configuration, OpenAIApi } = require("openai");
const { generateMarkdown } = require('../utils/markdown-generation.js');

const configuration = new Configuration({
  apiKey: process.env.AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function documentationGenerator(
  input,
  prompt='Explain this'
  ) {
  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt + ': ' + input }]
    });

    const pr_summary = res?.data?.choices[0]?.message?.content?.trim();

    let markdown = generateMarkdown(`This PR introduces the following changes:\n\n${pr_summary}`);
    return markdown;

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
  documentationGenerator
};