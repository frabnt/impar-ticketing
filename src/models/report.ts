import { JsonProperty } from './decorators/json-property';
/**
 * Created by francesco on 25/10/2016.
 */

export class CredentialType {
  @JsonProperty({ name: 'entry_id' })
  entryId: string = undefined;
  name: string = undefined;
  @JsonProperty({ name: 'reference_id' })
  referenceId: string = undefined;
  value: number = undefined;
}

export class Zone {
  @JsonProperty({
    name: 'credentials_types',
    clazz: CredentialType
  })
  credentialsTypes: CredentialType[] = undefined;
  @JsonProperty({ name: 'group_id' })
  groupId: string = undefined;
  name: string = undefined;
}

export class Content {
  @JsonProperty({ clazz: Zone })
  zones: Zone[] = undefined;
}

export class Report {
  @JsonProperty({ clazz: Content })
  content: Content = undefined;
  @JsonProperty({ name: 'report_id' })
  reportId: string = undefined;
  type: string = undefined;
}
