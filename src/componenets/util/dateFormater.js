export const formatDate = (dateString) => {

    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();


    // 연, 월, 일 비교를 위한 변수
    const isToday =
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate();

    const isThisYear = date.getFullYear() === now.getFullYear();


    // 한 자리 숫자일 경우 앞에 0을 붙여주는 헬퍼 함수 (ex. 9 -> 09)
    const pad = (num) => String(num).padStart(2, '0');


    if (isToday) {
        // 금일 작성된 글: HH:mm
        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (isThisYear) {
        // 올해 작성된 글: MM/DD
        return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    } else {
        // 연도가 변경된 글: YYYY/MM/DD
        return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}`;
    }
}

export const formatDetailDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const pad = (num) => String(num).padStart(2, '0');

    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const min = pad(date.getMinutes());

    // 무조건 년/월/일 시간 (YYYY/MM/DD HH:mm) 형식으로 반환
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
};

