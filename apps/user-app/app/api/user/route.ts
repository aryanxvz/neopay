import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server"


const client = new PrismaClient();

export const GET = async () => {
    await client.user.create({
        data: {
            username: "",
            name: "",
            password: ""
        }
    })
    return NextResponse.json({
        message: "hi there"
    })
}