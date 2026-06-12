import React, {useEffect, useState} from 'react';
import {
    Box, Typography, TextField, Button, Stack, Divider,
    List, ListItem, ListItemText, CircularProgress, Paper, IconButton, Switch
} from '@mui/material';
import {useCategories} from "../../../hooks/useCategories.js";
import ErrorMessage from "../../util/ErrorMessage.jsx";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

const CategoryManager = ({urlPath}) => {

    const {categories,fetchAllCategories,createCategory,categoryLoading,
        toggleCategoryStatus,reorderCategory} = useCategories(urlPath);

    const [errorMessage, setErrorMessage] = useState("")
    const [localCategories, setLocalCategories] = useState([]);

    const [formData, setFormData] = useState({
        categoryName:'',
    });
    const handleChange = (e) =>{
        const {name,value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    useEffect(() => {
        fetchAllCategories();
    }, [fetchAllCategories]);

    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);



    /* 생성 핸들러 */
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
            await fetchAllCategories();
        }

    }

    /* 카테고리 활성/비활성 상태 변환 */
    const handleChangeCategoryStatus = async(categoryId,currentStatus)=> {
        try {
            await toggleCategoryStatus(categoryId,currentStatus);
        }catch (e) {
            setErrorMessage(e.message);
        }
    }


    /* 드래그완료시 reorder 핸들러 */
    const handleDragEnd = async (result) => {
        if (!result.destination) return; // 유효하지 않은 곳에 드롭한 경우
        if (result.source.index === result.destination.index) return; // 제자리에 드롭한 경우

        // 1. 로컬 상태 배열 순서 변경 (Optimistic Update)
        const items = Array.from(localCategories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setLocalCategories(items); // 화면 즉시 반영

        // 2. 백엔드 전송용 ID 배열 추출: [3, 1, 5, 2]
        const categoryIdList = items.map(item => item.id);

        // 3. API 호출
        try {
            setErrorMessage("");
            await reorderCategory(categoryIdList);
        } catch (e) {
            // 실패 시 원래 순서로 롤백
            setErrorMessage(e.message);
            setLocalCategories(categories);
        }
    };


    return (
        <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                카테고리 관리
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <ErrorMessage errorMessage={errorMessage} />

            {/* 카테고리 생성 폼 */}
            <Paper elevation={0} sx={{ p: 2, mb: 4, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 2 }}>새 카테고리 생성</Typography>
                <Stack direction="row" spacing={40} alignItems="center">
                    <TextField
                        label="카테고리 이름"
                        size="small"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        sx={{ flexGrow: 1 }}
                    />


                    <Button variant="contained" onClick={handleCreateCategory}>
                        생성
                    </Button>
                </Stack>
            </Paper>

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                카테고리 목록 (드래그하여 순서 변경)
            </Typography>

            {categoryLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="category-list">
                        {(provided) => (
                            <Paper
                                elevation={0}
                                sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                <List>
                                    {localCategories.length === 0 ? (
                                        <ListItem>
                                            <ListItemText primary="생성된 카테고리가 없습니다." />
                                        </ListItem>
                                    ) : (
                                        localCategories.map((cat, index) => (
                                            <Draggable key={String(cat.id)} draggableId={String(cat.id)} index={index}>
                                                {(provided, snapshot) => (
                                                    <React.Fragment>
                                                        <ListItem
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            sx={{
                                                                // 드래그 중일 때의 배경색과, 비활성화되었을 때의 투명도(opacity) 설정
                                                                bgcolor: snapshot.isDragging ? 'action.hover' : 'inherit',
                                                                opacity: cat.active ? 1 : 0.5,
                                                                transition: 'all 0.2s ease',
                                                            }}
                                                            secondaryAction={
                                                                // 토글 스위치와 상태 텍스트를 가로로 나란히 배치
                                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                                    <Typography
                                                                        variant="body2"
                                                                        fontWeight="bold"
                                                                        color={cat.active ? 'success.main' : 'text.secondary'}
                                                                    >
                                                                        {cat.active ? '공개' : '숨김'}
                                                                    </Typography>
                                                                    <Switch
                                                                        edge="end"
                                                                        checked={cat.active}
                                                                        onChange={() => handleChangeCategoryStatus(cat.id, cat.active)}
                                                                        color="success" // 켜졌을 때 초록색 계열로 표시
                                                                    />
                                                                </Stack>
                                                            }
                                                        >
                                                            {/* 드래그 손잡이 (Drag Handle) */}
                                                            <Box {...provided.dragHandleProps} sx={{ display: 'flex', alignItems: 'center', mr: 2, cursor: 'grab' }}>
                                                                <DragIndicatorIcon color="action" />
                                                            </Box>

                                                            <ListItemText
                                                                primary={cat.name}
                                                                // 비활성화 상태면 취소선을 그어서 더 명확하게 표현
                                                                primaryTypographyProps={{
                                                                    sx: {
                                                                        textDecoration: cat.active ? 'none' : 'line-through',
                                                                        color: cat.active ? 'text.primary' : 'text.secondary',
                                                                        fontWeight: cat.active ? 'normal' : 'lighter'
                                                                    }
                                                                }}
                                                            />
                                                        </ListItem>


                                                        {index !== localCategories.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </List>
                            </Paper>
                        )}
                    </Droppable>
                </DragDropContext>
            )}
        </Box>
    );
};

export default CategoryManager;