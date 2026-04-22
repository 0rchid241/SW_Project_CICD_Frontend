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

const buttonRowStyle = {
    marginTop: "28px",
    display: "flex",
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

const messageBoxStyle = {
    marginTop: "16px",
    padding: "14px 16px",
    border: "1px solid #d0d7de",
    borderRadius: "12px",
    backgroundColor: "#1f1f1f",
    color: "#f1f1f1",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    lineHeight: "1.5",
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
    const [deployLoading, setDeployLoading] = useState(false);
    const [deployMessage, setDeployMessage] = useState("");
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

    const runDeploy = async() => {
        try {
            setDeployLoading(true);
            setDeployMessage("배포 진행 중입니다...");

            const previousActive = summary?.activeBackend;

            const targetBackend = previousActive === "blue" ? "green" : previousActive === "green" ? "blue" : null;

            const response = await fetch("/api/ops/deploy", {
                method: "POST",
            });

            if (!response.ok) {
                throw new Error("배포 요청 실패");
            }

            let attempts = 0;
            const maxAttempts = 40;
            const intervalMs = 3000;

            const poll = async () => {
                try {
                    const summaryResponse = await fetch("/api/ops/summary");
                    if (!summaryResponse.ok) {
                        throw new Error("상태 조회 실패");
                    }

                    const newSummary = await summaryResponse.json();
                    const currentActive = newSummary.activeBackend;

                    const isFinished = targetBackend &&
                        (targetBackend === "blue" || targetBackend === "green") &&
                        currentActive === targetBackend;

                    // 목표 슬롯으로 정확히 바뀐 경우 완료 판정
                    if (isFinished) {
                        setSummary(newSummary);
                        setDeployMessage(`배포가 완료되었습니다. 현재 활성 서버: ${currentActive}`);
                        setDeployLoading(false);
                        return;
                    }

                    attempts += 1;

                    if (attempts >= maxAttempts) {
                        setDeployMessage("배포 요청은 등록되었지만 완료 여부를 아직 확인하지 못했습니다. 상태를 다시 확인해주세요.");
                        setDeployLoading(false);
                        return;
                    }

                    setTimeout(poll, intervalMs);
                } catch (err) {
                    console.error(err);
                    setDeployMessage("배포 진행 상태를 확인하는 중 오류가 발생했습니다.");
                    setDeployLoading(false);
                }
            };

            setTimeout(poll, intervalMs);
        } catch (err) {
            console.error(err);
            setDeployMessage("배포 요청 중 오류 발생");
        } finally {
            setDeployLoading(false);
        }
    };

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

            <div style={buttonRowStyle}>
                <button style={buttonStyle} onClick={fetchSummary}>상태 새로고침</button>

                <button style={buttonStyle} onClick={runDeploy} disabled={deployLoading}>{deployLoading ? "배포 요청 중..." : "무중단 배포 실행"}</button>
            </div>

            {deployMessage && (
                <div style={messageBoxStyle}>
                    <strong style={{ color: "1f1f1f" }}>배포 결과</strong>
                    <div style={{ marginTop: "8px", color:"#f1f1f1" }}>{deployMessage}</div>
                </div>
            )}
        </div>
    );
};

export default OpsPage;