import React, {useState} from 'react';
import {useParams} from "react-router-dom";
import UserMenuActionPresenter from "./UserMenuActionPresenter.jsx";
import {apiFetch} from "../util/apiFetch.js";
import ErrorMessage from "../util/ErrorMessage.jsx";

const UserMenuActionContainer = ({targetUserId}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const {urlPath} = useParams();
    const [errorMessage, setErrorMessage] = useState("")
    
    const handleOpenMenu = (e)=>{
        setAnchorEl(e.currentTarget);
    }

    const handleCloseMenu = ()=>{
        setAnchorEl(null);
    }


   /* 권한부여 api호출 */
    const handleGrantAdmin = async () => {
        try {
            await apiFetch("/api/admin/super/grant",{
                method:"POST",
                body: JSON.stringify({
                    userId:targetUserId,
                    boardUrlPath:urlPath
                })
            })
            alert(`성공적으로 Community Admin 권한이 부여됐습니다.`);
        }catch (e) {
            setErrorMessage(e.message)
        }
    }

    return (
        <>
            <ErrorMessage errorMessage={errorMessage}/>
            <UserMenuActionPresenter
                anchorElement={anchorEl}
                onOpenMenu={handleOpenMenu}
                onCloseMenu={handleCloseMenu}
                onGrantAdmin={handleGrantAdmin}
            />
        </>

    );
};

export default UserMenuActionContainer;