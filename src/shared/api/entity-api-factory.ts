import { baseApi } from './base-api';

import type { BaseApiEndpointBuilder } from './base-api';
import type { EndpointDefinitions } from '@reduxjs/toolkit/query/react';

export function createEntityApi<T extends EndpointDefinitions>(
  endpointBuilder: (builder: BaseApiEndpointBuilder) => T,
) {
  const api = baseApi.injectEndpoints({ endpoints: endpointBuilder });
  return { api, ...api };
}
