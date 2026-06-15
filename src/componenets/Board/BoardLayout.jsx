import React from 'react';
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useBoardNav } from "../../hooks/useBoardNav.js";
import LoadingCircle from "../util/LoadingCircle.jsx";

const BoardLayout = () => {
    const { urlPath } = useParams();
    const navigate = useNavigate();
    const { navInfo, loading } = useBoardNav(urlPath);

    if (loading) return <LoadingCircle />;

    return (
        <div>
            <header className="dc-board-header" onClick={() => navigate(`/board/${urlPath}`)}>
                <h1 className="dc-title-main" style={{ cursor: 'pointer' }}>
                    {navInfo?.name || "로딩 중..."}
                </h1>
            </header>

            <Outlet />
        </div>
    );
};

export default BoardLayout;