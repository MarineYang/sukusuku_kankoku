import { NextRequest, NextResponse } from "next/server";
import { Paddle, Environment, EventName } from "@paddle/paddle-node-sdk";


const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
    environment: Environment.sandbox,
});

export async function POST(req: NextRequest) {
    const signature = (req.headers.get('paddle-signature') as string) || '';
    const rawRequestBody = await req.text() || "";

    // Replace `WEBHOOK_SECRET_KEY` with the secret key in notifications from vendor dashboard
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET || '';

    try {
      if (signature && rawRequestBody) {
        // The `unmarshal` function will validate the integrity of the webhook and return an entity
        const eventData = await paddle.webhooks.unmarshal(rawRequestBody, secretKey, signature);

        // TODO DB에 저장하고, 만들었던 구매로직에 맞는 이벤트 처리 추가.
        switch (eventData.eventType) {
            case EventName.TransactionCreated:
                console.log(`Transaction ${eventData.data.id} was created`);
                break;
            case EventName.TransactionPaid:
                console.log(`Transaction ${eventData.data.id} was paid`);
                break;
            case EventName.SubscriptionUpdated:
                console.log(`Subscription ${eventData.data.id} was updated`);
                break;
            default:
                console.log(eventData.eventType);
        }
      } else {
        console.log('Signature missing in header');
      }
    } catch (e) {
      // Handle signature mismatch or other runtime errors
      console.log(e);
    }
    // Return a response to acknowledge
    return NextResponse.json({ok: true});

}