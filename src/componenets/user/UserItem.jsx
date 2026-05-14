import React from 'react';
import UserMenuAction from "./UserMenuAction.jsx";

const UserItem = ({authorId,authorName}) => {

    return (
        <div style={{ display: 'flex', justifyContent:'center'}}>
            <span>{authorName}</span>

            <UserMenuAction targetUserId={authorId} />
        </div>
    );
};

export default UserItem;