package com.example.discordclonebackend.security;

import com.example.discordclonebackend.security.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthFilter extends OncePerRequestFilter {
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // this filter will intercept every request and check if the request has a valid JWT token
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        //get the jwt token from the request
        String jwtToken = getJwtTokenFromRequest(request);
        //validate the jwt token
        if (jwtToken != null && jwtUtils.validateToken(jwtToken)) {
            //get the username from the jwt token
            String username = jwtUtils.getUsernameFromJwtToken(jwtToken);
            //get the user details from the username associated with the jwt token
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities()
            );
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            //update the authentication object in the security context to let spring security know that the current user is authenticated
            //to access this protected route
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        //continue the filter chain
        filterChain.doFilter(request, response);
    }

    public String getJwtTokenFromRequest(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        //check if the header contains the authorization header and starts with Bearer
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            //return the jwt token without the Bearer prefix
            return headerAuth.substring(7);
        }
        return null;
    }
}
