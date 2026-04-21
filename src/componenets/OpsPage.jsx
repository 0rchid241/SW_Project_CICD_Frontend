import React from 'react';

const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "16px",
    minWidth: "180px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginTop: "20px",
}

const OpsPage = () => {
    const summary = {
        activeBackend: "",
        frontend: "",
        backendBlue: "",
        backendGreen: "",
        db: "",
        nginx: "",
        lastDeployResult: "",
    };

    return (
        <div style={{ padding: "24px" }}>
            <h1>운영 페이지</h1>
            <p>현재 활성 서버: {summary.activeBackend}</p>
            <p>최근 배포 결과: {summary.lastDeployResult}</p>

            <div style={gridStyle}>
                <div style={cardStyle}>
                    <h3>Frontend</h3>
                    <p>{summary.frontend}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Backend Blue</h3>
                    <p>{summary.backendBlue}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Backend Green</h3>
                    <p>{summary.backendGreen}</p>
                </div>

                <div style={cardStyle}>
                    <h3>DB</h3>
                    <p>{summary.db}</p>
                </div>

                <div style={cardStyle}>
                    <h3>Nginx</h3>
                    <p>{summary.nginx}</p>
                </div>
            </div>

            <div style={{ marginTop: "24px" }}>
                <button>상태 새로고침</button>
                <button style={{ marginLeft: "12px" }}>무중단 배포 실행</button>
            </div>
        </div>
    );
};

export default OpsPage;