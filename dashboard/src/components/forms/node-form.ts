import { DataLimitResetStrategy, NodeConnectionType } from '@/service/api'
import { z } from 'zod'

export const nodeFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  port: z.number().min(1, 'Port is required'),
  api_port: z.number().min(1).optional().nullable(),
  usage_coefficient: z.number().optional(),
  connection_type: z.enum([NodeConnectionType.grpc, NodeConnectionType.rest]),
  no_tls: z.boolean().default(false),
  server_ca: z.string().optional().nullable(),
  keep_alive: z.number().min(0, 'Keep alive must be 0 or greater'),
  keep_alive_unit: z.enum(['seconds', 'minutes', 'hours']).default('seconds'),
  api_key: z.string().min(1, 'API key is required'),
  core_config_id: z.number().min(1, 'Core configuration is required'),
  data_limit: z.number().min(0).optional().nullable(),
  data_limit_reset_strategy: z.nativeEnum(DataLimitResetStrategy).optional().nullable(),
  reset_time: z.union([z.null(), z.undefined(), z.number().min(-1)]),
  default_timeout: z.number().min(3, 'Default timeout must be 3 or greater').max(60, 'Default timeout must be 60 or lower').optional(),
  internal_timeout: z.number().min(3, 'Internal timeout must be 3 or greater').max(60, 'Internal timeout must be 60 or lower').optional(),
}).refine((data) => {
  // If noTLS is false, server_ca is required
  if (!data.no_tls) {
    return data.server_ca && data.server_ca.trim().length > 0
  }
  return true
}, {
  message: 'Server CA is required when TLS is enabled',
  path: ['server_ca'],
})

export type NodeFormValues = z.input<typeof nodeFormSchema>
