import { Router } from 'express';
import { Client } from '@line/bot-sdk';

const router = Router();
const lineClient = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
  });

// 친구 추가 이벤트 처리
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body.events[0];
    
    if (event.type === 'follow') {
      // 새로운 친구 추가 시
      await sendLevelSelectionMessage(event.source.userId);
    } 
    else if (event.type === 'message') {
      // 레벨 선택 메시지 처리
      await handleLevelSelection(event);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send(error);
  }
});