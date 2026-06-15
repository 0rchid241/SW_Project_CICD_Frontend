import React, { useState } from 'react';
import UserInfo from "./UserInfo.jsx";
import MyPosts from "./MyPosts.jsx";
import MyCommentsContainer from "./MyCommentsContainer.jsx";

const MyPage = () => {
    const [activeMenu, setActiveMenu] = useState(`INFO`);

    const renderContent = () => {
        switch (activeMenu) {
            case 'INFO': return <UserInfo/>;
            case 'POSTS': return <MyPosts/>;
            case 'COMMENTS': return <MyCommentsContainer/>;
            case 'SETTINGS': return <div style={{ color: '#888' }}>환경설정 (준비 중)</div>;
            default : return <UserInfo/>
        }
    };

    return (
        <div className="dc-mypage-layout">
            {/* 사이드바 영역 */}
            <aside className="dc-sidebar">
                <button className={`dc-sidebar-item ${activeMenu === 'INFO' ? 'active' : ''}`} onClick={() => setActiveMenu('INFO')}>내 정보</button>
                <button className={`dc-sidebar-item ${activeMenu === 'POSTS' ? 'active' : ''}`} onClick={() => setActiveMenu('POSTS')}>내가 쓴 글</button>
                <button className={`dc-sidebar-item ${activeMenu === 'COMMENTS' ? 'active' : ''}`} onClick={() => setActiveMenu('COMMENTS')}>내가 쓴 댓글</button>
                <button className={`dc-sidebar-item ${activeMenu === 'SETTINGS' ? 'active' : ''}`} onClick={() => setActiveMenu('SETTINGS')}>환경설정</button>
            </aside>

            {/* 컨텐츠 영역 */}
            <div style={{ flexGrow: 1 }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default MyPage;