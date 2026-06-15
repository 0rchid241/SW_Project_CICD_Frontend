import React from "react";

const CategoryTabs = ({
                          categories = [],
                          selectedCategoryId,
                          onSelectCategory,
                      }) => {
    return (
        <div className="dc-category-wrapper dc-flex-row gap-2">
            <div className="dc-flex-row" style={{ marginRight: '16px' }}>
                <button
                    className={`dc-btn dc-btn-lg dc-btn-dark ${selectedCategoryId === null ? "active" : ""}`}
                    onClick={() => onSelectCategory(null)}
                    style={{ borderRadius: 0, marginRight: '2px' }}
                >
                    전체글
                </button>
                <button
                    className={`dc-btn dc-btn-lg dc-btn-dark ${selectedCategoryId === 'POPULAR' ? "active" : ""}`}
                    onClick={() => onSelectCategory('POPULAR')}
                    style={{ borderRadius: 0 }}
                >
                    개념글
                </button>
            </div>

            <div className="dc-flex-row gap-2" style={{ flexWrap: 'wrap' }}>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`dc-btn dc-btn-text ${selectedCategoryId === category.id ? "active" : ""}`}
                        onClick={() => onSelectCategory(category.id)}
                        style={{ color: selectedCategoryId === category.id ? '#ffffff' : '#888888', fontWeight: selectedCategoryId === category.id ? 'bold' : 'normal' }}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryTabs;