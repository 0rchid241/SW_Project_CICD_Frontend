import React, {useState} from 'react';
import {
    Box, Typography, TextField, Button, Stack, Divider,
    List, ListItem, ListItemText, CircularProgress, Paper
} from '@mui/material';
import {useCategories} from "../../hooks/useCategories.js";
import ErrorMessage from "../util/ErrorMessage.jsx";

const CategoryManager = ({urlPath}) => {

    const {categories,fetchCategories,createCategory,categoryLoading} = useCategories(urlPath);

    const [errorMessage, setErrorMessage] = useState("")

    const [formData, setFormData] = useState({
        categoryName:'',
        displayOrder: 0
    });

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };



    const handleCreateCategory = async () => {
        try {

            setErrorMessage("");
            // DTO의 타입(int)에 맞게 형변환해서 전송
            const payload = {
                categoryName: formData.categoryName,
                displayOrder: parseInt(formData.displayOrder, 10) || 0
            };

            await createCategory(payload);
            setFormData({ categoryName: '', displayOrder: 0 });

        }catch (e) {
            setErrorMessage(e.message)
        }finally {
            fetchCategories();
        }

    }


    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                카테고리 관리
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* 에러 메시지 출력 영역 */}
            <ErrorMessage errorMessage={errorMessage} />

            {/* 카테고리 생성 폼 */}
            <Paper elevation={0} sx={{ p: 2, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>새 카테고리 생성</Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        label="카테고리 이름"
                        size="small"
                        name={"categoryName"}
                        value={formData.categoryName}
                        onChange={(e) =>handleChange(e)}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        label="표시 순서 (숫자)"
                        type="number"
                        size="small"
                        name={"displayOrder"}
                        value={formData.displayOrder}
                        onChange={(e) => handleChange(e)}
                        sx={{ width: 120 }}
                    />
                    <Button variant="contained" onClick={handleCreateCategory}>
                        생성
                    </Button>
                </Stack>
            </Paper>

            {/* 카테고리 목록 리스트 */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                카테고리 목록
            </Typography>

            {categoryLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                    <List>
                        {categories.length === 0 ? (
                            <ListItem>
                                <ListItemText primary="생성된 카테고리가 없습니다." />
                            </ListItem>
                        ) : (
                            categories.map((cat, index) => (
                                <React.Fragment key={cat.id}>
                                    <ListItem>
                                        <ListItemText
                                            primary={cat.name}
                                            secondary={`표시 순서: ${cat.displayOrder} | 활성화: ${cat.active ? 'O' : 'X'}`}
                                        />
                                        {/* 나중에 여기에 수정/삭제 버튼을 추가할 수 있어 */}
                                    </ListItem>
                                    {index !== categories.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default CategoryManager;