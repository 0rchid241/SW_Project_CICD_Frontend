import {useCallback, useContext, useEffect, useState} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import {apiFetch} from "../componenets/util/apiFetch.js";

const useNotifications = () =>{

    const {isLoggedIn,token} = useContext(AuthContext);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);


    /* 최초 1회 알림들을 전부 뽑아오기/. */
    const fetchNotifications = useCallback(async () => {
        try {
            const response =  await apiFetch("/api/notifications");
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(notis=> !notis.isRead).length);
        }catch (e) {
            console.log(e.message);
        }
    }, []);


    /* Sse 파이프 연결
    *  SSE는 일반적으로 헤더에 토큰을 부여해서 줄 수 없다고 함
    *  그래서 따로 토큰을 url뒤에 붙여보내고 그걸 파싱해서 백엔드에서 사용해야 한다고 함 */
    useEffect(() => {
        if(!isLoggedIn) return;


        fetchNotifications();


        /* 파이프 연결 */
        const eventSource = new EventSource(`/api/notifications/subscribe?token=${token}`);

        /* 댓글 이벤트 발생시에 실행될 함수들 세팅 */
        eventSource.addEventListener(`COMMENT`,(event) => {
            const newNotification = JSON.parse(event.data)
            setNotifications((prev)=>[newNotification,...prev])
            setUnreadCount(prev => prev+1);
        })

        // 컴포넌트 언마운트(로그아웃 등) 시 파이프 해제
        return () => {
            eventSource.close();
        };

    }, [isLoggedIn,fetchNotifications,token]);



    /* 읽음 처리 함수 */
    const markAsRead = async (id) => {
        await apiFetch(`/api/notifications/${id}/read`,{
            method:`PATCH`
        })

        setNotifications((prev) =>
            prev.map((noti) => (noti.id === id ? { ...noti, isRead: true } : noti))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    return { notifications, unreadCount, markAsRead };
}
export default useNotifications