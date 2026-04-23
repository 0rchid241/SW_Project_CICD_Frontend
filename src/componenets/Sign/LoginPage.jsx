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

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            setLoading(true);
            setMessage("");

            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "로그인에 실패했습니다.");
            }

            localStorage.setItem("accessToken", data.accessToken);
            setMessage("로그인에 성공했습니다.");

            setEmail("");
            setPassword("");
        } catch (err) {
            console.error(err);
            setMessage(err.message || "로그인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>
            <h1 style={{ marginBottom: "24px" }}>로그인</h1>

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
                placeholder="비밀번호 입력"
            />

            <button
                type="button"
                style={buttonStyle}
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "로그인 중..." : "로그인"}
            </button>

            {message && <div style={messageStyle}>{message}</div>}
        </div>
    );
};

export default LoginPage;