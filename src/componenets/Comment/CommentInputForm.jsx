import React, { useState } from 'react';
import ErrorMessage from "../util/ErrorMessage.jsx";

const CommentInputForm = ({onSubmit, isLoggedIn}) => {

    const [commentData, setCommentData] = useState({
        authorName: "",
        password:"",
        content: ""
    })
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = (e)=>{
        const {name,value} = e.target
        setCommentData({
            ...commentData,
            [name]:value
        });
    }

    const handleCreateComment = async ()=>{
        if(!commentData.content){
            setErrorMessage("내용을 입력해주세요.");
            return;
        }
        if(!isLoggedIn && (!commentData.authorName || !commentData.password)){
            setErrorMessage("이름, 비밀번호를 입력해주세요");
            return;
        }

        try {
            await onSubmit(commentData);
            setCommentData({
                authorName: "",
                password: "",
                content: ""
            });
            setErrorMessage("")
        }catch (e) {
            setErrorMessage(e.message);
        }
    }

    return (
        <div style={{ backgroundColor: '#1e1e1e', padding: '16px', border: '1px solid #333333', borderRadius: '2px' }}>

            <ErrorMessage errorMessage={errorMessage}/>

            <div className="dc-flex-row gap-1" style={{ alignItems: 'flex-start' }}>

                {/* 비회원 정보 입력란 */}
                {!isLoggedIn && (
                    <div style={{ width: '130px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                            type="text"
                            className="dc-input-box"
                            placeholder="닉네임"
                            name="authorName"
                            value={commentData.authorName}
                            onChange={handleChange}
                            style={{ padding: '8px' }}
                        />
                        <input
                            type="password"
                            className="dc-input-box"
                            placeholder="비밀번호"
                            name="password"
                            value={commentData.password}
                            onChange={handleChange}
                            style={{ padding: '8px' }}
                        />
                    </div>
                )}

                {/* 댓글 본문 작성 영역 */}
                <textarea
                    className="dc-input-box"
                    placeholder="타인에 대한 욕설 또는 비방 목적의 악플은 제재될 수 있습니다."
                    rows={isLoggedIn ? "2" : "3"}
                    name="content"
                    value={commentData.content}
                    onChange={handleChange}
                    style={{ flexGrow: 1 }}
                />

                {/* 등록 버튼 */}
                <button
                    className="dc-btn dc-btn-md dc-btn-primary"
                    onClick={handleCreateComment}
                    style={{ height: isLoggedIn ? '55px' : '88px' }}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default CommentInputForm;