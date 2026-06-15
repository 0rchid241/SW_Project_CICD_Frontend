import React, {useState} from 'react';
import {useLocation, useParams} from "react-router-dom";
import CategoryManager from "./CategoryManager.jsx";
import UserManager from "./UserManager.jsx";

const CommunityAdminDashboard = () => {
    const {urlPath} = useParams();
    const [activeMenu, setActiveMenu] = useState('CATEGORY');
    const {state} = useLocation();
    const boardName = state?.boardName;

    const renderContent = () => {
        switch (activeMenu) {
            case 'CATEGORY': return <CategoryManager urlPath={urlPath} />;
            case 'USER': return <UserManager urlPath={urlPath} />;
            default: return <CategoryManager urlPath={urlPath} />;
        }
    }

    return (
        <div className="dc-mypage-layout">
            {/* 사이드바 */}
            <aside className="dc-sidebar">
                <div style={{ padding: '16px', borderBottom: '1px solid #333' }}>
                    <div style={{ fontWeight: 'bold', color: '#fff' }}>커뮤니티 관리</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{boardName || urlPath}</div>
                </div>
                <button
                    className={`dc-sidebar-item ${activeMenu === 'CATEGORY' ? 'active' : ''}`}
                    onClick={() => setActiveMenu('CATEGORY')}
                >
                    카테고리 관리
                </button>
                <button
                    className={`dc-sidebar-item ${activeMenu === 'USER' ? 'active' : ''}`}
                    onClick={() => setActiveMenu('USER')}
                >
                    유저 관리
                </button>
            </aside>

            {/* 컨텐츠 */}
            <main style={{ flexGrow: 1 }}>
                {renderContent()}
            </main>
        </div>
    );
};

export default CommunityAdminDashboard;