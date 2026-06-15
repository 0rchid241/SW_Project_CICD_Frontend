import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext.jsx";
import { apiFetch } from "../../util/apiFetch.js";
import ErrorMessage from "../../util/ErrorMessage.jsx";

const UserInfo = () => {
    const navigate = useNavigate();
    const { authReady, isLoggedIn, updateNickname } = useAuth();

    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [showNicknameForm, setShowNicknameForm] = useState(false);
    const [nicknameInput, setNicknameInput] = useState("");

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const fetchMe = async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await apiFetch("/api/users/me", { method: "GET" });
            const data = await response.json();
            setMe(data);
            setNicknameInput(data.nickname || "");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authReady) return;
        if (!isLoggedIn) {
            alert("로그인이 필요한 페이지입니다.");
            navigate("/login");
            return;
        }
        fetchMe();
    }, [authReady, isLoggedIn]);

    const handleOpenNicknameForm = () => {
        setErrorMessage(""); setSuccessMessage("");
        setNicknameInput(me?.nickname || "");
        setShowNicknameForm(true);
    };

    const handleChangeNickname = async () => {
        const trimmedNickname = nicknameInput.trim();
        if (!trimmedNickname) { setErrorMessage("닉네임을 입력하세요."); return; }
        if (trimmedNickname.length < 2 || trimmedNickname.length > 30) {
            setErrorMessage("닉네임은 2자 이상 30자 이하로 입력하세요."); return;
        }
        try {
            await apiFetch("/api/users/me/nickname", {
                method: "PATCH",
                body: JSON.stringify({ nickname: trimmedNickname }),
            });
            setMe(prev => ({ ...prev, nickname: trimmedNickname }));
            updateNickname(trimmedNickname);
            setShowNicknameForm(false);
            setSuccessMessage("닉네임이 변경되었습니다.");
        } catch (error) { setErrorMessage(error.message); }
    };

    const handleOpenPasswordForm = () => {
        setErrorMessage(""); setSuccessMessage("");
        setCurrentPassword(""); setNewPassword(""); setNewPasswordConfirm("");
        setShowPasswordForm(true);
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword) { setErrorMessage("모든 항목을 입력하세요."); return; }
        if (newPassword.length < 8) { setErrorMessage("새 비밀번호는 8자 이상 입력하세요."); return; }
        if (newPassword !== newPasswordConfirm) { setErrorMessage("새 비밀번호 확인이 일치하지 않습니다."); return; }
        try {
            await apiFetch("/api/users/me/password", {
                method: "PATCH",
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            setShowPasswordForm(false);
            setSuccessMessage("비밀번호가 변경되었습니다.");
        } catch (error) { setErrorMessage(error.message); }
    };

    if (!authReady || loading) return <div style={{ padding: '40px', color: '#fff' }}>로딩 중...</div>;

    return (
        <div className="dc-write-container">
            <h2 className="dc-title-main mb-3">내 정보</h2>
            <ErrorMessage errorMessage={errorMessage} />
            {successMessage && <div style={{ color: '#52c41a', marginBottom: '16px' }}>{successMessage}</div>}

            <div className="dc-write-form-box">
                {/* 유저 기본 정보 */}
                <div style={{ color: '#ccc', marginBottom: '24px', lineHeight: '2' }}>
                    <p><strong>아이디:</strong> {me?.username || "정보 없음"}</p>
                    <p><strong>이메일:</strong> {me?.email || "정보 없음"}</p>
                    <p><strong>닉네임:</strong> {me?.nickname || "정보 없음"}</p>
                </div>

                {/* 닉네임 변경 폼 */}
                <div className="mb-3">
                    {!showNicknameForm ? (
                        <button className="dc-btn dc-btn-md dc-btn-dark" onClick={handleOpenNicknameForm}>닉네임 변경</button>
                    ) : (
                        <div className="dc-flex-row gap-1">
                            <input className="dc-input-box" value={nicknameInput} onChange={e => setNicknameInput(e.target.value)} />
                            <button className="dc-btn dc-btn-md dc-btn-primary" onClick={handleChangeNickname}>저장</button>
                            <button className="dc-btn dc-btn-md dc-btn-outline" onClick={() => setShowNicknameForm(false)}>취소</button>
                        </div>
                    )}
                </div>

                {/* 비밀번호 변경 폼 */}
                <div>
                    {me?.socialUser ? (
                        <div className="dc-btn-dark" style={{ padding: '10px' }}>소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.</div>
                    ) : !showPasswordForm ? (
                        <button className="dc-btn dc-btn-md dc-btn-dark" onClick={handleOpenPasswordForm}>비밀번호 변경</button>
                    ) : (
                        <div className="dc-flex-row gap-1" style={{ alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                                <input className="dc-input-box" type="password" placeholder="현재 비밀번호" onChange={e => setCurrentPassword(e.target.value)} />
                                <input className="dc-input-box" type="password" placeholder="새 비밀번호" onChange={e => setNewPassword(e.target.value)} />
                                <input className="dc-input-box" type="password" placeholder="새 비밀번호 확인" onChange={e => setNewPasswordConfirm(e.target.value)} />
                            </div>
                            <div className="dc-flex-row gap-1">
                                <button className="dc-btn dc-btn-md dc-btn-primary" onClick={handleChangePassword}>변경</button>
                                <button className="dc-btn dc-btn-md dc-btn-outline" onClick={() => setShowPasswordForm(false)}>취소</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserInfo;