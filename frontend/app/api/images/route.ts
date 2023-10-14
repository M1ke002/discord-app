import { NextRequest, NextResponse } from "next/server";
import { utapi } from "uploadthing/server";

//nextjs api route to delete images in uploadthing server
export async function POST(request: NextRequest) {
    const { imageKey } = await request.json();
    await utapi.deleteFiles(imageKey);

    return NextResponse.json({});
}