
import React from "react";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";

async function getBalance() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { amount: 0, locked: 0 };
    }

    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session.user.id)
        }
    });

    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

export default async function Dashboard() {
    const balance = await getBalance();

    return (
        <div className="w-full mr-4">
            <div className="text-2xl font-bold p-6 ml-1">
                Dashboard
            </div>
            <div className="px-6">
                <BalanceCard amount={balance.amount} locked={balance.locked} />
            </div>
        </div>
    );
}
