'use client';

import React from 'react';
import { useState } from 'react';
import {
  ChannelType,
  MemberRole,
  IServerOptionalProps
} from '@/utils/constants';
import TooltipActions from '../TooltipActions';
import {
  ChevronDown,
  Plus,
  Settings,
  MoreVertical,
  Edit,
  Trash
} from 'lucide-react';
import { useModal } from '@/hooks/zustand/useModal';
import Server from '@/types/Server';
import Category from '@/types/Category';

interface ServerCategoryProps {
  server: Server;
  category: Category;
  role: MemberRole;
  userId: number;
}

//TODO: rename component to ServerCategory (more precise name?)
const ServerCategory = ({
  category,
  role,
  userId,
  server
}: ServerCategoryProps) => {
  const { onOpen } = useModal();

  const [rotateChevron, setRotateChevron] = useState(false);
  const handleRotate = () => setRotateChevron(!rotateChevron);
  const rotate = rotateChevron ? 'rotate(-90deg)' : 'rotate(0)';

  return (
    <div
      className="flex items-center justify-between py-2 group"
      onClick={handleRotate}
    >
      <p className="flex items-center text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-200 cursor-pointer transition">
        <ChevronDown
          className="h-4 w-4 mr-1"
          style={{ transform: rotate, transition: 'all 0.2s linear' }}
        />
        {category.name}
      </p>
      {role !== MemberRole.MEMBER && (
        <div className="flex items-center">
          <TooltipActions label="Edit category" side="top" align="center">
            <div
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpen('editCategory', {
                  selectedCategory: category,
                  userId,
                  server
                });
              }}
            >
              <Edit className="h-4 w-4" />
            </div>
          </TooltipActions>
          <TooltipActions label="Delete category" side="top" align="center">
            <div
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition mr-2"
              onClick={(e) => {
                e.stopPropagation();
                onOpen('deleteCategory', {
                  selectedCategory: category,
                  userId,
                  server
                });
              }}
            >
              <Trash className="h-4 w-4" />
            </div>
          </TooltipActions>
          <TooltipActions label="Create channel" side="top" align="center">
            <div
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
              onClick={(e) => {
                e.stopPropagation();
                onOpen('createChannel', { selectedCategory: category, userId });
              }}
            >
              <Plus className="h-4 w-4" />
            </div>
          </TooltipActions>
        </div>
      )}
    </div>
  );
};

export default ServerCategory;
