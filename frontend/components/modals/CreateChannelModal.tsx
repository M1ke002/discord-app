"use client"

import React from 'react'

import * as z from 'zod'
import {zodResolver} from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'

import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogDescription } from '../ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/useModal'
import { Hash, Video, Volume2 } from 'lucide-react'
import { ChannelType } from '@/utils/constants'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import useAxiosAuth from '@/hooks/useAxiosAuth'

// enum ChannelType {
//     Text = "text",
//     Audio = "audio",
//     Video = "video"
// }

//for validation
const formSchema = z.object({
    name: z.string().min(1, {
      message: "Channel name is required!",
    }),
    channelType: z.nativeEnum(ChannelType),
    categoryId: z.string().optional().nullable()
  })

const CreateChannelModal = () => {
    const {type, isOpen, onClose, data} = useModal();
    const router = useRouter();
    const params = useParams();
    const axiosAuth = useAxiosAuth();
    const {toast} = useToast(); 
    const {selectedCategory, categories, userId} = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            channelType: ChannelType.TEXT,
            categoryId: ""
        }
    });

    const isModalOpen = type === "createChannel" && isOpen;

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        const data = {
            userId,
            serverId: params?.serverId,
            categoryId: selectedCategory ? selectedCategory.id : (values.categoryId === "" ? null : values.categoryId),
            name: values.name,
            type: values.channelType.toUpperCase()
        }
        console.log(data);

        const res = await axiosAuth.post('/channels', data);
        if (res.status === 200) {
            toast({
                title: "New channel created!"
            })
            console.log(res.data);
        } else {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
        handleCloseModal();
        //to refetch the new data from backend
        router.push(`/servers/${params?.serverId}`);
    }

    const handleCloseModal = () => {
        form.reset();
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Create Channel</DialogTitle>
                    {selectedCategory && (
                        <DialogDescription className="text-center text-zinc-500">
                            In {selectedCategory.name}
                        </DialogDescription>
                    )}
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="channelType"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel 
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel type
                                      </FormLabel>
                                      <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                            <FormControl>
                                                <SelectTrigger 
                                                    className='bg-zinc-300/50 border-0 focus:ring-0 text-black focus:ring-offset-0 capitalize outline-none' 
                                                >
                                                    <SelectValue placeholder="Select a channel type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='bg-zinc-300 text-black outline-none border-0 focus:ring-0'>
                                                <SelectItem className='capitalize' value="text">
                                                    <div className='flex items-center'>
                                                        <Hash className='h-4 w-4 mr-1'/>
                                                        <span>text</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem className='capitalize' value="voice">
                                                    <div className='flex items-center'>
                                                        <Volume2 className='h-4 w-4 mr-1'/>
                                                        <span>voice</span>
                                                    </div>
                                                </SelectItem>
                                                <SelectItem className='capitalize' value="video">
                                                    <div className='flex items-center'>
                                                        <Video className='h-4 w-4 mr-1'/>
                                                        <span>video</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                      </Select>
                                    </FormItem>
                                )}
                            />
                            {!selectedCategory &&                           
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel 
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Category
                                      </FormLabel>
                                      <Select
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                      >
                                            <FormControl>
                                                <SelectTrigger 
                                                    className='bg-zinc-300/50 border-0 focus:ring-0 text-black focus:ring-offset-0 capitalize outline-none' 
                                                >
                                                    <SelectValue placeholder="Select a category (optional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className='bg-zinc-300 text-black outline-none border-0 focus:ring-0'>
                                                <SelectItem className='capitalize' value="">
                                                    <div>
                                                        <p>Select a category (optional)</p>
                                                    </div>
                                                </SelectItem>
                                                {categories?.map(category => (
                                                    <SelectItem key={category.id} className='capitalize' value={category.id.toString()}>
                                                        <div>
                                                            <p>{category.name}</p>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                      </Select>
                                    </FormItem>
                                )}
                            />}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                      <FormLabel 
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                            Channel name
                                      </FormLabel>
                                      <FormControl>
                                        <Input 
                                            disabled={isLoading} 
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0' 
                                            placeholder="new-channel" 
                                            {...field} 
                                        />
                                       
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button disabled={isLoading} variant="primary">Create Channel</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal