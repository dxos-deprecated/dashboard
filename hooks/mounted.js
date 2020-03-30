//
// Copyright 2020 Wireline, Inc.
//

import { useEffect, useRef } from 'react';

// NOTE: Error when imported directly.
// https://github.com/jmlweb/isMounted
// https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
export const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
};
