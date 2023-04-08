const { Configuration, OpenAIApi } = require("openai");

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

    const cypress_test_recommendations = res?.data?.choices[0]?.message?.content?.trim();

    console.log(`\n\n${cypress_test_recommendations}`);

    return `Documentation suggestion for this pull request:\n\n${cypress_test_recommendations}`;

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