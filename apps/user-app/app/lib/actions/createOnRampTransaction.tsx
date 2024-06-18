
"use server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client"

export async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions)
    const token = Math.random().toString() //will have an api in real world example
    const userId = session.user.id

    if(!userId) {
        return {
            message: "User not logged in"
        }
    }

    await prisma.onRampTransaction.create({
        data: {
            userId: Number(userId),
            amount: amount * 100,
            status: "Processing",
            startTime: new Date(),
            provider,
            token: token
        }
    })

    return {
        message: "On ramp transaction added"
    }

} 