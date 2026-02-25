import { auth } from "@/auth";

export async function currentUserServerSide() {
    const session = await auth();

    return session?.user;
}

export async function currentRoleServerSide() {
    const session = await auth();

    return session?.user.role;
}

export async function currentUserServerSideSession() {
    const session = await auth();

    return session;
}

export async function currentIdServerSide() {
    const session = await auth();

    return session?.user.id;
}