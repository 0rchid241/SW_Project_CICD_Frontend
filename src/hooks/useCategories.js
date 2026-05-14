import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../componenets/util/apiFetch.js";

export const useCategories = (urlPath) => {
    const [categories, setCategories] = useState([]);
    const [categoryMessage, setCategoryMessage] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        if (!urlPath) return;

        try {
            setCategoryLoading(true);
            setCategoryMessage("");

            const response = await apiFetch(`/api/community/board/${urlPath}/categories`);
            const data = await response.json();

            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setCategoryMessage(err.message || "카테고리를 불러오지 못했습니다.");
            setCategories([]);
        } finally {
            setCategoryLoading(false);
        }
    }, [urlPath]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        categoryMessage,
        categoryLoading,
        fetchCategories,
    };
};