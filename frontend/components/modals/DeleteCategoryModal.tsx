"use client"

import React from 'react'

import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogDescription } from '../ui/dialog'
import { Button } from '../ui/button'
import { useModal } from '@/hooks/useModal'
import { useRouter } from 'next/navigation'
import { useToast } from '../ui/use-toast'
import useAxiosAuth from '@/hooks/useAxiosAuth'
import { useState } from 'react'


const DeleteCategoryModal = () => {
    const {type, isOpen, onClose, data} = useModal();
    const router = useRouter();
    const axiosAuth = useAxiosAuth();
    const {toast} = useToast(); 
    const {server,userId, selectedCategory} = data;
    const [isLoading, setIsLoading] = useState(false);


    const isModalOpen = type === "deleteCategory" && isOpen;

    const deleteCategory = async() => {
        setIsLoading(true);
        const res = await axiosAuth.delete(`/categories/${selectedCategory?.id}?userId=${userId}&serverId=${server?.id}`);
        if (res.status === 200) {
            toast({
                title: "Category deleted successfully!"
            })
            console.log(res.data);
        } else {
            toast({
                title: "Something went wrong",
                variant: "destructive"
            })
        }
        setIsLoading(false);
        handleCloseModal();
        //to refetch the new data from backend
        router.push(`/servers/${server?.id}`);
    }

    const handleCloseModal = () => {
        onClose();
    }


    return (
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-6 pb-2 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">Delete Category</DialogTitle>
                </DialogHeader>
                <DialogDescription className="px-6 text-zinc-500">
                    Are you sure you want to delete {" "}
                        <span className='font-bold'>{selectedCategory?.name}</span>
                    ? This action is irreversible.
                </DialogDescription>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                            <div className="flex items-center ml-auto">
                                <Button 
                                    variant='ghost'
                                    className='mr-2' 
                                    disabled={isLoading}
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    disabled={isLoading}
                                    onClick={deleteCategory}
                                    className='text-white bg-red-500 hover:bg-red-600'
                                >
                                    Delete Category
                                </Button>
                            </div>
                        </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCategoryModal