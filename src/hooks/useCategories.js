import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../componenets/util/apiFetch.js";

export const useCategories = (urlPath) => {
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [categoryLoading, setCategoryLoading] = useState(false);


    /* 활성화된 카테고리 불러오기
    *  게시판에서 사용할거  */
    const fetchActiveCategories = useCallback(async () => {
        if (!urlPath) return;

        try {
            setCategoryLoading(true);
            setErrorMessage("");

            const response = await apiFetch(`/api/community/board/${urlPath}/categories`);
            const data = await response.json();

            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorMessage(err.message || "카테고리를 불러오지 못했습니다.");
            setCategories([]);
        } finally {
            setCategoryLoading(false);
        }
    }, [urlPath]);


    const fetchAllCategories = useCallback(async () => {
        if (!urlPath) return;
        try {
            setCategoryLoading(true);
            const response = await apiFetch(`/api/admin/community/board/${urlPath}/categories/all`);
            const data = await response.json();
            setCategories(Array.isArray(data) ? data : []);
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setCategoryLoading(false);
        }
    }, [urlPath]);



    /* 카테고리 활성화 상태 변경 */
    const toggleCategoryStatus = async (categoryId, currentStatus) => {
        // 프론트엔드에서 목표 상태(!currentStatus)를 명시적으로 계산해서 백엔드에 전달
        const targetStatus = !currentStatus;

        await apiFetch(`/api/admin/community/board/${urlPath}/category/${categoryId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ active: targetStatus })
        });

        // 상태 변경이 완료되면 관리자용 전체 목록을 다시 불러와서 화면 갱신
        await fetchAllCategories();
    };




    /* 카테고리 생성 api호출 */
    const createCategory = async (categoryData) => {

        await apiFetch(`/api/admin/community/board/${urlPath}/category`,{
            method: 'POST',
            body: JSON.stringify(categoryData)
        });

        alert("카테고리가 생성 되었습니다.");
        await fetchAllCategories();

    }



    /* 카테고리 순서 변경 */
    const reorderCategory = async (categoryIdList) => {
        // categoryIdList: [3, 1, 5, 2] 형태의 ID 배열
        await apiFetch(`/api/admin/community/board/${urlPath}/category/reorder`, {
            method: 'PATCH',
            body: JSON.stringify({ categoryIdList })
        });
        await fetchAllCategories();
    }




    return {
        categories,
        errorMessage,
        categoryLoading,
        fetchActiveCategories,
        fetchAllCategories,
        createCategory,
        toggleCategoryStatus,
        reorderCategory
    };
};