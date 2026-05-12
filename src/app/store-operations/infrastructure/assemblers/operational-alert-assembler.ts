import {BaseAssembler} from '../../../shared/infrastructure/http/base-assembler';
import {OperationalAlert} from '../../domain/model/operational-alert.entity';
import {OperationalAlertResource} from '../resources/operational-alert-resource';
import {OperationalAlertResponse} from '../responses/operational-alert-response';

export class OperationalAlertAssembler
  implements BaseAssembler<OperationalAlert, OperationalAlertResource, OperationalAlertResponse> {

  toEntityFromResource(resource: OperationalAlertResource): OperationalAlert {
    return new OperationalAlert({
      id: resource.id,
      type: resource.type,
      priority: resource.priority,
      status: resource.status,
      message: resource.message,
      zoneId: resource.zoneId,
      zoneName: resource.zoneName,
      productId: resource.productId,
      productName: resource.productName,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: OperationalAlert): OperationalAlertResource {
    return {
      id: entity.id,
      type: entity.type,
      priority: entity.priority,
      status: entity.status,
      message: entity.message,
      zoneId: entity.zoneId,
      zoneName: entity.zoneName,
      productId: entity.productId,
      productName: entity.productName,
      createdAt: entity.createdAt.toISOString()
    };
  }

  toEntitiesFromResponse(response: OperationalAlertResponse): OperationalAlert[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
