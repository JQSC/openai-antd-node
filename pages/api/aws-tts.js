
import moment from 'moment'

const sdk = require('microsoft-cognitiveservices-speech-sdk')
const audioFile = 'YourAudioFile.wav';
const speechConfig = sdk.SpeechConfig.fromSubscription(
	'',
	'eastus'
);

function textToSpeech(text) {
  const fileName = moment().format('YYYY-MM-DD#HHmmss')

	const audioConfig = sdk.AudioConfig.fromAudioFileOutput(fileName+'.wav');
	// The language of the voice that speaks.
	speechConfig.speechSynthesisLanguage = 'zh-CN';
	speechConfig.speechSynthesisVoiceName = 'zh-CN-XiaohanNeural';

	// Create the speech synthesizer.
	var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

	synthesizer.speakTextAsync(
		text,
		function (result) {
			if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
				console.log('synthesis finished.');
			} else {
				console.error(
					'Speech synthesis canceled, ' +
						result.errorDetails +
						'\nDid you set the speech resource key and region values?'
				);
			}
			synthesizer.close();
			synthesizer = null;
		},
		function (err) {
			console.trace('err - ' + err);
			synthesizer.close();
			synthesizer = null;
		}
	);
	console.log('Now synthesizing to: ' + audioFile);
}

export default async function (req, res) {
	const text = req.body.text || '';
	if (text.trim().length === 0) {
		res.status(400).json({
			error: {
				message: 'Please enter a valid text',
			},
		});
		return;
	}
	try {
		const mp3 = await textToSpeech(text);
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
				},
			});
		}
	}
}
