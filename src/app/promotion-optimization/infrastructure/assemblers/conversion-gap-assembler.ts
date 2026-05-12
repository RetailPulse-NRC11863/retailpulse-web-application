import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {ConversionGap} from '../../domain/model/conversion-gap.entity';
import {ConversionGapResource} from '../resources/conversion-gap-resource';
import {ConversionGapResponse} from '../responses/conversion-gap-response';

export class ConversionGapAssembler
  implements BaseAssembler<ConversionGap, ConversionGapResource, ConversionGapResponse> {

  toEntityFromResource(resource: ConversionGapResource): ConversionGap {
    return new ConversionGap(resource);
  }

  toResourceFromEntity(entity: ConversionGap): ConversionGapResource {
    return { ...entity };
  }

  toEntitiesFromResponse(response: ConversionGapResponse): ConversionGap[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
