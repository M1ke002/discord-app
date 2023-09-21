"use client"

import React, { useEffect } from 'react'

import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogDescription } from '../ui/dialog'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import FileUpload from '../FileUpload'
import { useModal } from '@/hooks/useModal'

//for validation
const formSchema = z.object({
    name: z.string().min(1, {
      message: "Server name is required!",
    }),
    // imageUrl: z.string().min(1, {
    //   message: "Server image URL is required!",
    // }),
  })

const EditServerModal = () => {
    const {type, isOpen, onClose, data} = useModal();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const {server} = data;
    const isModalOpen = type === "editServer" && isOpen;
    const isLoading = form.formState.isSubmitting;

    useEffect(() => {
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl === null ? "" : server.imageUrl);
        }
    }, [server, form])

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        console.log(values);
        handleCloseModal();
    }

    const handleCloseModal = () => {
        // form.reset();
        //reset the form to the initial server values
        if (server) {
            form.setValue("name", server.name);
            form.setValue("imageUrl", server.imageUrl === null ? "" : server.imageUrl);
        }
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Edit server</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center text-center justify-center">
                                <FormField
                                    control={form.control}
                                    name='imageUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel 
                                                className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                                Server image
                                            </FormLabel>
                                            <FormControl >
                                                <FileUpload
                                                    endpoint='serverImage'
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel 
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Server name
                                      </FormLabel>
                                      <FormControl>
                                        <Input 
                                            disabled={isLoading} 
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' 
                                            placeholder="Enter server name" 
                                            {...field} 
                                        />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default EditServerModal