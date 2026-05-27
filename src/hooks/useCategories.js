import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../componenets/util/apiFetch.js";

export const useCategories = (urlPath) => {
    const [categories, setCategories] = useState([]);
    const [categoryMessage, setCategoryMessage] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);


    /* 카테고리 불러오기 */
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


    /* 카테고리 생성 api호출 */
    const createCategory = async (categoryData) => {

        await apiFetch(`/api/admin/community/board/${urlPath}/category`,{
            method: 'POST',
            body: JSON.stringify(categoryData)
        });

        alert("카테고리가 생성 되었습니다.");
    }
    return {
        categories,
        categoryMessage,
        categoryLoading,
        fetchCategories,
        createCategory
    };
};