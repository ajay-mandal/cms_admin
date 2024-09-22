import { UserButton } from "@/components/auth/user-button";
import { MainNav } from "@/components/main-nav";
import StoreSwitch from "@/components/store-switcher";
import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";

// import { cn } from "@/lib/utils";

// import { LoginButton } from "@/components/auth/login-button";
// import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import { Button, buttonVariants } from "@/components/ui/button";
// import { MobileNav } from "@/components/MobileNav";
// import { RegisterButton } from "@/components/auth/register-button";
// import { UserButton } from "./auth/user-button";
// import { useSession } from "next-auth/react";
// const Navbar = () => {
//   const { status } = useSession();
//   return (
//     <nav
//       className={cn(
//         "sticky h-14 inset-x-0 top-0 z-30 border-b border-gray-200  bg-white/40 backdrop-blur-lg transition-all"
//       )}
//     >
//       <MaxWidthWrapper>
//         <div className="flex h-14 items-center justify-end border-b border-zinc-200">
//           <div className="flex gap-1 sm:gap-4 items-center">
//             {status !== 'authenticated' ? (
//               <MobileNav />
//             ) : (
//               <Link
//                 className={buttonVariants({
//                   size: "sm",
//                   className: "sm:hidden mr-3",
//                 })}
//                 href="/dashboard"
//               >
//                 Dashboard
//               </Link>
//             )}

//             <div className="hidden items-center space-x-4 sm:flex">
//               {status !== 'authenticated' ? (
//                 <>
//                   <LoginButton>
//                   <Button variant="secondary" size="sm">
//                     Sign in
//                   </Button>
//                   </LoginButton>
//                   <RegisterButton>
//                   <Button size="sm">
//                     Get Started
//                   </Button>
//                   </RegisterButton>
//                 </>
//               ) : (
//                 <>
//                   <Link
//                     className={buttonVariants({
//                       size: "sm",
//                       variant: "secondary",
//                     })}
//                     href="/dashboard"
//                   >
//                     Dashboard
//                   </Link>
//                 </>
//               )}
//             </div>
//             {status !== 'unauthenticated' && (
//                 <UserButton />
//             )}
//           </div>
//         </div>
//       </MaxWidthWrapper>
//     </nav>
//   );
// };

// export default Navbar;


export default async function Navbar() {

  const userId = await currentIdServerSide();
  
  const store = await db.store.findMany({
    where: {
      userId
    }
  })
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitch items={store}/>
        <MainNav className="mx-6"/>
        <div className="ml-auto flex items-center space-x-4">
          <UserButton />
        </div>
      </div>
    </div>
  )
}