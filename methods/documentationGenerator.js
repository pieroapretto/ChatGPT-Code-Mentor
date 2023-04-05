const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();

async function documentationGenerator(input) {
  try {
    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .completions.create({
      model: 'text-davinci-003',
      prompt: 'Write documentation for the following JavaScript code: ' + input,
    })

    const documentation = res.data.choices[0].text.trim();

    console.log(`\n${documentation}`);

    return res.data.choices[0].text.trim();
    
  } catch (err) {
    if (err?.response) {
      const { status = null, statusText = '' } = err.response;
      console.error(`${status} - ${statusText}`);
    } else {
      console.error(err);
    }
  }
}

module.exports = {
  documentationGenerator
};