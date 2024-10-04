import { format } from "date-fns";

import { db } from "@/lib/db";
import { BillboardClient } from "./client";
import { BillboardColumn } from "./columns";

const BillboardsPage = async({
    params
}: {
    params: {storeId: string}
}) => {

    const billboards = await db.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboard: BillboardColumn[] = billboards.map((item)=> ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 py-6">
                <BillboardClient data={formattedBillboard}/>
            </div>
        </div>
    );
}
 
export default BillboardsPage;