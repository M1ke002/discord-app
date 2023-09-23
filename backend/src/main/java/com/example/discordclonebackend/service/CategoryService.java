package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.CategoryDto;
import com.example.discordclonebackend.dto.request.CategoryRequest;

public interface CategoryService {
    public Boolean deleteCategory(Long categoryId, Long userId, Long serverId);

    public CategoryDto createCategory(CategoryRequest categoryRequest);

    public CategoryDto editCategory(Long categoryId, CategoryRequest categoryRequest);
}
