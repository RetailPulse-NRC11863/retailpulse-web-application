import {BaseResponse} from '../../../shared/infrastructure/http/base-response';
import {ConversionGapResource} from '../resources/conversion-gap-resource';

export interface ConversionGapResponse extends BaseResponse {
  content: ConversionGapResource[];
}
