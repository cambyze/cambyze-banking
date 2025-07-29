// package com.cambyze.banking.api.config;


// @Bean
// public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//     http
//         .authorizeHttpRequests(auth -> auth
//             .anyRequest().permitAll() // Autorise toutes les requêtes sans authentification
//         )
//         .csrf(csrf -> csrf.disable()) // Désactive la protection CSRF
//         .httpBasic(AbstractHttpConfigurer::disable) // Désactive basic auth
//         .formLogin(AbstractHttpConfigurer::disable); // Désactive le formulaire de login
//     return http.build();
// }

package com.cambyze.banking.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Autorise toutes les requêtes sans authentification
            )
            .csrf(AbstractHttpConfigurer::disable) // Désactive CSRF
            .httpBasic(AbstractHttpConfigurer::disable) // Désactive HTTP Basic
            .formLogin(AbstractHttpConfigurer::disable); // Désactive formulaire de login

        return http.build();
    }
}
