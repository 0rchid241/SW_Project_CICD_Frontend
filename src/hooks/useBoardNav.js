import {useCallback, useEffect, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const useBoardNav = (urlPath) => {


    const [navInfo, setNavInfo] = useState(null);
    const [errorMessage, setErrorMessage] = useState(``);
    const [loading, setLoading] = useState(false)


    const fetchNavInfo = useCallback(async () => {
        if(!urlPath) return;
        
        try {
            setLoading(true);
            const response = await apiFetch(`/api/community/board/${urlPath}/nav`);
            const data = await response.json();
            setNavInfo(data);
        }catch (e) {
            setErrorMessage(e.message);
        }finally {
            setLoading(false);
        }
    },[urlPath]);


    useEffect(() => {
        fetchNavInfo();
    }, [fetchNavInfo]);


    return {navInfo,errorMessage, loading};
}