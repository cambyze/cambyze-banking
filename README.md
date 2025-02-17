# 💰 **Bank Account** 💰

# Project architecture

> This mini project is organized into 3 Maven projects:
> - the persistence with a mySQL DB => persistence-0.0.1-SNAPSHOT.jar
> - the business services => services-0.0.1-SNAPSHOT.jar
> - the REST APIs => banking-api.war
>
> The OPEN API 3.0 documentation is generated automatically with SWAGGER in the folder "api\target\generated-OpenAPI-specification": openapi.json & openapi.yaml:
>
> {
>  "openapi" : "3.0.1",
>  "info" : {
>    "title" : "Cambyze banking service",
>    "description" : "Services to banking accounts",
>    ...
>     "paths" : {
>    "/createBankAccount" : {
>      "post" : {
>        "summary" : "Create a bank account",
>        ...
>
> NB: to create the DB structure the first time, do not forget to modify the property "spring.jpa.hibernate.ddl-auto" to "create" in the "application.properties" file then to change it again to "validate"
>

## Glossary

> The code is in english. The used glossary is the following:
> - compte bancaire => bank account
> - numéro de compte unique => bank account number
> - solde => balance amount
> - dépôt d'argent => deposit
> - retrait d'argent => withdraw
> - découvert => overdraft
> - livret d'épargne => savings account
> - relevé de compte => bank statement
