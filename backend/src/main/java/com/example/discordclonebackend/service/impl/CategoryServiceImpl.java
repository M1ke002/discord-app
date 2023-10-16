package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.CategoryDto;
import com.example.discordclonebackend.dto.request.CategoryRequest;
import com.example.discordclonebackend.entity.Category;
import com.example.discordclonebackend.entity.Server;
import com.example.discordclonebackend.entity.UserRole;
import com.example.discordclonebackend.entity.UserServerMapping;
import com.example.discordclonebackend.repository.CategoryRepository;
import com.example.discordclonebackend.repository.ServerRepository;
import com.example.discordclonebackend.repository.UserServerMappingRepository;
import com.example.discordclonebackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    UserServerMappingRepository userServerMappingRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ServerRepository serverRepository;

    @Override
    public Boolean deleteCategory(Long categoryId, Long userId, Long serverId) {
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return false;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return false;
        }
        //delete category
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            System.out.println("Category does not exist");
            return false;
        }
        categoryRepository.delete(category);
        return true;
    }

    @Override
    public CategoryDto createCategory(CategoryRequest categoryRequest) {
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(
                categoryRequest.getUserId(),
                categoryRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return null;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //get server
        Server server = serverRepository.findById(categoryRequest.getServerId()).orElse(null);
        if (server == null) {
            System.out.println("Server does not exist");
            return null;
        }
        //check if category name already exists
        Category categoryFound = categoryRepository.findByNameAndServerId(categoryRequest.getName(), categoryRequest.getServerId());
        if (categoryFound != null) {
            System.out.println("Category name already exists");
            return null;
        }
        //create category
        Category category = new Category(
                categoryRequest.getName(),
                server
        );
        categoryRepository.save(category);
        return new CategoryDto(
                category.getId(),
                category.getName(),
                server.getId(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }

    @Override
    public CategoryDto editCategory(Long categoryId, CategoryRequest categoryRequest) {
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(
                categoryRequest.getUserId(),
                categoryRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return null;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //get category
        Category category = categoryRepository.findById(categoryId).orElse(null);
        if (category == null) {
            System.out.println("Category does not exist");
            return null;
        }
        //check if category name already exists
        Category categoryFound = categoryRepository.findByNameAndServerId(categoryRequest.getName(), categoryRequest.getServerId());
        if (categoryFound != null && !categoryFound.getId().equals(categoryId)) {
            System.out.println("Category name already exists");
            return null;
        }
        //edit category
        category.setName(categoryRequest.getName());
        categoryRepository.save(category);
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getServer().getId(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
