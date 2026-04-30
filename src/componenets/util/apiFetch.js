export const apiFetch = async (url, options={} )=>{

    const token = localStorage.getItem('accessToken');

    const defaultHeader ={
            "Content-Type": "application/json",
            /* 로그인 상태라면 헤더에 token 추가 */
            ...(token && {"Authorization": `Bearer ${token}`})
        };


    const configOptions = {
        ...options,
        headers: {
            ...defaultHeader,
            ...options.headers
        }
    }

    /* 커스텀한 옵션으로 fetch 요청 */
    const response = await fetch(url,configOptions);

    /* response 공통 에러 처리 */
    if(!response.ok){
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "서버와 통신할 수 없습니다.");
    }

    return response;
}