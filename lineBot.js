"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const bot_sdk_1 = require("@line/bot-sdk");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// LINE API 설정
const config = {
    channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
    channelSecret: 'YOUR_CHANNEL_SECRET',
};
const client = new bot_sdk_1.Client(config);
// 미들웨어 설정
app.use((0, bot_sdk_1.middleware)(config));
app.use(body_parser_1.default.json());
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
function handleEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
// 하루 1문장 제공 함수
function getDailySentence() {
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
