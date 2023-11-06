import { NextRequest, NextResponse } from 'next/server';
import { utapi } from 'uploadthing/server';

//nextjs api route to upload, delete images in uploadthing server
export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }
  console.log('file: ' + JSON.stringify(file));
  const response = await utapi.uploadFiles(file);
  console.log(response);

  if (response.error) {
    return NextResponse.json({
      status: 'error',
      message: response.error
    });
  }

  return NextResponse.json({
    status: 'success',
    data: response.data
  });
}

export async function DELETE(request: NextRequest) {
  //get the imageKey from the request parameters
  const imageKey = request.nextUrl.searchParams.get('imageKey');
  console.log('imageKey: ' + imageKey);
  if (!imageKey) {
    return NextResponse.json({
      status: 'error',
      message: 'No imageKey provided'
    });
  }
  //delete the image from the uploadthing server
  const response = await utapi.deleteFiles(imageKey);
  if (!response.success) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to delete image'
    });
  }
  console.log(response);
  return NextResponse.json({
    status: 'success',
    data: response
  });
}
