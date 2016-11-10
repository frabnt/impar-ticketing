import { JsonProperty } from './decorators/json-property';
import { CredentialType } from "./credential_type";
import { Event } from "./event";
import { ManifestEntity } from './manifest-entity';
import { Registrant } from "./registrant";
import { Report } from "./report";
import { ScanningException } from "./scanning_exception";
import { ScanningExceptionZoneAcl } from "./scanning_exception_zone_acl";
import { Schedule } from './schedule';
import { ScheduleSegment } from "./schedule_segment";
import { Zone } from "./zone";
import { ZoneAcl } from "./zone_acl";
import { ZoneAclPass } from "./zone_acl_pass";
import { ZoneScanningPoint } from "./zone_scanning_point";
/**
 * Created by francesco on 06/11/2016.
 */

export class Manifest {
  @JsonProperty({
      name: 'credential_types',
      clazz: CredentialType
    })
  credentialTypes: CredentialType[] = undefined;
  @JsonProperty({ clazz: Event })
  event: Event = undefined;
  @JsonProperty({ clazz: ManifestEntity })
  manifest: ManifestEntity[] = undefined;
  @JsonProperty({ clazz: Registrant })
  registrants: Registrant[] = undefined;
  @JsonProperty({ clazz: Report })
  reports: Report[] = undefined;
  @JsonProperty({
    name: 'scanning_exceptions',
    clazz: ScanningException
  })
  scanningExceptions: ScanningException[] = undefined;
  @JsonProperty({
    name: 'scanning_exceptions_zones_acl',
    clazz: ScanningExceptionZoneAcl
  })
  scanningExceptionsZonesAcl: ScanningExceptionZoneAcl[] = undefined;
  @JsonProperty({ clazz: Schedule })
  schedules: Schedule[] = undefined;
  @JsonProperty({
    name: 'schedules_segments',
    clazz: ScheduleSegment
  })
  schedulesSegments: ScheduleSegment[] = undefined;
  @JsonProperty({ clazz: Zone })
  zones: Zone[] = undefined;
  @JsonProperty({
    name: 'zones_acl',
    clazz: ZoneAcl
  })
  zonesAcl: ZoneAcl[] = undefined;
  @JsonProperty({
    name: 'zones_acl_passes',
    clazz: ZoneAclPass
  })
  zonesAclPasses: ZoneAclPass[] = undefined;
  @JsonProperty({
    name: 'zones_scanning_points',
    clazz: ZoneScanningPoint
  })
  zonesScanningPoints: ZoneScanningPoint[] = undefined;

  /**
   * Extract report id and report type values info of each Report item
   * @param {Report[]} reports - an array of Report
   * @returns {any[]}
   */
  getReports(reports: Report[]): any[] {
    let res: any[] = [];

    reports.map((report) => {
      res.push([report.reportId, report.type]);
    });
    return res;
  }

  /**
   *  Extract some info of each Report item content
   * @param {Report[]} reports - an array of Report
   * @returns {any[]}
   */
  getReportsContents(reports: Report[]): any[] {
    let res: any[] = [];

    reports.map((report) => {
      report.content.zones.map((zone) => {
        zone.credentialsTypes.map(credType => {
          res.push([
            credType.entryId,
            credType.value,
            report.reportId,
            credType.referenceId,
            zone.groupId,
          ]);
        });
      });
    });
    return res;
  }
}
