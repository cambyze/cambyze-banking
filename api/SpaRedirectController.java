package com.cambyze.banking.api;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaRedirectController {

    // Redirige toutes les routes non-API et sans extension vers index.html
    @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:^(?!api|static|public|assets|favicon\\.ico$).*$}"})
    public String redirect() {
        return "forward:/index.html";
    }
}
