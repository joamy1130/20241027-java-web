package org.acme.login;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.io.InputStream;
import jakarta.inject.Inject;
import io.vertx.ext.web.RoutingContext;
import jakarta.transaction.Transactional;

@Path("/") // 기본 경로 설정
public class AuthResource {

    @Inject
    RoutingContext context; // 세션 관리를 위한 주입

    /**
     * 1. 로그인 페이지 호출 (GET)
     * 이 메서드가 있어야 /login 접속 시 404 에러가 나지 않습니다.
     */
    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML)
    public Response loginPage() {
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/login.html");

        if (html == null) {
            return Response.status(Response.Status.NOT_FOUND)
                           .entity("login.html 파일을 찾을 수 없습니다.")
                           .build();
        }
        return Response.ok(html).build();
    }

    /**
     * 2. 로그인 처리 (POST)
     * 사용자가 아이디/비번을 입력하고 '로그인' 버튼을 눌렀을 때 호출됩니다.
     */
    @POST
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password) {
        
        // DB에서 사용자 조회 (User.java 파일의 findByUsername 메서드 사용)
        User user = User.findByUsername(username);

        // 아이디가 없거나 비번이 틀린 경우 처리
        if (user == null || !user.password.equals(password)) {
            return Response.seeOther(URI.create("/login?error=1")).build();
        }

        // 로그인 성공 시 세션에 유저 이름 저장
        context.session().put("loginUser", username);

        // 성공 후 이동할 페이지
        return Response.seeOther(URI.create("/after_login")).build();
    }

    /**
     * 3. 로그인 성공 후 전용 메인 페이지 (GET)
     * 세션이 있는 유저만 볼 수 있게 체크합니다.
     */
    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {
        String loginUser = context.session().get("loginUser");

        // 세션 정보 콘솔 출력 (디버깅용)
        System.out.println("=== 로그인 유저 세션 확인: " + loginUser);

        // 로그인 안 한 유저가 주소창에 직접 치고 들어오면 로그인 페이지로 쫓아냄
        if (loginUser == null) {
            return Response.seeOther(URI.create("/login")).build();
        }

        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/main_after_login.html");

        return Response.ok(html).build();
    }

    /**
     * 4. 로그아웃 (GET)
     * 세션을 파기하고 메인 첫 화면으로 이동합니다.
     */
    @GET
    @Path("/logout")
    public Response logout() {
        // 세션 데이터 삭제
        context.session().destroy();
        
        // 완전히 처음 화면(index.html)으로 이동
        return Response.seeOther(URI.create("/")).build();
    }

    // AuthResource.java 아래새로추가
    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)

    public Response registerPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream(
            "META-INF/resources/login/register.html");
        return Response.ok(html).build();
    }
}