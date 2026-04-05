package com.lms.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoogleTokenInfo {

    private String email;
    private String googleId;
    private String name;
    private String avatarUrl;

}
