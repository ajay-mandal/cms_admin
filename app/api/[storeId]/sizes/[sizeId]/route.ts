import { currentUserServerSide } from "@/hooks/currentUserServerSide";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sizeId: string }> },
) {
  try {
    const { sizeId } = await params;

    if (!sizeId) {
      return new NextResponse("Size_ID is required", { status: 400 });
    }

    const size = await db.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { headers: corsHeaders });
  } catch (error) {
    console.log("[SIZE_GET]", error);
    return new NextResponse("Internal error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ storeId: string; sizeId: string }> },
) {
  try {
    const { storeId, sizeId } = await params;

    const user = await currentUserServerSide();
    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const body = await req.json();
    const { name, value } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size_ID is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updateSize = await db.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(updateSize);
  } catch (error) {
    console.log("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ storeId: string; sizeId: string }> },
) {
  try {
    const { storeId, sizeId } = await params;

    const user = await currentUserServerSide();
    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!sizeId) {
      return new NextResponse("Size_ID is required", { status: 400 });
    }

    const storeByUserId = await db.store.findFirst({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const deletedSize = await db.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(deletedSize);
  } catch (error) {
    console.log("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
