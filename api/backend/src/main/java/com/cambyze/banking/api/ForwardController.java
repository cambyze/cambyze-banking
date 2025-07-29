// package com.cambyze.banking.api;

// import org.springframework.stereotype.Controller;
// import org.springframework.web.bind.annotation.RequestMapping;

// @Controller
// public class ForwardController {

//     @RequestMapping(value = {"/{path:[^\\.]*}", "/**/{path:^(?!.*\\.).*}"})
//     public String redirect() {
//         return "forward:/index.html";
//     }
// }