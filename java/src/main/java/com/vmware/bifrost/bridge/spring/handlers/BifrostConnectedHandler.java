package com.vmware.bifrost.bridge.spring.handlers;

import com.vmware.bifrost.bridge.spring.services.BifrostSubscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

@Controller
public class BifrostConnectedHandler implements ApplicationListener<SessionConnectedEvent> {

    @Autowired
    private BifrostSubscriptionService subService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public void onApplicationEvent(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        logger.info("[@] Bifrost Bridge: connected with sessionId:" + sha.getSessionId());
        // subService.removeSubscription(sha.getSubscriptionId());
    }

}
