import React, { useState, useRef, useEffect, use } from 'react';
import { cn } from '@/lib/utils';

interface SearchbarInputProps {
  handleScrollLeft: () => void;
  currentTags: string[];
}

const SearchbarInput = ({
  handleScrollLeft,
  currentTags
}: SearchbarInputProps) => {
  const [placeHolder, setPlaceHolder] = useState({
    hasPlaceholder: true,
    text: 'Search'
  });
  const inputRef = useRef<HTMLSpanElement>(null);

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
    //set onFocus and onBlur events for inputRef
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
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.onfocus = null;
        inputRef.current.onblur = null;
      }
    };
  }, [inputRef.current, placeHolder.hasPlaceholder, currentTags.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      //handle submit logic here
      console.log('Enter key pressed');
    } else if (
      event.key === 'ArrowLeft' &&
      window.getSelection()?.anchorOffset === 0
    ) {
      handleScrollLeft();
    }
  };

  return (
    <span
      className={cn(
        'block h-[30px] flex-grow flex-shrink-0 w-[max-content] border-none whitespace-nowrap text-xs pr-3',
        'leading-[30px]',
        placeHolder.hasPlaceholder && 'text-zinc-400 dark:text-zinc-500'
      )}
      style={{ outline: '1px solid transparent' }}
      contentEditable="true"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      // onFocus={() => {
      //   if (placeHolder.hasPlaceholder) {
      //     setPlaceHolder({ ...placeHolder, hasPlaceholder: false });
      //   }
      // }}
      // onBlur={() => {
      //   if (
      //     !placeHolder.hasPlaceholder &&
      //     currentTags.length === 0 &&
      //     inputRef.current?.innerText === ''
      //   ) {
      //     setPlaceHolder({ ...placeHolder, hasPlaceholder: true });
      //   }
      // }}
      ref={inputRef}
      suppressContentEditableWarning={true}
    >
      {placeHolder.hasPlaceholder && <>{placeHolder.text}</>}
    </span>
  );
};

export default SearchbarInput;
