"use client";
import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "redirect",
    asChild?: boolean;
};

export const LoginButton = ({
    children,
}: LoginButtonProps) => {

    const router = useRouter();

    const onClick = () => {
        router.push("/login")
    }

    return (
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}
