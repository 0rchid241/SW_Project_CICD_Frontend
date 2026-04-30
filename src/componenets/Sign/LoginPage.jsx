import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import ErrorMessage from "../util/ErrorMessage.jsx";
import {Button} from "@mui/material";
import {apiFetch} from "../util/apiFetch.js";

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


const LoginPage = () => {

    const [formData, setFormData] = useState({
        username:'',
        password:''
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();


    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData({
            ...formData,
            [name]:value
        });
    };



    const handleLogin = async () => {
        setLoading(true);

        try {
            const response = await apiFetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(formData)
            });
            /* 응답된 jwtTokenResponseDTO 로 login 진행*/
            const jwtTokenData = await response.json();
            /* 전역 Context의 로그인 함수 사용해서 로그인 */
            login(jwtTokenData);
            alert("로그인에 성공했습니다.");
            // window.dispatchEvent(new Event("auth-change"));
            navigate("/");
        } catch (e){
            setErrorMessage(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={pageStyle}>

            <ErrorMessage errorMessage={errorMessage}/>

            <h1 style={{ marginBottom: "24px" }}>로그인</h1>
                <form onSubmit={handleLogin}>
                    <label>아이디</label>
                    <input
                        type="text"
                        name={"username"}
                        value={formData.username}
                        onChange={handleChange}
                        style={inputStyle}
                        placeholder="아이디 입력"
                    />

                    <label>비밀번호</label>
                    <input
                        type="password"
                        name={"password"}
                        value={formData.password}
                        onChange={handleChange}
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

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {window.location.href = "/api/oauth/google/login";}}
                    >
                        Google로 계속하기
                    </Button>
                </form>
        </div>
    );
};

export default LoginPage;