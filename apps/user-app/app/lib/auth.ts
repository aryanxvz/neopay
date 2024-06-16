import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";

var bcrypt = require('bcrypt');

export const authOptions = {
    providers: [
        CredentialsProvider({
        name: 'Credentials',
        credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "Enter your Phone number", required: true },
            username: { label: "Userame", type: "text", placeholder: "Enter your Username", required: true },
            name: { label: "Name", type: "text", placeholder: "Enter your Name", required: true },
            password: { label: "Password", type: "password", placeholder: "Enter your Password", required: true }
        },

        async authorize(credentials: any) {
        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await db.user.findFirst({
            where: {
                number: credentials.phone
            }
        });

        if (existingUser) {
            const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
            if (passwordValidation) {
                return {
                id: existingUser.id.toString(),
                name: existingUser.name,
                phone: existingUser.number ? existingUser.number.toString() : null
                };
            }
            return null;
        }

        // Create a new user if not existing
        if (!existingUser) { 
            try {
                const user = await db.user.create({
                    data: {
                    number: credentials.phone,
                    username: credentials.username,
                    name: credentials.name,     
                    password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    phone: user.number ? user.number.toString() : null
                };
            } catch (e) {
                console.error(e);
            }
        }

        return null;
      }
    })
  ],

  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: any) {
      session.user.id = token.sub;
      return session;
    }
  }
};
