import React, { useEffect, useRef, useState } from 'react';

export default function useOutsideAlerter(initialIsVisible: boolean): {
  ref: React.RefObject<HTMLFormElement>;
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const [isShow, setIsShow] = useState(initialIsVisible);
  const ref: React.Ref<HTMLFormElement> = useRef(null);

  const handleClickOutside = (event: MouseEvent): void => {
    if ((ref.current && !(ref.current instanceof Node)) || !ref.current?.contains(event.target as Node)) {
      setIsShow(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  return { ref, isShow, setIsShow };
}
