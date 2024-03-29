'use client';

import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useModal } from '@/hooks/zustand/useModal';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { FileEdit } from 'lucide-react';
import useAxiosAuth from '@/hooks/useAxiosAuth';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { File } from 'buffer';

//for validation
const accountFormSchema = z.object({
  avatarUrl: z.string(),
  username: z.string().min(1, {
    message: 'username is required!'
  }),
  nickname: z.string().min(1, {
    message: 'nickname is required!'
  })
});

const passwordFormSchema = z.object({
  currPassword: z.string().min(1, {
    message: 'Current password is required!'
  }),
  newPassword: z.string().min(1, {
    message: 'New password is required!'
  }),
  confirmNewPassword: z.string().min(1, {
    message: 'Confirm new password is required!'
  })
});

const UserSettingsModal = () => {
  const { data: session, update } = useSession();
  const [canEdit, setCanEdit] = useState(false);
  const { isOpen, onClose, type } = useModal();
  const axiosAuth = useAxiosAuth();
  const { toast } = useToast();
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [imageData, setImageData] = useState<{
    src: string;
    file: File | null;
  }>({
    src: '',
    file: null
  });

  const accountForm = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      avatarUrl: '',
      username: '',
      nickname: ''
    }
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  });

  useEffect(() => {
    if (!session) {
      return;
    }

    accountForm.reset({
      avatarUrl: session.user.file?.fileUrl || '',
      username: session.user.username,
      nickname: session.user.nickname
    });
    setImageData({
      ...imageData,
      src: session.user.file?.fileUrl || ''
    });
  }, [
    session?.user.username,
    session?.user.nickname,
    session?.user.file?.fileUrl,
    accountForm
  ]);

  const isModalOpen = isOpen && type === 'userSettings';
  const isAccountFormLoading = accountForm.formState.isSubmitting;
  const isPasswordFormLoading = passwordForm.formState.isSubmitting;

  const onAccountFormSubmit = async (
    values: z.infer<typeof accountFormSchema>
  ) => {
    console.log(values);
    try {
      const requestBody: any = {};
      //check if the avatar image is changed
      if (session?.user.file?.fileUrl !== imageData.src) {
        //if the user already has an avatar, delete it from uploadthing server
        if (session?.user.file?.fileUrl) {
          const res = await axios.delete(
            `/api/uploadthing-files?fileKey=${session?.user.file.fileKey}`
          );
          if (res.data.status === 'error') {
            console.log(
              'error deleting image from uploadthing server',
              res.data.message
            );
            return;
          }

          requestBody.fileUrl = null;
          requestBody.fileKey = null;
          requestBody.fileName = null;
        }

        //check if user uploaded a new image
        if (imageData.src) {
          const data = new FormData();
          data.set('file', imageData.file as any);
          //upload image to uploadthing server
          const res = await axios.post('/api/uploadthing-files', data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(res.data);

          if (res.data.status === 'error') {
            console.log('error uploading image to uploadthing server');
            return;
          }

          requestBody.fileUrl = res.data.data.url;
          requestBody.fileKey = res.data.data.key;
          requestBody.fileName = res.data.data.name;
        }
      }

      //check if username is changed
      if (session?.user.username !== values.username) {
        requestBody.username = values.username;
      }

      //check if nickname is changed
      if (session?.user.nickname !== values.nickname) {
        requestBody.nickname = values.nickname;
      }

      //check if any changes are made
      if (Object.keys(requestBody).length === 0) {
        console.log('no changes made!');
        return;
      }

      //if the requestBody doesnt have the fileUrl property, set it to the current fileUrl
      if (!requestBody.hasOwnProperty('fileUrl')) {
        requestBody.fileUrl = session?.user.file?.fileUrl;
        requestBody.fileKey = session?.user.file?.fileKey;
      }

      console.log('requestBody: ' + JSON.stringify(requestBody));
      //send request
      const res = await axiosAuth.put(
        `/users/${session?.user.id}`,
        requestBody
      );

      console.log('res DATA: ' + JSON.stringify(res.data));

      //if username is changed, force user to relogin
      if (requestBody.username) {
        signOut();
      } else {
        //update the session user object
        update({
          username: res.data.username,
          nickname: res.data.nickname,
          fileUrl: res.data.file?.fileUrl,
          fileKey: res.data.file?.fileKey,
          fileName: res.data.file?.fileName
        });
      }
    } catch (error) {
      console.log('[UserSettingsModal]: ' + error);
    } finally {
      setCanEdit(false);
    }
  };

  const onPasswordFormSubmit = async (
    values: z.infer<typeof passwordFormSchema>
  ) => {
    console.log(values);
    if (values.newPassword !== values.confirmNewPassword) {
      toast({
        title: 'Error!',
        description: 'New password and confirm new password must match!'
      });
      return;
    }
    try {
      const res = await axiosAuth.put('/users/changePassword', {
        username: session?.user.username,
        currPassword: values.currPassword,
        newPassword: values.newPassword
      });
      toast({
        title: 'Success!',
        description: 'Password changed successfully!'
      });
    } catch (error: any) {
      console.log('[change password]: ' + error.message);
      toast({
        title: 'Error!',
        description: error.response.data.response
      });
    }
  };

  const resetForm = (formType: 'account' | 'password') => {
    if (formType === 'account') {
      accountForm.reset({
        avatarUrl: session?.user.file?.fileUrl || '',
        username: session?.user.username,
        nickname: session?.user.nickname
      });
      setImageData({
        ...imageData,
        src: session?.user.file?.fileUrl || ''
      });
    } else {
      passwordForm.reset({
        currPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    }
  };

  const handleCloseDialog = () => {
    if (isAccountFormLoading || isPasswordFormLoading) {
      return;
    }
    onClose();
    resetForm('account');
    resetForm('password');
    setCanEdit(false);
  };

  const onAvatarImageChange = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      let file = event.target.files[0];
      console.log(file);
      reader.onload = (e) => {
        const { result } = e.target as any;
        if (result) {
          accountForm.setValue('avatarUrl', result);
          setImageData({
            src: result,
            file: file
          });
          // console.log(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setImageData({
      src: '',
      file: null
    });
    accountForm.setValue('avatarUrl', '');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="dark:bg-[#313338] dark:text-white overflow-hidden w-[400px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-2xl text-center ">
            User settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="account">
          <TabsList className="dark:bg-[color:var(--sidebar-dark)] grid w-full grid-cols-2 mb-3">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Form {...accountForm}>
              <form onSubmit={accountForm.handleSubmit(onAccountFormSubmit)}>
                <Card className="dark:bg-[color:var(--sidebar-dark)] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[20px]">User profile</CardTitle>
                    <CardDescription>
                      Make changes to your account here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col items-center text-center justify-center">
                      <Label className="uppercase text-xs font-bold text-zinc-400 mb-2">
                        Avatar image
                      </Label>
                      {/* Hiddden input field to open image file */}
                      <Input
                        type="file"
                        className="hidden"
                        ref={inputFile}
                        accept="image/*"
                        onChange={onAvatarImageChange}
                      />
                      {canEdit && (
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <div className="relative h-20 w-20 group">
                              {imageData.src && (
                                <Image
                                  fill
                                  src={imageData.src}
                                  alt="Upload"
                                  className="rounded-full"
                                />
                              )}
                              {!imageData.src && (
                                <div className="flex items-center justify-center rounded-full dark:bg-indigo-500 h-20 w-20 group">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="2.6em"
                                    viewBox="0 0 640 512"
                                    style={{ fill: '#fafafa' }}
                                  >
                                    <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                                  </svg>
                                </div>
                              )}
                              {/* hover overlay on image (show edit icon) */}
                              <div className="hidden transition w-20 h-20 bg-[#00000080] absolute rounded-full group-hover:block cursor-pointer bottom-0">
                                <FileEdit className="h-6 w-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                              </div>
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            side="right"
                            sideOffset={5}
                            className="p-1"
                          >
                            <DropdownMenuItem
                              className="pr-4"
                              onClick={() => inputFile.current?.click()}
                            >
                              Upload avatar
                            </DropdownMenuItem>
                            {imageData.src && (
                              <DropdownMenuItem
                                className="pr-4"
                                onClick={handleRemoveAvatar}
                              >
                                Remove avatar
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {!canEdit && (
                        <div className="relative h-20 w-20">
                          {imageData.src && (
                            <Image
                              fill
                              // src="https://utfs.io/f/f7fde577-81f8-4ca0-8414-0663410bd819-n92lk7.jpg"
                              src={imageData.src}
                              alt="Upload"
                              className="rounded-full"
                            />
                          )}
                          {!imageData.src && (
                            <div className="flex items-center justify-center rounded-full dark:bg-indigo-500 h-20 w-20">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="2.6em"
                                viewBox="0 0 640 512"
                                style={{ fill: '#fafafa' }}
                              >
                                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <FormField
                        control={accountForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                              Username
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-zinc-300/50 dark:bg-[#191b1d] border-0 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                                placeholder="Username"
                                {...field}
                                disabled={!canEdit || isAccountFormLoading}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              NOTE: Changing the username will require you to
                              re-login
                            </FormDescription>
                            <FormMessage className="dark:text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <FormField
                        name="nickname"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                              Nickname
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="bg-zinc-300/50 dark:bg-[#191b1d] border-0 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                                placeholder="Nickname"
                                {...field}
                                disabled={!canEdit || isAccountFormLoading}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="dark:bg-[#27292c] flex items-center justify-end px-6 py-3">
                    {canEdit && (
                      <Fragment>
                        <Button
                          variant="ghost"
                          type="button"
                          className="hover:underline hover:bg-none mr-2"
                          disabled={isAccountFormLoading}
                          onClick={() => {
                            setCanEdit(false);
                            resetForm('account');
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={isAccountFormLoading}
                        >
                          {isAccountFormLoading ? 'Saving...' : 'Save changes'}
                        </Button>
                      </Fragment>
                    )}
                    {!canEdit && (
                      <Button
                        variant="primary"
                        type="button"
                        onClick={() => setCanEdit(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="password">
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordFormSubmit)}>
                <Card className="dark:bg-[color:var(--sidebar-dark)] shadow-md">
                  <CardHeader>
                    <CardTitle className="text-[20px]">
                      Change password
                    </CardTitle>
                    <CardDescription>
                      Enter your current password and a new password.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-1">
                      <FormField
                        control={passwordForm.control}
                        name="currPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                              Current password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                className="bg-zinc-300/50 dark:bg-[#191b1d] border-0 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                                placeholder="Current password"
                                {...field}
                                disabled={isPasswordFormLoading}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                              New password
                            </FormLabel>
                            <FormControl>
                              <Input
                                disabled={isPasswordFormLoading}
                                type="password"
                                className="bg-zinc-300/50 dark:bg-[#191b1d] border-0 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                                placeholder="New password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <FormField
                        control={passwordForm.control}
                        name="confirmNewPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                              Confirm new password
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                className="bg-zinc-300/50 dark:bg-[#191b1d] border-0 focus-visible:ring-0 dark:text-white focus-visible:ring-offset-0"
                                placeholder="Confirm new password"
                                {...field}
                                disabled={isPasswordFormLoading}
                              />
                            </FormControl>
                            <FormMessage className="dark:text-rose-500" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="dark:bg-[#27292c] flex items-center justify-end px-6 py-3">
                    <Button
                      variant="ghost"
                      className="hover:underline hover:bg-none mr-2"
                      onClick={() => resetForm('password')}
                    >
                      Clear
                    </Button>
                    <Button variant="primary">Save</Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsModal;
