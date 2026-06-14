import React from "react";
import { Box, Button } from "@mui/material";

const CategoryTabs = ({
                          categories = [],
                          selectedCategoryId, // null(전체글), 'POPULAR'(개념글), 또는 category.id(숫자)
                          onSelectCategory,
                      }) => {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "2px solid #29365c", // 하단 파란색 줄
                mb: 3,
                bgcolor: "#1e1e1e", // 전체 배경색 (필요시 부모 요소로 이동)
                p: 1
            }}
        >
            {/* 1. 좌측 고정 탭 (전체글, 개념글) */}
            <Box sx={{ display: "flex", mr: 3 }}>
                <Button
                    disableElevation
                    onClick={() => onSelectCategory(null)}
                    sx={{
                        borderRadius: "0",
                        bgcolor: selectedCategoryId === null ? "#3b4874" : "#555555",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        mr: "2px", // 버튼 사이 틈
                        "&:hover": { bgcolor: selectedCategoryId === null ? "#2a3556" : "#444444" }
                    }}
                >
                    전체글
                </Button>
                <Button
                    disableElevation
                    onClick={() => onSelectCategory('POPULAR')}
                    sx={{
                        borderRadius: "0",
                        bgcolor: selectedCategoryId === 'POPULAR' ? "#3b4874" : "#555555",
                        color: "#fff",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        "&:hover": { bgcolor: selectedCategoryId === 'POPULAR' ? "#2a3556" : "#444444" }
                    }}
                >
                    개념글
                </Button>
            </Box>

            {/* 2. 우측 동적 카테고리 탭 */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
                {categories.map((category) => (
                    <Button
                        key={category.id}
                        variant="text"
                        onClick={() => onSelectCategory(category.id)}
                        sx={{
                            minWidth: "auto",
                            p: 0,
                            color: selectedCategoryId === category.id ? "#fff" : "#999999",
                            fontWeight: selectedCategoryId === category.id ? "bold" : "normal",
                            "&:hover": { bgcolor: "transparent", color: "#fff" }
                        }}
                    >
                        {/* 백엔드 데이터에 아이콘이 없다면 임의로 매핑하거나 이름만 출력 */}
                        {category.name}
                    </Button>
                ))}
            </Box>
        </Box>
    );
};

export default CategoryTabs;