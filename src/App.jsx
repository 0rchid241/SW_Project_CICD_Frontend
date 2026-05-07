import PostListPage from "./componenets/Post/PostListPage.jsx";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Routes,Route} from "react-router-dom";

import SignupPage from "./componenets/Sign/SignupPage.jsx";
import OpsPage from "./componenets/OpsPage.jsx";
import PostWritePage from "./componenets/Post/PostWritePage.jsx";
import PostDetailPage from "./componenets/Post/PostDetailPage.jsx";
import BoardListPage from "./componenets/Board/BoardListPage.jsx";
import LayOut from "./componenets/util/LayOut.jsx";
import LoginPage from "./componenets/Sign/LoginPage.jsx";
import PopularPostListPage from "./componenets/Post/PopularPostListPage.jsx";
import MyPage from "./componenets/user/mypage/MyPage.jsx";
import GoogleOAuthSignupPage from "./componenets/Sign/GoogleOAuthSignupPage.jsx";
import OAuthSuccessPage from "./componenets/Sign/OAuthSuccessPage.jsx";
import {AuthContext, AuthProvider} from "./context/AuthContext.jsx";
import SuperAdminPage from "./componenets/admin/SuperAdminPage.jsx";

/* MUI의 기본 다크 테마*/
const darkTheme = createTheme({
    palette:{
        mode:"dark"
    }
});

const App = () => {

    return (
        <div>
            <AuthProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline />
                    <Container maxWidth="lg" sx={{ mt: 5, mb: 5, minHeight: '80vh' }}>
                        <Routes>
                            {/* 전체적으로 레이아웃 적용 */}
                            <Route element={<LayOut/>}>
                                {/* 기본 경로는 Board 들의 리스트 */}
                                <Route path={"/"} element={<BoardListPage />} />


                                {/* 특정 커뮤니티의 게시글 리스트 출력 */}
                                <Route path={"/board/:urlPath"} element={<PostListPage/>}/>
                                {/* /write 글쓰기 페이지로 이동합니다.*/}
                                <Route path={"/board/:urlPath/write"} element={<PostWritePage />} />
                                {/* 상세 글 페이지로 이동합니다. */}
                                <Route path={"/board/:urlPath/post/:id"} element={<PostDetailPage/>}/>

                                {/*운영 대시보드로 이동합니다.*/}
                                <Route path={"/ops"} element={<OpsPage/>}/>

                                {/*회원가입 페이지로 이동합니다.*/}
                                <Route path={"/signup"} element={<SignupPage/>}/>
                                {/*로그인 페이지로 이동합니다.*/}
                                <Route path={"/login"} element={<LoginPage/>}/>
                                {/*회원가입 페이지로 이동합니다.*/}
                                <Route path={"/signup"} element={<SignupPage/>}/>
                                {/*로그인 페이지로 이동합니다.*/}
                                <Route path={"/login"} element={<LoginPage/>}/>
                                {/*구글 계정 회원가입 페이지로 이동합니다.*/}
                                <Route path={"/oauth/google/signup"} element={<GoogleOAuthSignupPage/>}/>
                                {/*소셜 계정 회원가입 성공 페이지로 이동합니다.*/}
                                <Route path={"/oauth/success"} element={<OAuthSuccessPage/>}/>

                                {/*개인 페이지로 이동합니다.*/}
                                <Route path={"/me"} element={<MyPage/>}/>

                                {/* 인기 게시글 목록으로 이동*/}
                                <Route path={"/board/popular"} element={<PopularPostListPage/>}/>

                                {/* 전체 관리자 페이지로 이동.*/}
                                <Route path={"/admin/superAdminPage"} element={<SuperAdminPage/>}/>

                            </Route>
                        </Routes>
                    </Container>

                </ThemeProvider>
            </AuthProvider>

        </div>
    );
};

export default App;