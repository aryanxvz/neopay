import React from 'react';
import { authOptions } from '../../lib/auth';
import { getServerSession } from 'next-auth';
import prisma from '@repo/db/client';

async function getUserData() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { user: null, balance: 0, recentTransactions: [] };
    }

    const user = await prisma.user.findUnique({
        where: { id: Number(session.user.id) },
    });
    const balance = await prisma.balance.findFirst({
        where: { userId: user?.id },
    });

    const recentTransactions = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: user?.id },
                { toUserId: user?.id },
            ],
        },
        include: {
            fromUser: true,
            toUser: true,
        },
        orderBy: { timestamp: 'desc' },
        take: 5,
    });

    return {
        user,
        balance: balance ? balance.amount : 0,
        recentTransactions,
    };
}

export default async function HomePage() {
    const { user, balance, recentTransactions } = await getUserData();

    return (
        <div className="w-full ml-6 mr-12">
            <h1 className="text-4xl pt-10 mb-8 font-bold">Hello, {user?.name || 'User'}!</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-medium mb-2">Account Summary</h2>
                    <p className="p-1">Total Balance: {balance / 100} INR</p>
                    <p className="p-1">Locked Balance: {/* Locked balance value */}</p>
                    <p className="p-1">Available Balance: {balance / 100} INR</p>
                </div>
                    
                <div className="bg-white shadow rounded-lg p-6 ml-60">
                    <div className="text-3xl font-medium mb-2">Notifications</div>
                    <p>No new notifications</p>
                </div>

                <div className="col-span-1 md:col-span-2 bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-medium mb-2">Recent Transactions</h2>
                    <ul>
                        {recentTransactions.map(txn => (
                            <li key={txn.id} className="border-b border-gray-200 py-2">
                                {txn.fromUser.name} sent {txn.amount / 100} INR to {txn.toUser.name} on {new Date(txn.timestamp).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}
