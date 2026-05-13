package org.acme.login;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import io.vertx.core.Vertx;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped // <-- 이 부분이 있으면 더 안정적입니다.
public class SessionConfig {
    
    @Inject 
    Vertx vertx; // <-- 여기 띄어쓰기 수정 완료!

    public void init(@Observes Router router) {
        router.route().handler(
            SessionHandler
                .create(LocalSessionStore.create(vertx))
                .setSessionTimeout(60 * 60 * 1000L) // 1시간
                .setCookieHttpOnlyFlag(true)
        );
    }
}