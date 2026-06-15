import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {apiFetch} from "../util/apiFetch.js";
import {useCategories} from "../../hooks/useCategories.js";

const PostWritePage = () => {

    const navigate = useNavigate();
    const {urlPath} = useParams();
    const { categories, categoryMessage, fetchActiveCategories } = useCategories(urlPath);
    const [errorMessage, setErrorMessage] = useState("");
    const {isLoggedIn} = useContext(AuthContext);

    useEffect(() => {
        fetchActiveCategories();
    }, [urlPath]);

    const [formData, setFormData] = useState({
        authorName: '',
        password: '',
        title: '',
        categoryId: '',
        content: ''
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            setErrorMessage("제목과 내용을 입력해주세요.");
            return;
        }
        if (!formData.categoryId) {
            setErrorMessage("카테고리를 선택해주세요.");
            return;
        }
        if (!isLoggedIn && (!formData.authorName || !formData.password)) {
            setErrorMessage("닉네임과 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const requestBody = {
                ...formData,
                categoryId: Number(formData.categoryId)
            };

            await apiFetch(`/api/community/board/${urlPath}/write`, {
                method: "POST",
                body: JSON.stringify(requestBody)
            });

            alert("글이 성공적으로 등록되었습니다.");
            navigate(`/board/${urlPath}`);
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="dc-write-container">
            <h2 className="dc-title-sub">새 글 작성</h2>
            <ErrorMessage errorMessage={errorMessage || categoryMessage} />

            <div className="dc-write-form-box">
                {/* 닉네임/비밀번호 영역 */}
                {!isLoggedIn && (
                    <div className="dc-flex-row gap-1 mb-2">
                        <input
                            type="text"
                            className="dc-input-box"
                            name="authorName"
                            placeholder="닉네임"
                            value={formData.authorName}
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            className="dc-input-box"
                            name="password"
                            placeholder="비밀번호"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                )}

                {/* 제목 */}
                <input
                    type="text"
                    className="dc-input-box mb-2"
                    name="title"
                    placeholder="제목을 입력하세요"
                    value={formData.title}
                    onChange={handleChange}
                />

                {/* 카테고리 선택 */}
                <select
                    className="dc-input-box mb-2"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                >
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {/* 본문 */}
                <textarea
                    className="dc-input-box"
                    name="content"
                    rows={15}
                    placeholder="본문 내용을 입력하세요"
                    value={formData.content}
                    onChange={handleChange}
                />
            </div>

            {/* 하단 버튼 영역 */}
            <div className="dc-flex-end gap-1 mt-3">
                <button
                    className="dc-btn dc-btn-md dc-btn-outline"
                    onClick={() => navigate(`/board/${urlPath}`)}
                >
                    취소
                </button>
                <button
                    className="dc-btn dc-btn-md dc-btn-primary"
                    onClick={handleSubmit}
                >
                    등록
                </button>
            </div>
        </div>
    );
};

export default PostWritePage;