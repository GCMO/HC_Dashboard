/* eslint-disable padding-line-between-statements */
// useFetch will be used in other components to fetch data from Strapi rather than having to write our fetch everytime. 

import {useEffect, useState} from 'react';

interface Options {
    method: "POST" | "GET" | "PUT" | "DELETE",
    headers?:{[key: string]: string;},
    body?: BodyInit | null;
  };


const useFetch = (url: string, options: Options, shouldFetch) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect( () => {

    // if (!shouldFetch) {
    //   setLoading(false);
    //   return;
    // }

    const fetchData = async () => {
      setLoading(true)

      try {
        const res = await fetch(url, options)
        const json = await res.json()

        setData(json)
        setLoading(false) //no loading if we have the data
      } catch (error) {
        setError(error)
        setLoading(false) //no loading if there is an error
      }
    }

    fetchData()
  }, [])  // [url, options, shouldFetch]

  return {loading, error, data}
}

export default useFetch;