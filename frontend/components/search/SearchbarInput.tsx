import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SearchbarInputProps {
  handleScrollLeft: () => void;
  currentTags: {
    name: string;
    value: string;
  }[];
  inputRef: any;
  placeHolder: {
    hasPlaceholder: boolean;
    text: string;
  };
  setPlaceHolder: (placeHolder: {
    hasPlaceholder: boolean;
    text: string;
  }) => void;
  setXIconVisible: (visible: boolean) => void;
  getSearchResults: () => void;
}

const SearchbarInput = ({
  handleScrollLeft,
  currentTags,
  inputRef,
  placeHolder,
  setPlaceHolder,
  setXIconVisible,
  getSearchResults
}: SearchbarInputProps) => {
  //for showing/hiding placeholder
  useEffect(() => {
    if (placeHolder.hasPlaceholder && currentTags.length > 0) {
      setPlaceHolder({ ...placeHolder, hasPlaceholder: false });
    } else if (
      !placeHolder.hasPlaceholder &&
      currentTags.length === 0 &&
      inputRef.current?.innerText === ''
    ) {
      setPlaceHolder({ ...placeHolder, hasPlaceholder: true });
    }
  }, [currentTags.length, inputRef.current]);

  useEffect(() => {
    //for showing/hiding x icon
    if (
      currentTags.length > 0 ||
      (!placeHolder.hasPlaceholder && inputRef.current?.innerText !== '')
    ) {
      setXIconVisible(true);
    } else if (placeHolder.hasPlaceholder) {
      setXIconVisible(false);
    }

    //set onFocus, onBlur and onInput events for inputRef
    if (inputRef.current) {
      inputRef.current.onfocus = () => {
        if (placeHolder.hasPlaceholder) {
          setPlaceHolder({ ...placeHolder, hasPlaceholder: false });
        }
      };

      inputRef.current.onblur = () => {
        if (
          !placeHolder.hasPlaceholder &&
          currentTags.length === 0 &&
          inputRef.current?.innerText === ''
        ) {
          setPlaceHolder({ ...placeHolder, hasPlaceholder: true });
        }
      };

      inputRef.current.oninput = () => {
        if (inputRef.current?.innerText === '' && currentTags.length === 0) {
          setXIconVisible(false);
        } else {
          setXIconVisible(true);
        }
      };
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.onfocus = null;
        inputRef.current.onblur = null;
        inputRef.current.oninput = null;
      }
    };
  }, [inputRef.current, placeHolder.hasPlaceholder, currentTags.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
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

  return (
    <span className="w-[100%]">
      <span
        className={cn(
          'block h-[30px] flex-grow flex-shrink-0 w-[100%] border-none whitespace-nowrap text-xs pr-3',
          'leading-[30px]',
          placeHolder.hasPlaceholder && 'text-zinc-400 dark:text-zinc-500'
        )}
        style={{ outline: '1px solid transparent' }}
        contentEditable={true}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        ref={inputRef}
        suppressContentEditableWarning={true}
      >
        {placeHolder.hasPlaceholder && <>{placeHolder.text}</>}
      </span>
    </span>
  );
};

export default SearchbarInput;
