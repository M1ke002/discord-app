package com.example.discordclonebackend.config;

import com.corundumstudio.socketio.Configuration;
import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import jakarta.annotation.PreDestroy;
import lombok.extern.log4j.Log4j2;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;

//@CrossOrigin
//@Component
//@Log4j2
//@org.springframework.context.annotation.Configuration
public class SocketIOConfig {

//    private final String SOCKETHOST = "localhost"; //or use IP address of localhost: 127.0.0.1
//    private final int SOCKETPORT = 8085;
//    private SocketIOServer server;
//
//    @Bean
//    public SocketIOServer socketIOServer() {
//        Configuration config = new Configuration();
//        config.setHostname(SOCKETHOST);
//        config.setPort(SOCKETPORT);
//        server = new SocketIOServer(config);
//        server.start();
//        server.addConnectListener(new ConnectListener() {
//            @Override
//            public void onConnect(SocketIOClient client) {
//
//                log.info("new user connected with socket " + client.getSessionId());
//            }
//        });
//
//        server.addDisconnectListener(new DisconnectListener() {
//            @Override
//            public void onDisconnect(SocketIOClient client) {
//                client.getNamespace().getAllClients().stream().forEach(data-> {
//                    log.info("user disconnected "+data.getSessionId().toString());});
//            }
//        });
//        return server;
//    }
//
//    @PreDestroy
//    public void stopSocketIOServer() {
//        this.server.stop();
//    }

}