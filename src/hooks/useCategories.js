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


    /* 카테고리 비활성화 api 호출 */
    const deactivateCategory = async (categoryId) => {
        await apiFetch(`/api/admin/community/board/${urlPath}/category/${categoryId}/deactivate`,{
            method:'PATCH'
        })

        await fetchCategories(); // 성공 시 목록 새로고침
        alert("카테고리가 비활성화 되었습니다.");
    }



    /* 카테고리 순서 변경 */
    const reorderCategory = async (categoryIdList) => {
        // categoryIdList: [3, 1, 5, 2] 형태의 ID 배열
        await apiFetch(`/api/admin/community/board/${urlPath}/category/reorder`, {
            method: 'PATCH',
            body: JSON.stringify({ categoryIdList })
        });
        // DB 업데이트 후 최신 목록으로 동기화
        await fetchCategories();
    }








    return {
        categories,
        categoryMessage,
        categoryLoading,
        fetchCategories,
        createCategory,
        deactivateCategory,
        reorderCategory
    };
};