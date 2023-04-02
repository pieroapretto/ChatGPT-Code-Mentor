const tectalicOpenai = require('@tectalic/openai').default;
const config = require('dotenv').config();

async function generateImages(input) {
  try {
    const res = await tectalicOpenai(process.env.OPENAI_API_KEY)
    .imagesGenerations.create({
      prompt: input,
      size: '256x256',
      n: 3
    });

    res.data.data.forEach((image) => console.log(image.url));
  } catch (err) {
    const { status = null, statusText = '' } = err?.response;
    console.error(`${status} - ${statusText}`);
  }
}

module.exports = {
  generateImages
};