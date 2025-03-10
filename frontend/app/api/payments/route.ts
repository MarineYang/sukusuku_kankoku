import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
    environment: Environment.sandbox,
});

export async function GET(req: Request) {
    const txn = await paddle.transactions.create({
        items: [
            {
                quantity: 1,
                price: {
                    name: "dynamically generated price description",
                    description: "dynamically generated price description",
                    unitPrice: {
                        currencyCode: "JPY",
                        amount: "500",
                    },
                    product: {
                        name: "Dynamically generated product",
                        description: "Dynamically generated product description",
                        taxCategory: "digital-goods",
                    }
                }
            },
        ],
    });
    
    console.log(txn);

    return NextResponse.json({txn: txn.id});
}

