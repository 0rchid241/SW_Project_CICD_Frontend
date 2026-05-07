import React from 'react';
import UserMenuActionPresenter from "./UserMenuActionPresenter.jsx";
import UserMenuActionContainer from "./UserMenuActionContainer.jsx";

const UserItem = ({authorId,authorName}) => {

    return (
        <div style={{ display: 'flex', justifyContent:'center'}}>
            <span>{authorName}</span>

            {/*
        이 컴포넌트는 내부적으로 로직을 처리하며,
        일반 유저일 경우 렌더링되지 않도록 Container 내부에서 제어 가능
      */}
            <UserMenuActionContainer targetUserId={authorId} />
        </div>
    );
};

export default UserItem;