import React, { useState } from 'react';

const pageStyle = {
    maxWidth: "420px",
    margin: "60px auto",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "8px",
    marginBottom: "16px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxSizing: "border-box",
};

const buttonStyle = {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#111827",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
};

const messageStyle = {
    marginTop: "16px",
    padding: "12px",
    borderRadius: "10px",
    backgroundColor: "#f1f1f1",
    color: "#111827",
};

const SignupPage = () => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    nickname,
                }),
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(text || "회원가입에 실패했습니다.");
            }

            setMessage("회원가입이 완료되었습니다.");
            setUsername("");
            setEmail("");
            setPassword("");
            setNickname("");
        } catch (err) {
            console.error(err);
            setMessage(err.message || "회원가입 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <h1 style={{ marginBottom: "24px" }}>회원가입</h1>

            <label>아이디</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                placeholder="로그인에 사용할 아이디"
            />

            <label>이메일</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="user@example.invalid"
            />

            <label>비밀번호</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="8자 이상 입력"
            />

            <label>닉네임</label>
            <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                style={inputStyle}
                placeholder="닉네임 입력"
            />

            <button
                type="button"
                style={buttonStyle}
                onClick={handleSignup}
                disabled={loading}
            >
                {loading ? "가입 중..." : "회원가입"}
            </button>

            {message && <div style={messageStyle}>{message}</div>}
        </div>
    );
};

export default SignupPage;