import React from 'react';
import CommentItem from './CommentItem.jsx';

const CommentList = ({commentDataList,onAddReply,onDelete,onUpdate,onVerifyPassword}) => {

    if (!commentDataList || commentDataList.length === 0) {
        return (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888888', borderBottom: '1px solid #333333' }}>
                등록된 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
            </div>
        );
    }

    return (
        <div>
            {commentDataList.map((rootComment) => (
                <div key={rootComment.id}>
                    <CommentItem
                        comment={rootComment}
                        isChild={false}
                        onAddReply={onAddReply}
                        onDelete={onDelete}
                        onUpdate={onUpdate}
                        onVerifyPassword={onVerifyPassword}
                    />

                    {rootComment.children && rootComment.children.map((childComment) => (
                        <CommentItem
                            key={childComment.id}
                            comment={childComment}
                            isChild={true}
                            onAddReply={onAddReply}
                            onDelete={onDelete}
                            onUpdate={onUpdate}
                            onVerifyPassword={onVerifyPassword}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default CommentList;