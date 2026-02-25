import { UserButton } from "@/components/auth/user-button";
import { MainNav } from "@/components/main-nav";
import StoreSwitch from "@/components/store-switcher";
import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";

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