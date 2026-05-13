import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../../../shared/infrastructure/http/base-endpoint';
import { StoreZoneLayout } from '../../domain/model/zone.entity';
import { StoreZoneLayoutResource } from '../resources/store-zone-layout-resource';
import { StoreZoneLayoutResponse } from '../responses/store-zone-layout-response';
import { ZoneAssembler } from '../assemblers/zone-assembler';
import { environment } from '../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StoreZoneLayoutApiService extends BaseApiEndpoint<StoreZoneLayout, StoreZoneLayoutResource, StoreZoneLayoutResponse, ZoneAssembler> {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/storeLayoutZones`, new ZoneAssembler());
  }
}

@Injectable({ providedIn: 'root' })
export class StoreConfigurationApiService {
  private storeZoneLayoutService = inject(StoreZoneLayoutApiService);

  getStoreZoneLayouts(): Observable<StoreZoneLayout[]> {
    return this.storeZoneLayoutService.getAll();
  }
}
