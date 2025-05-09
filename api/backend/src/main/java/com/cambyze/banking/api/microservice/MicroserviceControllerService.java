package com.cambyze.banking.api.microservice;

import java.net.URI;
import org.springframework.http.ResponseEntity;
import com.cambyze.banking.api.microservice.exceptions.EntityPreparationException;


/**
 * Service to be used to build standard Cambyze microservice controllers
 * 
 * @author Thierry Nestelhut
 * @see <a href="https://github.com/cambyze">cambyze GitHub</a>
 *
 */
public interface MicroserviceControllerService {

  public static final int OPERATION_CREATE = 1;
  public static final int OPERATION_FULL_UPDATE = 2;
  public static final int OPERATION_PARTIAL_UPDATE = 3;
  public static final int OPERATION_DELETE = 4;
  public static final int OPERATION_OTHERS = 5;


  /**
   * Analyse exception in order to build a response body for the microservices with errors
   * 
   * @param path URI to be displayed in the response body as the path attribute
   * @param exception exception which will be analysed in order to build other response body
   *        attributes
   * @return the response body to be returned by microservices in case of errors
   */
  public ResponseEntity<Object> buildResponseException(URI path, Exception exception);

  /**
   * Recursively analyse the exception and cause in order to fill the microservices response body in
   * case of error
   * 
   * @param microserviceResponseBody response body which will be updated recursively by the
   *        exception analysis
   * @param throwable exception or its causes to be analysed
   * @param parent exception or cause used in the recursive calls. Not to be filled during the first
   *        call of this procedure
   */
  public void updateMicroserviceResponseBodyWithException(
      MicroserviceResponseBody microserviceResponseBody, Throwable throwable, Throwable parent);

  /**
   * Creates a new URI based on the sent one but with a correct reference
   * <p>
   * Indeed, reference has to be uppercase without blank at the beginning or at the end
   * 
   * @param uri URI to be changed
   * @param path to identify the path before the reference. For instance "/products" for a path
   *        "/products/X22"
   * @param reference reference to be added at the end of the path
   * 
   * @return the modified URI
   */
  public URI formatUriWithCorrectReference(URI uri, String path, String reference);

  /**
   * Prepare the searching object used to find entities before calling DAO methods
   * 
   * @param searchEntity entity used to build messages and to provide the reference
   * @throws RuntimeException
   */
  public void prepareSearchingEntity(PersistEntity searchEntity) throws EntityPreparationException;

  /**
   * Prepare found entity before sending it
   * 
   * @param entity entity to be sent
   * @param searchEntity entity used for the research
   * @throws RuntimeException
   */
  public void prepareSendingEntity(PersistEntity entity, PersistEntity searchEntity)
      throws EntityPreparationException;

  /**
   * Initiates an URI
   * 
   * @return a temporary URI
   */
  public URI initURI();

  /**
   * Creates the target URI
   * 
   * @param requestEntity request entity
   * @param path path of the microservice
   * @return the uri
   */
  public URI createTargetURI(PersistEntity requestEntity, String path);

  /**
   * Creates the target URI
   * 
   * @param requestEntity request entity
   * @param path path of the microservice
   * @param operation operation on the entity as "/cancelation"
   * @return the uri
   */
  public URI createTargetURI(PersistEntity requestEntity, String path, String operation);


  /**
   * Prepare entity before searching it and persist it
   * 
   * @param reference reference of the entity to persist
   * @param requestEntity request entity
   * @param operation type of CUD operation (Create, Partial/Full Update & Delete). Use
   *        MicroserviceControllerService.OPERATION_xxx constants
   * @return a response body, in case of error, to be sent by the microservice. If there is no
   *         error, returns null.
   */
  public ResponseEntity<Object> prepareRequestEntityToPersist(String reference,
      PersistEntity requestEntity, int operation);

  /**
   * Prepare entity for to CUD (Create, Update & Delete)
   * 
   * @param requestEntity request entity
   * @param existingEntity entity to CUD (Create, Update & Delete)
   * @param uri uri to be used for the response body
   * @param operation type of CUD operation (Create, Partial/Full Update & Delete). Use
   *        MicroserviceControllerService.OPERATION_xxx constants
   * @return a response body, in case of error, to be sent by the microservice. If there is no
   *         error, returns null.
   */
  public ResponseEntity<Object> prepareEntityForCUD(PersistEntity requestEntity,
      PersistEntity existingEntity, URI uri, int operation);

  /**
   * Create the response body to send in case of successful operation on entity
   * 
   * @param entity entity with CUD successful (Create, Update & Delete)
   * @param uri uri to be used for the response body
   * @param operation type of CUD operation (Create, Partial/Full Update & Delete). Use
   *        MicroserviceControllerService.OPERATION_xxx constants
   * @return the response body
   */
  public ResponseEntity<Object> createResponseBodyCUDSuccessful(PersistEntity entity, URI uri,
      int operation);
}
