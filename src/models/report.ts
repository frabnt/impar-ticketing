import { deserializeAs, deserialize } from "cerialize";
/**
 * Created by francesco on 25/10/2016.
 */

export class CredentialType {
  @deserializeAs('entry_id')
  entryId: string = undefined;
  @deserialize
  name: string = undefined;
  @deserializeAs('reference_id')
  referenceId: string = undefined;
  @deserialize
  value: number = undefined;
}

export class Zone {
  @deserializeAs(
    CredentialType,
    'credentials_types'
  )
  credentialsTypes: CredentialType[] = undefined;
  @deserializeAs('group_id')
  groupId: string = undefined;
  @deserialize
  name: string = undefined;
}

export class Content {
  @deserializeAs(Zone)
  zones: Zone[] = undefined;
}

export class Report {
  @deserializeAs(Content)
  content: Content = undefined;
  @deserializeAs('report_id')
  reportId: string = undefined;
  @deserialize
  type: string = undefined;
}
