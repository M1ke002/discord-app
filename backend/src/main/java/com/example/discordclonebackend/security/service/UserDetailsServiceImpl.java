package com.example.discordclonebackend.security.service;

import com.example.discordclonebackend.dto.FileDto;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        //NOTE: we are returning a User details object from Spring Security, not our User entity object
//        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), new ArrayList<>());
        return new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPassword(),
                user.getNickname(),
                user.getFile() != null ? new FileDto(
                        user.getFile().getFileName(),
                        user.getFile().getFileUrl(),
                        user.getFile().getFileKey()
                ) : null,
                user.getCreatedAt(),
                user.getUpdatedAt(),
                new ArrayList<>()
        );
    }


}
