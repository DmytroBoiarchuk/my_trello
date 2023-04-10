import React, { useEffect, useRef, useState } from 'react';

export default function useOutsideAlerterFor2(initialIsVisible: boolean) {
  const [isShow, setIsShow] = useState(initialIsVisible);
  const ref: React.Ref<any> = useRef(null);
  const ref2: React.Ref<any> = useRef(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target) && ref2.current && !ref2.current.contains(event.target)) {
      setIsShow(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });
  return { ref, ref2, isShow, setIsShow };
}
