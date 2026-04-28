import { defineEntity, p } from '@mikro-orm/core';
import { ClientBiaScan } from './client-bia-scan.entity';

const ClientBiaCircumferenceSchema = defineEntity({
  name: 'ClientBiaCircumference',
  tableName: 'client_bia_circumferences',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    biaScan: p.oneToOne(ClientBiaScan),
    chestCm: p.double().nullable(),
    waistCm: p.double().nullable(),
    hipsCm: p.double().nullable(),
    leftArmCm: p.double().nullable(),
    rightArmCm: p.double().nullable(),
    leftThighCm: p.double().nullable(),
    rightThighCm: p.double().nullable(),
    leftCalfCm: p.double().nullable(),
    rightCalfCm: p.double().nullable(),
  },
});

export class ClientBiaCircumference
  extends ClientBiaCircumferenceSchema.class {}
ClientBiaCircumferenceSchema.setClass(ClientBiaCircumference);
