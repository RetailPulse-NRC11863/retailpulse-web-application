/**
 * Marker interface for HTTP response envelopes returned by API endpoints.
 */
export interface BaseResponse {}

/**
 * Base contract for API resources that expose an identifier.
 */
export interface BaseResource {
  /**
   * The unique identifier for the resource.
   */
  id: number | string;
}
