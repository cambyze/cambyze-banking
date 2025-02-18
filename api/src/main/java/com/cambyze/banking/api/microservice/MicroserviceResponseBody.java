package com.cambyze.banking.api.microservice;

import java.net.URI;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import javax.servlet.http.HttpServletResponse;

/**
 * Response body for microservices
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 */
public class MicroserviceResponseBody {

  private int status;
  private Date timestamp;
  private String message;
  private String error;
  private String exception;
  private URI uri;
  private String path;

  private List<MicroserviceResponseError> errors;

  public MicroserviceResponseBody() {
    super();
    this.timestamp = Calendar.getInstance().getTime();
    this.status = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
  }



  public MicroserviceResponseBody(int status, String message, URI uri, String error,
      String exception, List<MicroserviceResponseError> errors) {
    super();
    this.status = status;
    this.timestamp = Calendar.getInstance().getTime();
    this.message = message;
    this.uri = uri;
    if (uri != null) {
      this.path = uri.getPath();
    } else {
      this.path = null;
    }
    this.error = error;
    this.exception = exception;
    this.errors = errors;
  }


  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
  }

  public Date getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(Date timestamp) {
    this.timestamp = timestamp;
  }

  public URI getUri() {
    return uri;
  }

  public void setUri(URI uri) {
    this.uri = uri;
    if (uri != null) {
      this.path = uri.getPath();
    } else {
      this.path = null;
    }
  }

  public String getPath() {
    return path;
  }

  public void setPath(String path) {
    // Nothing to do - the path is inherited of the uri
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getError() {
    return error;
  }


  public void setError(String error) {
    this.error = error;
  }


  public String getException() {
    return exception;
  }


  public void setException(String exception) {
    this.exception = exception;
  }


  public List<MicroserviceResponseError> getErrors() {
    return errors;
  }

  public void setErrors(List<MicroserviceResponseError> errors) {
    this.errors = errors;
  }
}


