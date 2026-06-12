import {useCallback, useState} from "react";
import {apiFetch} from "../componenets/util/apiFetch.js";

export const useSuperAdmin = () =>{



    //  관리자 목록을 담을 새로운 상태
    const [adminUserList, setAdminUserList] = useState([]);
    const [status, setStatus] = useState({})
    const [loading, setLoading] = useState(false)

    /* formData로 게시판 생성 */
    const createBoard = async (formData) => {

        // 1. 프론트엔드 1차 유효성 검사 (UX 향상)
        if (formData.name.length < 2) {
            setStatus({ type: 'error', message: '커뮤니티 이름은 2자 이상이어야 합니다.' });
            return false;
        }

        const urlRegex = /^[a-z0-9]+$/;
        if (!urlRegex.test(formData.urlPath)) {
            setStatus({ type: 'error', message: 'URL 경로는 영문 소문자와 숫자만 사용할 수 있습니다.' });
            return false;
        }
        try {
            setLoading(true);

            await apiFetch('/api/admin/super/create/board', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setStatus({ type: 'success', message: `[${formData.name}] 커뮤니티가 성공적으로 생성되었습니다!` });
            return true;

        } catch (error) {
            setStatus({ type: 'error', message: error.message });
            return false;
        }finally {
            setLoading(false);
        }
    }



    /* 💡 게시판별 관리자 목록 출력 (새로 추가된 로직) */
    const fetchAdminUsers = useCallback(async () => {
        try {
            setLoading(true);

            // 아까 만든 백엔드 API 호출
            const response = await apiFetch('/api/admin/super/board-admins');
            const data = await response.json();

            // 데이터 상태 업데이트
            setAdminUserList(data);

        } catch (error) {
            console.error("관리자 목록 로딩 실패:", error);
            setStatus({ type: 'error', message: '관리자 목록을 불러오는데 실패했습니다.' });
        } finally {
            setLoading(false);
        }
    }, []);


    /* 관리자 권한 박탈하기 */
    const revokeAdmin = useCallback( async (urlPath,userId)=> {
        await apiFetch(`/api/admin/super/${urlPath}/board-admins/${userId}`, {
            method: 'DELETE'
        });

        return true;
    },[])



    return {
        status,
        setStatus,
        loading,
        createBoard,

        adminUserList,
        fetchAdminUsers,
        revokeAdmin
    }
}