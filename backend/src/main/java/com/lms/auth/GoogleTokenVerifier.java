package com.lms.auth;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class GoogleTokenVerifier {

    private final GoogleIdTokenVerifier verifier;

    public GoogleTokenVerifier(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        JsonFactory jsonFactory = new GsonFactory();
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), jsonFactory)
                .setAudience(Collections.singletonList(clientId))
                .build();
    }

    public GoogleTokenInfo verifyToken(String idTokenString) {
        try {
            var idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                log.warn("Google token verification failed: idToken is null");
                return null;
            }

            var payload = idToken.getPayload();
            return GoogleTokenInfo.builder()
                    .email((String) payload.get("email"))
                    .googleId(payload.getSubject())
                    .name((String) payload.get("name"))
                    .avatarUrl((String) payload.get("picture"))
                    .build();
        } catch (Exception e) {
            log.error("Error verifying Google token: {}", e.getMessage());
            return null;
        }
    }

}
