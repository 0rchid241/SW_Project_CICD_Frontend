import React, { useState } from 'react';
import ErrorMessage from "../util/ErrorMessage.jsx";

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


const SignupPage = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    
    const [formData, setFormData] = useState({
        username:'',
        email:'',
        password:'',
        nickname:''
    });

    const handleChange = (e) =>{
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    };


    const handleSignup = async () => {
        setLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:JSON.stringify(formData)
            });


            if(response.ok){
                alert("회원가입 성공");
            }else {
                /* 회원가입시 예외처리되어 반환된 ErrorResponse를 받아서 출력 */
                const errorResponse = await response.json();
                setErrorMessage(errorResponse.message)
            }
        }catch {
            setErrorMessage("서버와 통신할 수 없습니다.");
        }finally {
            setLoading(false);
        }

    };

    return (
        <div style={pageStyle}>

            <ErrorMessage errorMessage={errorMessage}/>

            <h1 style={{ marginBottom: "24px" }}>회원가입</h1>

            <label>아이디</label>
            <input
                type="text"
                name={"username"}
                value={formData.username}
                onChange={handleChange}
                style={inputStyle}
                placeholder="로그인에 사용할 아이디"
            />

            <label>이메일</label>
            <input
                type="email"
                name={"email"}
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="user@example.invalid"
            />

            <label>비밀번호</label>
            <input
                type="password"
                name={"password"}
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="8자 이상 입력"
            />

            <label>닉네임</label>
            <input
                type="text"
                name={"nickname"}
                value={formData.nickname}
                onChange={handleChange}
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


        </div>
    );
};

export default SignupPage;