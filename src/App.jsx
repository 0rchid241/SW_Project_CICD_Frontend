import PostListPage from "./componenets/Post/PostListPage.jsx";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Routes,Route} from "react-router-dom";

import OpsPage from "./componenets/OpsPage.jsx";
import PostWritePage from "./componenets/Post/PostWritePage.jsx";
import PostDetailPage from "./componenets/Post/PostDetailPage.jsx";
import BoardListPage from "./componenets/Board/BoardListPage.jsx";
import LayOut from "./componenets/util/LayOut.jsx";
import PopularPostPreview from "./componenets/Board/PopularPostPreview.jsx";
import PopularPostListPage from "./componenets/Post/PopularPostListPage.jsx";

/* MUI의 기본 다크 테마*/
const darkTheme = createTheme({
    palette:{
        mode:"dark"
    }
});

const App = () => {

    return (
        <div>
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

                            {/* 인기 게시글 목록으로 이동*/}
                            <Route path={"/board/popular"} element={<PopularPostListPage/>}/>


                        </Route>
                    </Routes>
                </Container>

            </ThemeProvider>
        </div>
    );
};

export default App;