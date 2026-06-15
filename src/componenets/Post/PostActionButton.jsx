import React, {useState} from 'react';
import {usePostAction} from "../../hooks/usePostAction.js";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {isAdmin} from "../util/roleUtils.js";

const PostActionButton = ({ urlPath, postId, isLoggedIn, authorUserId }) => {

    const {moveEditPost, deletePost, verifyPassword} = usePostAction(urlPath,postId);

    const [showInput, setShowInput] = useState(false);
    const [actionType, setActionType] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(``);

    const {userId, role} = useAuth();

    const handleAction = async (type) => {
        setErrorMessage(``);

        try {
            const isAnonymousPost = !authorUserId;
            const isMyPost = isLoggedIn && (userId === authorUserId);

            if (isMyPost || isAdmin(role)) {
                if (type === 'edit') moveEditPost();
                else await deletePost();
                return;
            }

            if (!isAnonymousPost) {
                throw new Error("회원이 작성한 글은 본인만 수정/삭제할 수 있습니다.");
            }

            if (!showInput || actionType !== type) {
                setShowInput(true);
                setActionType(type);
                return;
            }

            await verifyPassword(password);
            if (type === 'edit') moveEditPost(password);
            else await deletePost(password);

        } catch (e) {
            setErrorMessage(e.message);
        }
    };


    // 엔터 키 입력 처리 함수 추가
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 폼 제출 등 기본 브라우저 동작 방지
            handleAction(actionType);
        }
    };


    return (
        <div className="mt-2">
            <ErrorMessage errorMessage={errorMessage} />

            <div className="dc-flex-end gap-1">
                {showInput && (
                    <input
                        type="password"
                        className="dc-search-input"
                        style={{ width: '150px', padding: '6px 12px' }}
                        placeholder={`${actionType === 'edit' ? '수정' : '삭제'} 비밀번호`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        onKeyDown={handleKeyDown} /* 이벤트 연결 */
                    />
                )}

                {/* 수정 버튼: 평소엔 다크, 눌렸을 땐 메인 파란색 */}
                <button
                    className={`dc-btn dc-btn-md ${actionType === 'edit' ? 'dc-btn-primary' : 'dc-btn-dark'}`}
                    onClick={() => handleAction('edit')}
                >
                    수정
                </button>

                {/* 삭제 버튼: 평소엔 아웃라인, 눌렸을 땐 빨간색 */}
                <button
                    className={`dc-btn dc-btn-md ${actionType === 'delete' ? 'dc-btn-danger' : 'dc-btn-outline'}`}
                    onClick={() => handleAction('delete')}
                >
                    삭제
                </button>
            </div>
        </div>
    );
};

export default PostActionButton;