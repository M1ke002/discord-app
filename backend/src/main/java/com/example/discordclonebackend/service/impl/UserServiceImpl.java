package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.FileDto;
import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.RegisterRequest;
import com.example.discordclonebackend.dto.request.UserRequest;
import com.example.discordclonebackend.entity.File;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.entity.UserServerMapping;
import com.example.discordclonebackend.repository.FileRepository;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.repository.UserServerMappingRepository;
import com.example.discordclonebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserServerMappingRepository userServerMappingRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public String register(RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setNickname(registerRequest.getNickname());
        userRepository.save(user);
        return "User successfully registered";
    }

    @Override
    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }
        //get a list of servers that the user is a member of using the userServerMappingRepository
        List<ServerDto> serverDtos = new ArrayList<>();
        List<UserServerMapping> userServerMappings = userServerMappingRepository.findAllByUserId(userId);
        userServerMappings.forEach(userServerMapping -> {
            ServerDto serverDto = new ServerDto(
                userServerMapping.getServer().getId(),
                userServerMapping.getServer().getName(),
                userServerMapping.getServer().getFile() != null ? new FileDto(
                        userServerMapping.getServer().getFile().getFileName(),
                        userServerMapping.getServer().getFile().getFileUrl(),
                        userServerMapping.getServer().getFile().getFileKey()
                ) : null,
                userServerMapping.getServer().getOwner().getId()
            );
            serverDtos.add(serverDto);
        });
        UserDto userDto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getFile() != null ? new FileDto(
                        user.getFile().getFileName(),
                        user.getFile().getFileUrl(),
                        user.getFile().getFileKey()
                ) : null,
                serverDtos,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
        return userDto;
    }

    @Override
    public UserDto updateUser(Long userId, UserRequest userRequest) {
        System.out.println("Updating user: " + userRequest);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return null;
        }

        //check if the user has a new avatar
        File userFile = user.getFile();
        boolean shouldDeleteFile = false;
        //if the user does not have a avatar file but the userRequest has a avatar file -> create a new file
        if (userFile == null && userRequest.getFileUrl() != null) {
            File file = new File();
            file.setFileName(userRequest.getFileName());
            file.setFileUrl(userRequest.getFileUrl());
            file.setFileKey(userRequest.getFileKey());

            file = fileRepository.save(file);

            user.setFile(file);
        } else if (userFile != null && userRequest.getFileUrl() != null && !userFile.getFileUrl().equals(userRequest.getFileUrl())) {
            //if the user has an avatar file and the userRequest has a different (new) avatar file -> update the file
            userFile.setFileName(userRequest.getFileName());
            userFile.setFileUrl(userRequest.getFileUrl());
            userFile.setFileKey(userRequest.getFileKey());

            fileRepository.save(userFile);
        } else if (userFile != null && userRequest.getFileUrl() == null) {
            System.out.println("Deleting file" + userFile.getFileUrl());
            //if the user has a avatar file but the userRequest does not have a avatar file -> delete the file
            shouldDeleteFile = true;
            user.setFile(null);
        }

        if (userRequest.getNickname() != null) {
            user.setNickname(userRequest.getNickname());
        }
        if (userRequest.getUsername() != null) {
            //check if the new username is already taken
            if (userRepository.existsByUsername(userRequest.getUsername())) {
                System.out.println("Username already taken");
                return null;
            }
            user.setUsername(userRequest.getUsername());
        }
        user = userRepository.save(user);
        if (shouldDeleteFile) {
            fileRepository.delete(userFile);
        }
        //get a list of servers that the user is a member of using the userServerMappingRepository
        List<ServerDto> serverDtos = new ArrayList<>();
        List<UserServerMapping> userServerMappings = userServerMappingRepository.findAllByUserId(userId);
        userServerMappings.forEach(userServerMapping -> {
            ServerDto serverDto = new ServerDto(
                    userServerMapping.getServer().getId(),
                    userServerMapping.getServer().getName(),
                    userServerMapping.getServer().getFile() != null ? new FileDto(
                            userServerMapping.getServer().getFile().getFileName(),
                            userServerMapping.getServer().getFile().getFileUrl(),
                            userServerMapping.getServer().getFile().getFileKey()
                    ) : null,
                    userServerMapping.getServer().getOwner().getId()
            );
            serverDtos.add(serverDto);
        });
        UserDto userDto = new UserDto(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getFile() != null ? new FileDto(
                        user.getFile().getFileName(),
                        user.getFile().getFileUrl(),
                        user.getFile().getFileKey()
                ) : null,
                serverDtos,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
        return userDto;
    }

    @Override
    public Boolean deleteUser(Long userId) {
        //check if user exists
        if (!userRepository.existsById(userId)) {
            System.out.println("User does not exist");
            return false;
        }
        //check if user is an owner of any servers
        List<UserServerMapping> userServerMappings = userServerMappingRepository.findAllByUserId(userId);
        for (UserServerMapping userServerMapping : userServerMappings) {
            if (userServerMapping.getServer().getOwner().getId().equals(userId)) {
                System.out.println("User is an owner of a server, cannot delete");
                return false;
            }
        }
        //delete all userServerMappings of the user
        userServerMappingRepository.deleteAllByUserId(userId);
        //delete user
        userRepository.deleteById(userId);
        return true;
    }

    @Override
    public Boolean changePassword(UserRequest userRequest) {
        //get user
        User user = userRepository.findByUsername(userRequest.getUsername()).orElse(null);
        if (user == null) {
            System.out.println("User not found");
            return false;
        }
        //check if old password is correct
        if (!passwordEncoder.matches(userRequest.getCurrPassword(), user.getPassword())) {
            System.out.println("Old password is incorrect");
            return false;
        }
        //change password
        user.setPassword(passwordEncoder.encode(userRequest.getNewPassword()));
        userRepository.save(user);
        return true;
    }
}
