import React, { useEffect, useState } from 'react';

const pageStyle = {
    padding: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
};

const titleStyle = {
    marginBottom: "8px",
};

const subTextStyle = {
    color: "$666",
    marginBottom: "24px",
};

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
};

const labelStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
};

const valueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
};

const topBoxStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
};

const buttonStyle = {
    padding: "10px 16px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
};

const activeCardStyle = {
    ...cardStyle,
    border: "2px solid #222",
};

function StatusCard({ title, value, highlight = false }) {
    return (
        <div style={highlight ? activeCardStyle : cardStyle}>
            <div style={labelStyle}>{title}</div>
            <div style={valueStyle}>{value}</div>
        </div>
    );
}

const OpsPage = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchSummary = async () => {
        try{
            setLoading(true);
            setError("");

            const response = await fetch("/api/ops/summary");
            if (!response.ok) {
                throw new Error("운영 상태 조회 실패");
            }

            const data = await response.json();
            setSummary(data);
        } catch (err) {
            setError("운영 상태를 불러오지 못했습니다.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSummary();
    }, []);

    if (loading) {
        return <div style={pageStyle}>운영 상태 불러오는 중...</div>;
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <h1 style={titleStyle}>운영 페이지</h1>
                <p>{error}</p>
                <button style={buttonStyle} onClick={fetchSummary}>다시 시도</button>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={topBoxStyle}>
                <div>
                    <h1 style={titleStyle}>운영 페이지</h1>

                    <p style={subTextStyle}>현재 서버 상태를 확인하는 내부 운영 대시보드</p>
                </div>
                <button style={buttonStyle} onClick={fetchSummary}>상태 새로고침</button>
            </div>

            <div style={gridStyle}>
                <StatusCard
                    title="현재 활성 백엔드"
                    value={summary.activeBackend}
                    highlight={true}
                />
                <StatusCard title="Frontend Blue" value={summary.frontendBlue} />
                <StatusCard title="Frontend Green" value={summary.frontendGreen} />
                <StatusCard title="Backend Blue" value={summary.backendBlue} />
                <StatusCard title="Backend Green" value={summary.backendGreen} />
                <StatusCard title="DB" value={summary.db} />
                <StatusCard title="Nginx" value={summary.nginx} />
            </div>
        </div>
    );
};

export default OpsPage;