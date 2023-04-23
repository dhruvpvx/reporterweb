import React, { useCallback } from 'react';

const useLocalState = (key, value = '') => {
  const inital = localStorage.getItem(key);
  const [state, setState] = React.useState(inital ? JSON.parse(inital) : value);

  React.useEffect(() => {
    if (key && state) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);
  return [state, useCallback(setState, [setState])];
};

export default useLocalState;
