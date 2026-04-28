import {createContext, useEffect, useState} from "react";


/* 전역 보관함 */
export const AuthContext = createContext(null);


export const AuthProvider = ({children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState(null)
    const [nickname, setNickname] = useState(null)

    useEffect(() => {
        const savedToken = localStorage.getItem('accessToken');
        const savedNickname = localStorage.getItem('nickname');
        const savedUsername = localStorage.getItem('username');

        if(savedToken){
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setToken(savedToken);
            setIsLoggedIn(true);
            setNickname(savedNickname);
            setUsername(savedUsername);

            /* 여기에 공용 네트워크 API 호출 불러오면 된다네. */
        }

    }, []);

    /* 로그인 처리 함수
    * data는 tokenResponseDTO */
    const login = (data) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("username", data.username);
        localStorage.setItem("nickname", data.nickname);

        /* 전역 로그인 상태 및 토큰 업데이트 */
        setToken(data.accessToken);
        setUsername(data.username);
        setNickname(data.nickname)
        setIsLoggedIn(true);
    };

    // 로그아웃 처리 함수
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem("username");
        localStorage.removeItem("nickname");
        setToken(null);
        setUsername(null);
        setIsLoggedIn(false);
    };

    //
    return (
        <AuthContext.Provider value={{isLoggedIn,token, username,nickname,login,logout}}>
            {children}
        </AuthContext.Provider>
    );

}
