import React, { useState, useRef, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import { cn } from '@/lib/utils';

interface SearchbarInputProps {
  handleScrollLeft: () => void;
  currentTags: {
    name: string;
    value: string;
    userId?: string;
  }[];
  inputRef: any;
  text: string;
  setText: (text: string) => void;
  hasPlaceholder: boolean;
  setHasPlaceholder: (hasPlaceholder: boolean) => void;
  setXIconVisible: (visible: boolean) => void;
  getSearchResults: () => void;
}

const SearchbarInput = ({
  handleScrollLeft,
  currentTags,
  inputRef,
  text,
  setText,
  hasPlaceholder,
  setHasPlaceholder,
  setXIconVisible,
  getSearchResults
}: SearchbarInputProps) => {
  //for showing/hiding placeholder
  useEffect(() => {
    if (hasPlaceholder && currentTags.length > 0) {
      setHasPlaceholder(false);
    } else if (!hasPlaceholder && currentTags.length === 0 && text === '') {
      setHasPlaceholder(true);
    }
  }, [currentTags.length]);

  //change text based on placeholder
  useEffect(() => {
    if (hasPlaceholder) {
      setText('Search');
    } else {
      setText('');
    }
  }, [hasPlaceholder]);

  useEffect(() => {
    //for showing/hiding x icon
    if (currentTags.length > 0 || (!hasPlaceholder && text !== '')) {
      setXIconVisible(true);
    } else if (hasPlaceholder || text === '') {
      setXIconVisible(false);
    }

    //set onFocus, onBlur and onKeydown events for inputRef
    if (inputRef.current) {
      inputRef.current.onfocus = () => {
        if (hasPlaceholder) {
          setHasPlaceholder(false);
          setText('');
        }
      };

      inputRef.current.onblur = () => {
        if (!hasPlaceholder && currentTags.length === 0 && text === '') {
          setHasPlaceholder(true);
          setText('Search');
        }
      };

      inputRef.current.onkeydown = (
        event: React.KeyboardEvent<HTMLSpanElement>
      ) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          //handle submit logic here
          getSearchResults();
        } else if (
          event.key === 'ArrowLeft' &&
          window.getSelection()?.anchorOffset === 0
        ) {
          handleScrollLeft();
        }
      };
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.onfocus = null;
        inputRef.current.onblur = null;
        inputRef.current.onkeydown = null;
      }
    };
  }, [inputRef.current, hasPlaceholder, currentTags.length, text]);

  return (
    <span className="w-[100%]">
      <ContentEditable
        html={text}
        tagName="span"
        className={cn(
          'block h-[30px] flex-grow flex-shrink-0 w-[100%] border-none whitespace-nowrap text-xs pr-3',
          'leading-[30px]',
          hasPlaceholder && 'text-zinc-400 dark:text-zinc-500'
        )}
        style={{ outline: '1px solid transparent' }}
        onChange={(e) => {
          setText(e.target.value.replace(/&nbsp;/g, ' '));
        }}
        innerRef={inputRef}
      />
    </span>
  );
};

export default SearchbarInput;
