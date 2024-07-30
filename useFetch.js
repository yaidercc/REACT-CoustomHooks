import { useEffect, useState } from "react";

const localCached = {};

export const useFetch = (url) => {
  const [state, setState] = useState({
    data: null,
    isLoading: true,
    hasError: false,
    error: null,
  });

  useEffect(() => {
    getFetch();
  }, [url]);

  const setLoadingState = () =>{
    setState({
      data: null,
      isLoading: true,
      hasError: false,
      error: false
    })
  }

  const getFetch = async () => {

    if(localCached[url]){
      setState({
        data: localCached[url],
        isLoading: false,
        hasError: false,
        error:null
      });
      return
    }

    setLoadingState();

    const response = await fetch(url);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!response.ok) {
      setState({
        data: null,
        isLoading: false,
        hasError: true,
        error: {
          code: response.status,
          message: response.statusText,
        },
      });
      return;
    }

    const data = await response.json();
    setState({
      data: data,
      isLoading: false,
      hasError: false,
      error: null,
    });
    localCached[url] = data;
  };

  return {
    data: state.data,
    isLoading: state.isLoading,
    hasError: state.error,
  };
};
