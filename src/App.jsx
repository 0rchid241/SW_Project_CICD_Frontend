import BoardPage from "./componenets/Post/BoardPage.jsx";
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
import SuperAdminDashboard from "./componenets/admin/superAdmin/SuperAdminDashboard.jsx";
import NaverOAuthSignupPage from "./componenets/Sign/NaverOAuthSignupPage.jsx";
import KakaoOAuthSignupPage from "./componenets/Sign/KakaoOAuthSignupPage.jsx";
import CommunityAdminDashboard from "./componenets/admin/communityAdmin/CommunityAdminDashboard.jsx";
import PostEditPage from "./componenets/Post/PostEditPage.jsx";
import BoardLayout from "./componenets/Board/BoardLayout.jsx"; // 💡 BoardLayout import 추가

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
                            {/* 1. 전체 공통 레이아웃 (글로벌 헤더/푸터 등) */}
                            <Route element={<LayOut/>}>
                                {/* 기본 경로들 */}
                                <Route path={"/"} element={<BoardListPage />} />
                                <Route path={"/ops"} element={<OpsPage/>}/>
                                <Route path={"/me"} element={<MyPage/>}/>
                                <Route path={"/admin/superAdminPage"} element={<SuperAdminDashboard/>}/>

                                {/* /board/popular는 특정 갤러리가 아니므로 밖으로 분리 */}
                                <Route path={"/board/popular"} element={<PopularPostListPage/>}/>

                                {/* 로그인 및 회원가입 관련 */}
                                <Route path={"/signup"} element={<SignupPage/>}/>
                                <Route path={"/login"} element={<LoginPage/>}/>
                                <Route path={"/oauth/google/signup"} element={<GoogleOAuthSignupPage/>}/>
                                <Route path={"/oauth/naver/signup"} element={<NaverOAuthSignupPage/>}/>
                                <Route path={"/oauth/kakao/signup"} element={<KakaoOAuthSignupPage/>}/>
                                <Route path={"/oauth/success"} element={<OAuthSuccessPage/>}/>


                                {/*  특정 갤러리 도메인 레이아웃 (중첩 라우팅) */}
                                <Route path={"/board/:urlPath"} element={<BoardLayout />}>
                                    {/* url: /board/:urlPath (부모와 동일할 때는 index 사용) */}
                                    <Route index element={<BoardPage />} />

                                    {/* url: /board/:urlPath/write (앞의 경로는 생략하고 상대경로로 작성) */}
                                    <Route path="write" element={<PostWritePage />} />

                                    {/* url: /board/:urlPath/edit/:postId */}
                                    <Route path="edit/:postId" element={<PostEditPage/>}/>

                                    {/* url: /board/:urlPath/post/:postId */}
                                    <Route path="post/:postId" element={<PostDetailPage/>}/>

                                    {/* url: /board/:urlPath/admin */}
                                    <Route path="admin" element={<CommunityAdminDashboard/>}/>
                                </Route>

                            </Route>
                        </Routes>
                    </Container>

                </ThemeProvider>
            </AuthProvider>
        </div>
    );
};

export default App;