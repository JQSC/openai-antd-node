import OpenAI from "openai";
import tunnel from 'tunnel'
import fs from 'fs'
import path from 'path'
import moment from 'moment'

const openai = new OpenAI({
  apiKey: '',//process.env.OPENAI_API_KEY,
  timeout: 12000,
  httpAgent: tunnel.httpsOverHttp({
    proxy: {
      host: '127.0.0.1',
      port: 7890,
    }
  })
});

async function writeAudioFile(buffer) {
  const fileName = moment().format('YYYY-MM-DD#HHmmss')
  const speechFile = path.resolve(`./public/audio/${fileName}.mp3`);
  return fs.promises.writeFile(speechFile, buffer);
}

export default async function (req, res) {

  const text = req.body.text || '';
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text",
      }
    });
    return;
  }
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await writeAudioFile(buffer)
    res.status(200).json({ result: 'ok' });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
