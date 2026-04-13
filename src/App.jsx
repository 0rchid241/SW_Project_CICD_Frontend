import PostListPage from "./componenets/PostListPage.jsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {Routes,Route} from "react-router-dom";
import PostWritePage from "./componenets/PostWritePage.jsx";

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
                <Routes>
                    {/* 기본 경로는 post 리스트 */}
                    <Route path="/" element={<PostListPage />} />
                    {/* /write 글쓰기 페이지로 이동합니다.*/}
                    <Route path="/write" element={<PostWritePage />} />
                </Routes>
            </ThemeProvider>
        </div>
    );
};

export default App;