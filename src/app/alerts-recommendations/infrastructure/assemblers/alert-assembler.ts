import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { Alert } from '../../domain/model/alert.entity';
import { AlertResource } from '../resources/alert-resource';
import { AlertResponse } from '../responses/alert-response';

export class AlertAssembler implements BaseAssembler<Alert, AlertResource, AlertResponse> {
  toEntityFromResource(resource: AlertResource): Alert {
    return new Alert({
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

  toResourceFromEntity(entity: Alert): AlertResource {
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

  toEntitiesFromResponse(response: AlertResponse): Alert[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
