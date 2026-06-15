import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import PopularPostPreview from "./PopularPostPreview.jsx";
import {apiFetch} from "../util/apiFetch.js";

const BoardListPage = () => {

    const [boardsData, setBoardsData] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoards = async () =>{
            try {
                const response = await apiFetch("/api/community/board/getAllBoards");
                const data = await response.json();
                setBoardsData(data);
            }catch (e){
                console.log(`커뮤니티 목록 불러오던 중 오류발생 ${e}`)
            }
        }
        fetchBoards();
    }, []);

    return (
        <div className="dc-write-container">

            <PopularPostPreview/>
            <h2 className="dc-title-main mb-3">커뮤니티 목록</h2>

            <p style={{ color: '#888888', marginBottom: '16px', fontSize: '14px' }}>
                관심 있는 갤러리를 선택하여 게시글을 확인해보세요.
            </p>

            <div className="dc-table-container mt-3">
                <table className="dc-table">
                    <thead>
                    <tr>
                        <th style={{ width: '30%' }}>게시판 이름</th>
                        <th>설명</th>
                    </tr>
                    </thead>
                    <tbody>
                    {boardsData.map((board) => (
                        <tr key={board.id}>
                            <td
                                style={{ fontWeight: 'bold', cursor: 'pointer', color: '#92b4ec' }}
                                onClick={() => navigate(`/board/${board.urlPath}`)}
                            >
                                {board.name}
                            </td>
                            <td>{board.description || '게시판 설명이 없습니다.'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BoardListPage;