import Head from 'next/head';
import { useState } from 'react';
import { Affix, Button, Input, Select, Space, Radio } from 'antd';
import styles from './index.module.css';

const ttsOptions = [
	{
		value: 'openai',
		label: 'openai',
	},
	{
		value: 'azure',
		label: 'azure',
	},
];


export default function Home() {
	const [top, setTop] = useState(50);
	const [textInput, setTextInput] = useState('');
	const [result, setResult] = useState();

	async function onSubmit(event) {
		event.preventDefault();
		try {
			const response = await fetch('/api/aws-tts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text: textInput }),
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw (
					data.error ||
					new Error(`Request failed with status ${response.status}`)
				);
			}

			setResult(data.result);
			setTextInput('');
		} catch (error) {
			// Consider implementing your own error handling logic here
			console.error(error);
			// alert(error.message);
		}
	}

	return (
		<div>
			<Head>
				<title>OpenAI Quickstart</title>
				<link rel="icon" href="/dog.png" />
			</Head>
			<Affix offsetTop={top} style={{ position: 'absolute', right: 100 }}>
				<Button type="primary">配置</Button>
			</Affix>
			<main className={styles.main}>
				<img src="/dog.png" className={styles.icon} />
				<h3>文本转语音</h3>
				<form onSubmit={onSubmit}>
					<Radio.Group value={1}>
						<Radio.Button value={1}>A</Radio.Button>
						<Radio.Button value={2}>B</Radio.Button>
						<Radio.Button value={3}>C</Radio.Button>
					</Radio.Group>
					<Space.Compact>
						<Select size="large" defaultValue="aws" options={ttsOptions} />
						<Input placeholder="输入KEY" size="large" />
					</Space.Compact>
					<Input
						type="text"
						name="animal"
						size="large"
						placeholder="输入要转为语音的文本"
						value={textInput}
						onChange={(e) => setTextInput(e.target.value)}
					/>
					<input type="submit" value="提交" />
				</form>
				<audio src="./audio/speech.mp3"></audio>
				<div className={styles.result}>{result}</div>
			</main>
		</div>
	);
}
