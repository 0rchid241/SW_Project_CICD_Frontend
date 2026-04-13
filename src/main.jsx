import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

/* MUI 라이브러리 사용을 위한 roboto폰트*/
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {BrowserRouter} from "react-router-dom";


createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* react-dom-router를 사용해서 페이지 분할했습니다. */}
      <BrowserRouter>
          <App/>
      </BrowserRouter>
  </StrictMode>,
)
