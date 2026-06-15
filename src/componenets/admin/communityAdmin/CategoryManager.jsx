import React, {useEffect, useState} from 'react';
import {useCategories} from "../../../hooks/useCategories.js";
import ErrorMessage from "../../util/ErrorMessage.jsx";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CategoryManager = ({urlPath}) => {
    const {categories,fetchAllCategories,createCategory,categoryLoading,
        toggleCategoryStatus,reorderCategory} = useCategories(urlPath);

    const [errorMessage, setErrorMessage] = useState("");
    const [localCategories, setLocalCategories] = useState([]);
    const [formData, setFormData] = useState({ categoryName: '' });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => { fetchAllCategories(); }, [fetchAllCategories]);
    useEffect(() => { setLocalCategories(categories); }, [categories]);

    const handleCreateCategory = async () => {
        try {
            setErrorMessage("");
            await createCategory({ categoryName: formData.categoryName, displayOrder: 0 });
            setFormData({ categoryName: '' });
            await fetchAllCategories();
        } catch (e) { setErrorMessage(e.message); }
    }

    const handleChangeCategoryStatus = async(categoryId, currentStatus) => {
        try { await toggleCategoryStatus(categoryId, currentStatus); }
        catch (e) { setErrorMessage(e.message); }
    }

    const handleDragEnd = async (result) => {
        if (!result.destination || result.source.index === result.destination.index) return;
        const items = Array.from(localCategories);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setLocalCategories(items);
        try {
            await reorderCategory(items.map(item => item.id));
        } catch (e) {
            setErrorMessage(e.message);
            setLocalCategories(categories);
        }
    };

    return (
        <div>
            <h2 className="dc-title-sub mb-3">카테고리 관리</h2>
            <ErrorMessage errorMessage={errorMessage} />

            <div className="dc-write-form-box mb-4">
                <div className="dc-flex-row gap-1">
                    <input
                        className="dc-input-box"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        placeholder="새 카테고리 이름"
                    />
                    <button className="dc-btn dc-btn-md dc-btn-primary" onClick={handleCreateCategory}>생성</button>
                </div>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="category-list">
                    {(provided) => (
                        <div className="dc-write-form-box" ref={provided.innerRef} {...provided.droppableProps}>
                            {localCategories.map((cat, index) => (
                                <Draggable key={String(cat.id)} draggableId={String(cat.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className="dc-list-item dc-flex-between"
                                            style={{ ...provided.draggableProps.style, opacity: cat.active ? 1 : 0.5 }}
                                        >
                                            <div {...provided.dragHandleProps} style={{ cursor: 'grab', marginRight: '10px' }}>☰</div>
                                            <span style={{ flexGrow: 1, textDecoration: cat.active ? 'none' : 'line-through' }}>{cat.name}</span>
                                            <div className="dc-flex-row gap-1">
                                                <span style={{ fontSize: '12px', color: cat.active ? '#52c41a' : '#888' }}>
                                                    {cat.active ? '공개' : '숨김'}
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={cat.active}
                                                    onChange={() => handleChangeCategoryStatus(cat.id, cat.active)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default CategoryManager;