import {useCallback, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const useUserManager = (urlPath) => {

    const [suspendedUsers, setSuspendedUsers] = useState([]);
    const [pageInfo, setPageInfo] = useState({ totalPages: 0, totalElements: 0 });
    const [loading, setLoading] = useState(false);
    



    /* 정지된 유저들 조회 */
    const fetchSuspendedUsers = useCallback(async (page=0) => {
        if(!urlPath) return;


        try {
            setLoading(true);

            // 스프링 Pageable 스펙에 맞게 쿼리 파라미터 전달 (기본 10개씩)
            const response = await apiFetch(`/api/admin/community/board/${urlPath}/suspended/users?page=${page}&size=10`);
            const data = await response.json();

            // 백엔드의 Page<SuspendedUserResponseDTO> 구조에 맞춰서 상태 업데이트
            setSuspendedUsers(data.content || []);
            setPageInfo({
                totalPages: data.totalPages || 0,
                totalElements: data.totalElements || 0
            });
        }catch (e) {
            console.log(e.message);
            throw e;
        }finally {
            setLoading(false);
        }

    }, [urlPath]);



    return {
        fetchSuspendedUsers,
        suspendedUsers,
        pageInfo,
        loading
    };
}