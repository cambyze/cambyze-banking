package com.cambyze.banking.persistence.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "persons")
public class Person {
  @Id
  private String personId;
  private String name;
  private String firstName;
  private String email;
  private String psw;
  private String adress;

  public Person() {
    super();
  }

  // Overriding toString() method for a better description
  @Override
  public String toString() {
    return this.personId + " : " + this.name + " + " + this.firstName + " + " + this.email + "+"
        + this.psw + this.adress;
  }

  public String getId() {
    return this.getPersonId();
  }

  public void setId(String personId) {
    this.setPersonId(personId);
  }

  public String getPersonId() {
    return personId;
  }

  public void setPersonId(String personId) {
    this.personId = personId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPsw() {
    return psw;
  }

  public void setPsw(String psw) {
    this.psw = psw;
  }

  public String getAdress() {
    return adress;
  }

  public void setAdress(String adress) {
    this.adress = adress;
  }
}

// package com.cambyze.banking.persistence.model;

// import org.springframework.data.annotation.Id;
// import org.springframework.data.mongodb.core.mapping.Document;

// @Document(collection = "persons")
// public class Person {
//   @Id
//   private String personId;
//   private String name;
//   private String firstName;
//   private String email;

//   public Person() {
//     super();
//   }

//   // Overriding toString() method for a better description
//   @Override
//   public String toString() {
//     return this.personId + " : " + this.name + " + " + this.firstName + " + " + this.email;
//   }

//   public String getId() {
//     return this.getPersonId();
//   }

//   public void setId(String personId) {
//     this.setPersonId(personId);
//   }

//   public String getPersonId() {
//     return personId;
//   }

//   public void setPersonId(String personId) {
//     this.personId = personId;
//   }

//   public String getName() {
//     return name;
//   }

//   public void setName(String name) {
//     this.name = name;
//   }

//   public String getFirstName() {
//     return firstName;
//   }

//   public void setFirstName(String firstName) {
//     this.firstName = firstName;
//   }

//   public String getEmail() {
//     return email;
//   }

//   public void setEmail(String email) {
//     this.email = email;
//   }



// }
