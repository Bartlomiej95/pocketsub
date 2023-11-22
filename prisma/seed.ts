import { prisma } from "@/lib/db";
import { PAYMENT_STATUS, SUBSCRIPTION_BILLING_PERIOD, SUBSCRIPTION_CURRENCY } from "@prisma/client";
import { addMonths, endOfMonth, isBefore, startOfMonth } from "date-fns";

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomDateInCurrentMonth() {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function nextPaymentMonthGenerate(billingPeriod: SUBSCRIPTION_BILLING_PERIOD){
    switch(billingPeriod){
        case SUBSCRIPTION_BILLING_PERIOD.QUERTERLY:
            return 3;
        case SUBSCRIPTION_BILLING_PERIOD.YEARLY:
            return 12;
        default:
            return 1;
    }
}

async function main () {
    const user = await prisma.user.upsert({
        where: {
            email: 'example@test.com',
        },
        update: {
            subscriptions: {
                create: [
                    {
                        name: "Google Cloud",
                        category: "Infrastructure tools",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Google-Avatar.png",
                        price: 5.2,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    },
                    {
                        name: "Disney+",
                        category: "Entertaiment",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Disney-Avatar.png",
                        price: 8.99,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    },
                    {
                        name: "Getsafe Digital GmBH",
                        category: "Insurance",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Getsafe-Avatar.png",
                        price: 4.84,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    }
                ]
            }
        },
        create: {
            id: 'test123',
            email: 'example@test.com',
            name: 'Testowy Example',
            subscriptions: {
                create: [
                    {
                        name: "Google Cloud",
                        category: "Infrastructure tools",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Google-Avatar.png",
                        price: 5.2,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    },
                    {
                        name: "Disney+",
                        category: "Entertaiment",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Disney-Avatar.png",
                        price: 8.99,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    },
                    {
                        name: "Getsafe Digital GmBH",
                        category: "Insurance",
                        billing_period: SUBSCRIPTION_BILLING_PERIOD.MONTHLY,
                        avatar_url: "https://dsc.cloud/88160a/Getsafe-Avatar.png",
                        price: 4.84,
                        currency: SUBSCRIPTION_CURRENCY.EUR,
                        start_date: randomDate(new Date(2023, 1, 1), new Date()),
                        next_payment_date: new Date(),
                    }
                ]
            }
        },
        include: {
            subscriptions: true,
        }
    });

    const updateSubscriptions = await Promise.all(
        user.subscriptions.map(async (subscription) => {
            const due_date = getRandomDateInCurrentMonth();
            const status = isBefore(due_date, new Date()) ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.NOT_PAID;
        
            await prisma.payment.create({
                data: {
                    amount: subscription.price,
                    due_date,
                    subscriptionId: subscription.id,
                    status,
                },
            });

            return prisma.subscription.update({
                where: { id: subscription.id },
                data: {
                    next_payment_date: status === PAYMENT_STATUS.PAID ? addMonths(due_date, nextPaymentMonthGenerate(subscription.billing_period)) : due_date,
                }
            })
        
        })
    )
}

main().then( async () => {
    await prisma.$disconnect()
}).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
})