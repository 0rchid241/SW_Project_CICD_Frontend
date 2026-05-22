import React from "react";
import { Box, Button } from "@mui/material";

const CategoryTabs = ({
                          categories = [],
                          selectedCategoryId,
                          onSelectCategory,
                      }) => {
    return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Button
                variant={selectedCategoryId === null ? "contained" : "outlined"}
                onClick={() => onSelectCategory(null)}
            >
                전체
            </Button>

            {categories.map((category) => (
                <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? "contained" : "outlined"}
                    onClick={() => onSelectCategory(category.id)}
                >
                    {category.name}
                </Button>
            ))}
        </Box>
    );
};

export default CategoryTabs;