import container from "@/server/di/container";
import NextAuth from "next-auth";

const authOptions = container.resolve('authOptions');
export default NextAuth(authOptions)