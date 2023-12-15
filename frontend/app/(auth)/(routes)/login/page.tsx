'use client';

import React, { useState, useEffect } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';

//for validation
const formSchema = z.object({
  username: z.string().min(1, {
    message: 'username is required!'
  }),
  password: z.string().min(1, {
    message: 'password is required!'
  })
});

const LoginPage = () => {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [message, setMessage] = useState({
    hasMessage: false,
    content: '',
    messageType: ''
  });
  const router = useRouter();

  useEffect(() => {
    const isSessionExpired = searchParams.get('message') === 'sessionExpired';

    if (isSessionExpired) {
      console.log('session expired!');
      toast({
        title: 'Session expired!',
        description: 'Please sign in again'
      });
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false
      // callbackUrl: "/",
    });
    if (res?.error) {
      setMessage({
        hasMessage: true,
        content: res.error,
        messageType: 'error'
      });
      setTimeout(() => {
        setMessage({
          hasMessage: false,
          content: '',
          messageType: ''
        });
      }, 3000);
    } else {
      setMessage({
        hasMessage: true,
        content: 'Logged in successfully!',
        messageType: 'success'
      });
      setTimeout(() => {
        setMessage({
          hasMessage: false,
          content: '',
          messageType: ''
        });
      }, 3000);
      router.replace('/');
    }
  };

  return (
    <div className="w-full h-full absolute inset-y-0 flex items-center justify-center">
      {/* <div className="container mx-auto h-full flex justify-center items-center"> */}
      <div className="md:w-8/12 lg:w-4/12 bg-[color:var(--primary-dark)] rounded-md shadow-md px-8 py-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-center mb-2 font-semibold text-xl text-zinc-200">
              Welcome back!
            </div>
            <div className="flex justify-center mb-1 font-semibold text-sm text-zinc-400">
              We&apos;re so excited to see you again!
            </div>
            {message.hasMessage && (
              <p
                className={cn(
                  'text-white text-center py-2 mt-4 mb-6 rounded',
                  message.messageType === 'success'
                    ? 'bg-green-300'
                    : 'bg-red-300'
                )}
              >
                {message.content}
              </p>
            )}
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
                        className="text-white bg-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter user name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mb-2">
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
                        className="text-white bg-black border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <a className="flex items-center justify-start text-blue-500 cursor-pointer mb-5 text-sm hover:underline">
              Forgot password?
            </a>

            <button className="inline-block px-7 py-3 bg-[color:var(--primary-theme)] text-white font-medium text-sm leading-snug rounded shadow-md hover:bg-[#4752c4] hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full">
              Log in
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-zinc-500 gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-zinc-500 after:mt-0.5">
              <p className="text-zinc-300 text-center font-semibold mx-4 mb-0">
                OR
              </p>
            </div>

            <a
              className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-2"
              style={{ backgroundColor: '#3b5998' }}
              role="button"
            >
              <img
                className="pr-2"
                src="/images/google.svg"
                alt=""
                style={{ height: '1.8rem' }}
              />
              Continue with Google
            </a>

            <div className="flex items-center justify-center pt-2 text-sm text-zinc-400">
              Not a member?
              <Link
                href="/register"
                className="text-blue-500 ml-1 cursor-pointer hover:underline"
              >
                Register now!
              </Link>
            </div>
          </form>
        </Form>
      </div>
      {/* </div> */}
    </div>
  );
};

export default LoginPage;
