import React from "react";
import { authOptions } from "../../lib/auth";
import { getServerSession } from "next-auth";
import prisma from "@repo/db/client";

type TransactionData = {
    p2pTransfersSent: any[];
    p2pTransfersReceived: any[];
};

async function getTransactions(): Promise<TransactionData> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { p2pTransfersSent: [], p2pTransfersReceived: [] };
    }

    const p2pTransfersSent = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session.user.id),
        },
        include: {
            toUser: true,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    const p2pTransfersReceived = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session.user.id),
        },
        include: {
            fromUser: true,
        },
        orderBy: {
            timestamp: 'desc',
        },
    });

    return {
        p2pTransfersSent,
        p2pTransfersReceived,
    };
}

export default async function TransactionsPage() {
    const { p2pTransfersSent = [], p2pTransfersReceived = [] } = await getTransactions();

    return (
        <div className="w-full ml-6 mr-12">
            <h1 className="text-4xl pt-10 mb-8 font-bold">Transactions</h1>

            <div className="mb-10">
                <h2 className="text-xl font-medium ml-2 mb-2">Sent P2P Transfers</h2>
                    {p2pTransfersSent.map((txn) => (
                        <div key={txn.id} className="flex justify-between border-b border-slate-300 ml-4 pb-2 pt-2">
                            <div>
                                <div>To: {txn.toUser.name}</div>
                                <div>Timestamp: {new Date(txn.timestamp).toLocaleString()}</div>    
                            </div>
                            <div className="font-medium content-center pr-8">Amount: {txn.amount / 100} INR</div>
                        </div>
                    ))}
            </div>

            <div className="mb-10">
                <h2 className="text-xl font-medium ml-2 mb-2">Received P2P Transfers</h2>
                    {p2pTransfersReceived.map((txn) => (
                        <div key={txn.id} className="flex justify-between border-b border-slate-300 ml-4 pb-2 pt-2">
                        <div>
                            <div>To: {txn.toUser.name}</div>
                            <div>Timestamp: {new Date(txn.timestamp).toLocaleString()}</div>    
                        </div>
                        <div className="font-medium content-center pr-8">Amount: {txn.amount / 100} INR</div>
                    </div>
                    ))}
            </div>

        </div>
    );
}
