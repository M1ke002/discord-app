import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
//auth function runs in middleware before the file can be uploaded to uploadthing
const handleAuth = async () => {
    return {userId: 'fakeId'}
} // Fake auth function
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
  serverImage: f({image: { maxFileSize: "4MB", maxFileCount: 1}})
    .middleware(() => handleAuth())
    .onUploadComplete(()=>{}),
  messageFile: f(["image","pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;