"use client"

import React from 'react'
import { UploadDropzone } from './UploadThing';
import {X} from 'lucide-react'
import Image from 'next/image';

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: "messageFile" | "serverImage";
    value: string
}

const FileUpload = ({
    endpoint,
    onChange,
    value
}: FileUploadProps) => {

  const fileType = value?.split(".").pop();

  const deleteImage = (url: string) => {
    const urlParts = url.split("/");
    const imageName = urlParts[urlParts.length - 1];
    console.log(imageName);
    //TODO: delete image from uploadthing server
    onChange("");
  }

  //if the image is uploaded -> display it
  if (value && fileType !== "pdf") {
    return <div className="relative h-20 w-20">
        <Image
            fill
            src={value}
            alt="Upload"
            className="rounded-full"
        />
        <button
            onClick={() => deleteImage(value)}
            className='bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm'
            type='button'
        >
            <X className='h-4 w-4'/>
        </button>
    </div>
  }

  return (
    <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
            //set the value to the uploaded image url
            onChange(res?.[0].url);
            console.log(res);
            //need to save res.key to db as well
        }}
        onUploadError={(error: Error) => {
            console.log(error);
        }}
    />
  )
}

export default FileUpload