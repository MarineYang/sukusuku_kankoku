// TODO 라인 챗봇 연동하여 정보 받아오는것 까지 구현해야함.
import express from 'express';
import bodyParser from 'body-parser';
import { Client, middleware } from '@line/bot-sdk';

// choco install ngrok
// ngrok config add-authtoken 2tmdodccQIqQ7Bk2BCplGcwdcxz_3YZPUijwWiMdfX8CBw63e
const app = express();
const port = process.env.PORT || 3000;

// LINE API 설정
const config = {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET',
};

const client = new Client(config);

// 미들웨어 설정
app.use(middleware(config));
app.use(bodyParser.json());

// 메시지 수신 및 응답 처리
app.post('/webhook', (req, res) => {
    Promise.all(req.body.events.map(handleEvent))
        .then((result) => res.json(result))
        .catch((err) => {
            console.error(err);
            res.status(500).end();
        });
});

// 이벤트 처리 함수
async function handleEvent(event: any) {
    if (event.type === 'message' && event.message.type === 'text') {
        const userMessage = event.message.text;

        // 사용자에게 하루 1문장 제공
        const responseMessage = getDailySentence();
        
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: responseMessage,
        });
    }
    return Promise.resolve(null);
}

// 하루 1문장 제공 함수
function getDailySentence(): string {
    // 예시 문장 (여기에 DB에서 문장을 가져오는 로직 추가 가능)
    const sentences = [
        "안녕하세요! 저는 일본에서 왔어요.",
        "오늘 날씨가 좋네요.",
        "한국어 공부는 재미있어요.",
    ];
    const randomIndex = Math.floor(Math.random() * sentences.length);
    return sentences[randomIndex];
}

// 서버 시작
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
}); 