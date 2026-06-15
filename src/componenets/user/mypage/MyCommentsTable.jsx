import React from 'react';
import {useNavigate} from "react-router-dom";
import ErrorMessage from "../../util/ErrorMessage.jsx";
import {formatDate} from "../../util/dateFormater.js";

const MyCommentsTable = ({commentDataList, errorMessage, title = "내가 쓴 댓글"}) => {

    const navigate = useNavigate();

    return (
        <div className="dc-write-container">
            <ErrorMessage errorMessage={errorMessage}/>

            <h2 className="dc-title-main mb-3">{title}</h2>

            <div className="dc-table-container">
                <table className="dc-table">
                    <thead>
                    <tr>
                        <th style={{width: '10%'}}>번호</th>
                        <th style={{width: '50%'}}>댓글 내용</th>
                        <th style={{width: '20%'}}>작성한 게시글</th>
                        {/*<th style={{width: '20%'}}>작성일</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {commentDataList && commentDataList.length > 0 ? (
                        commentDataList.map((comment) => (

                            <tr
                                key={comment.id}
                                style={{cursor: 'pointer'}}
                                onClick={() => navigate(`/board/${comment.boardUrlPath}/post/${comment.postId}`)}
                            >
                                <td>{comment.id}</td>
                                <td style={{textAlign: 'center', paddingLeft: '16px'}}>
                                    {comment.content}
                                </td>
                                <td>
                                    <span style={{color: '#92b4ec', fontWeight: 'bold'}}>
                                        {comment.postTitle}
                                    </span>
                                </td>
                                {/*<td>{formatDate(comment.createAt)}</td>*/}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{padding: '40px', color: '#888888'}}>
                                작성한 댓글이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyCommentsTable;