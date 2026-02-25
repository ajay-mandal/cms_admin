import { currentIdServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { SettingForm }from "./setting-form";

interface SettingPageProps {
    params: {
        storeId: string;
    }
};

const SettingPage: React.FC<SettingPageProps> = async({
    params
}) => {

    const userId = await currentIdServerSide();

    const store = await db.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    });

    if(!store) {
        redirect("/");
    }
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SettingForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingPage;