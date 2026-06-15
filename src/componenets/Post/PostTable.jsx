import React from 'react';
import PostItem from "./PostItem.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";

const PostTable = ({
                       defaultUrlPath,
                       postDataList,
                       errorMessage
                   }) => {

    return (
        <div>
            <ErrorMessage errorMessage={errorMessage}/>

            <div className="mb-3">
                <table className="dc-table">
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>카테고리</th>
                        <th>제목</th>
                        <th>글쓴이</th>
                        <th>작성일</th>
                        <th>조회수</th>
                        <th>추천수</th>
                    </tr>
                    </thead>
                    <tbody>
                    {postDataList && postDataList.length > 0 ? (
                        postDataList.map((post) => (
                            <PostItem
                                key={post.id}
                                data={post}
                                urlPath={defaultUrlPath || post.boardUrlPath}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" style={{ padding: '40px', color: '#888888' }}>
                                등록된 게시글이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostTable;