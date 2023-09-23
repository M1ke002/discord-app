package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.CategoryDto;
import com.example.discordclonebackend.dto.request.CategoryRequest;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping("") //TESTED
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest categoryRequest) {
        CategoryDto categoryDto = categoryService.createCategory(categoryRequest);
        if (categoryDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Category creation failed"));
        }
        return ResponseEntity.ok(categoryDto);
    }

    @PutMapping("/{categoryId}") //TESTED
    public ResponseEntity<?> editCategory(@PathVariable("categoryId") Long categoryId, @RequestBody CategoryRequest categoryRequest) {
        CategoryDto categoryDto = categoryService.editCategory(categoryId, categoryRequest);
        if (categoryDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Category edit failed"));
        }
        return ResponseEntity.ok(categoryDto);
    }

    //example request: http://localhost:8080/api/v1/categories/1?userId=1&serverId=1
    @DeleteMapping("/{categoryId}") //TESTED
    public ResponseEntity<?> deleteCategory(
            @PathVariable("categoryId") Long categoryId,
            @RequestParam("userId") Long userId,
            @RequestParam("serverId") Long serverId) {
        Boolean isDeleted = categoryService.deleteCategory(categoryId, userId, serverId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Category deletion failed"));
        }
        return ResponseEntity.ok(new StringResponse("Category deleted successfully"));
    }
}
