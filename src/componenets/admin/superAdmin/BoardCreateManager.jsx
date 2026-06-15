import React, {useState} from 'react';
import {useSuperAdmin} from "../../../hooks/useSuperAdmin.js";

const BoardCreateManager = () => {
    const {loading, createBoard, status, setStatus} = useSuperAdmin();
    const [formData, setFormData] = useState({ name: '', urlPath: '', description: '' });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (status?.message) setStatus({});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const isSuccess = await createBoard(formData);
        if (isSuccess) {
            setFormData({ name: '', urlPath: '', description: '' });
        }
    }

    return (
        <div className="dc-write-form-box">
            <h3 style={{ color: '#fff', marginBottom: '8px' }}>커뮤니티 생성</h3>
            <p style={{ color: '#888', marginBottom: '20px', fontSize: '14px' }}>
                시스템에 새로운 커뮤니티(게시판)를 추가합니다.
            </p>

            {status?.message && (
                <div style={{ color: status.type === 'error' ? '#ff4d4f' : '#52c41a', marginBottom: '16px' }}>
                    {status.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                    className="dc-input-box"
                    name="name"
                    placeholder="커뮤니티 이름 (ex: 피파온라인)"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    className="dc-input-box"
                    name="urlPath"
                    placeholder="URL 경로 (ex: fifa)"
                    value={formData.urlPath}
                    onChange={handleChange}
                    required
                />
                <textarea
                    className="dc-input-box"
                    name="description"
                    placeholder="이 커뮤니티의 주제를 짧게 설명해주세요."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                />

                <div className="dc-flex-end">
                    <button type="submit" className="dc-btn dc-btn-md dc-btn-primary" disabled={loading}>
                        {loading ? '생성 중...' : '커뮤니티 생성하기'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardCreateManager;