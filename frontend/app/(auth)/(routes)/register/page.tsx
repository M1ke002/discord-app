'use client';

import React from 'react';
import Link from 'next/link';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

//for validation
const formSchema = z.object({
  username: z.string().min(1, {
    message: 'username is required!'
  }),
  nickname: z.string().min(1, {
    message: 'nickname is required!'
  }),
  password: z.string().min(1, {
    message: 'password is required!'
  })
});

const RegisterPage = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      nickname: '',
      password: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div className="w-full h-full absolute inset-y-0 flex items-center justify-center">
      {/* <div className="container mx-auto h-full flex justify-center items-center"> */}
      <div className="md:w-8/12 lg:w-4/12 bg-[#313338] border rounded-md shadow-md px-8 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-center mb-2 font-semibold text-xl">
              Create an account
            </div>
            {/* <p className="text-center bg-red-300 py-3 mb-6 rounded">
                  Sth wrong
                </p> */}
            <div className="mb-3">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="text"
                        className="bg-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter user name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-3">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                      Display name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="text"
                        className="bg-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter nickname"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-5">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-400">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="password"
                        className="bg-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <button className="inline-block px-7 py-3 bg-[#5865f2] text-white font-medium text-sm leading-snug rounded shadow-md hover:bg-[#4752c4] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full">
              Sign up
            </button>

            <div className="flex items-center justify-center pt-2 text-sm text-zinc-400">
              Already have an account?
              <Link
                href="/login"
                className="text-blue-500 ml-1 cursor-pointer hover:underline"
              >
                Log in now!
              </Link>
            </div>
          </form>
        </Form>
      </div>
      {/* </div> */}
    </div>
  );
};

export default RegisterPage;
