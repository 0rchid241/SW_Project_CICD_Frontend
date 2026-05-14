import {apiFetch} from "../componenets/util/apiFetch.js";
import {useParams} from "react-router-dom";

const useUserAdminAction = ({targetUserId})=>{

    const {urlPath} = useParams();


    /* 권한부여 api호출 */
    const handleGrantAdmin = async () => {
        await apiFetch("/api/admin/super/grant", {
            method: "POST",
            body: JSON.stringify({
                userId: targetUserId,
                boardUrlPath: urlPath
            })
        })
    }


    const warnUser = async ()=>{
        const reason = prompt("해당 유저에게 경고를 부여합니다. 사유를 입력하세요:");

        if(!reason) return;

        await apiFetch(`/api/admin/community/board/${urlPath}/user/${targetUserId}/warning`,{
            method:"POST",
            body: JSON.stringify({
                reason:reason
            })
        })
    }

    return {handleGrantAdmin,warnUser}

}

export default useUserAdminAction