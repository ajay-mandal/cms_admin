import { format } from "date-fns";

import { db } from "@/lib/db";
import { ColorsClient} from "./components/client";
import { ColorColumn } from "./components/columns";

const ColorsPage = async({
    params
}: {
    params: {storeId: string}
}) => {

    const sizes = await db.color.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedColors: ColorColumn[] = sizes.map((item)=> ({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }));

    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 py-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
    );
}
 
export default ColorsPage;