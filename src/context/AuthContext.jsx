import {createContext, useContext, useEffect, useState} from "react";


/* 전역 보관함 */
export const AuthContext = createContext(null);


export const AuthProvider = ({children}) => {
    const [authReady, setAuthReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [role, setRole] = useState(null);
    const [userId, setUserId] = useState(null);


    const getPayloadFromToken = (token) => {
        if (!token) return null;
        try {
            // JWT의 두 번째 부분(Payload)을 Base64 디코딩
            return JSON.parse(atob(token.split(".")[1]));
        } catch (error) {
            console.error("JWT 페이로드 파싱 실패:", error);
            return null;
        }
    };



    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedNickname = localStorage.getItem('nickname');
        const savedUsername = localStorage.getItem('username');

        if(savedToken){
            const payload = getPayloadFromToken(savedToken); // 💡 새로고침 시 토큰 다시 파싱

            if (payload) {
                const extractedUserId = payload.sub ? Number(payload.sub) : null;

                setToken(savedToken);
                setIsLoggedIn(true);
                setNickname(savedNickname);
                setUsername(savedUsername);
                setRole(payload.role || null); // 통일된 페이로드에서 바로 추출
                setUserId(extractedUserId);    // 괄호 안 오타 수정 (userId -> extractedUserId)
            } else {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("username");
                localStorage.removeItem("nickname");
            }
        }

        setAuthReady(true);
    }, []);



    /* 로그인 처리 함수
    * data는 tokenResponseDTO */
    const login = (data) => {
        const payload = getPayloadFromToken(data.accessToken);
        // 백엔드에서 setSubject로 넣은 값은 'sub' 키로 추출됨
        const extractedUserId = payload.sub ? Number(payload.sub) : null;

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("username", data.username);
        localStorage.setItem("nickname", data.nickname);

        /* 전역 로그인 상태 및 토큰 업데이트 */
        setToken(data.accessToken);
        setUsername(data.username);
        setNickname(data.nickname);
        setRole(payload?.role || null);
        setUserId(extractedUserId); // 전역 상태에 userId 저장
        setIsLoggedIn(true);
    };

    // 닉네임 변경 함수
    const updateNickname = (newNickname) => {
        localStorage.setItem("nickname", newNickname);
        setNickname(newNickname);
    };

    // 로그아웃 처리 함수
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem("username");
        localStorage.removeItem("nickname");

        setToken(null);
        setUsername(null);
        setNickname(null);
        setRole(null);
        setIsLoggedIn(false);
        setUserId(null); // 로그아웃 시 ID도 초기화
    };


    //
    return (
        <AuthContext.Provider
            value={{
                authReady,
                isLoggedIn,
                userId,
                token,
                username,
                nickname,
                role,
                login,
                logout,
                updateNickname,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
    }

    return context;
};