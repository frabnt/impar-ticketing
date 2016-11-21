import { deserializeAs } from "cerialize";
import { CredentialType } from "./credential-type";
import { Event } from "./event";
import { ManifestEntity } from './manifest-entity';
import { Registrant } from "./registrant";
import { Report } from "./report";
import { ScanningException } from "./scanning-exception";
import { ScanningExceptionZoneAcl } from "./scanning-exception-zone-acl";
import { Schedule } from './schedule';
import { ScheduleSegment } from "./schedule-segment";
import { Zone } from "./zone";
import { ZoneAcl } from "./zone-acl";
import { ZoneAclPass } from "./zone-acl-pass";
import { ZoneScanningPoint } from "./zone-scanning-point";
/**
 * Created by francesco on 06/11/2016.
 */

export class Manifest {
  @deserializeAs(
    CredentialType,
    'credential_types'
  )
  credentialTypes: CredentialType[] = undefined;
  @deserializeAs(Event)
  event: Event = undefined;
  @deserializeAs(ManifestEntity)
  manifest: ManifestEntity[] = undefined;
  @deserializeAs(Registrant)
  registrants: Registrant[] = undefined;
  @deserializeAs(Report)
  reports: Report[] = undefined;
  @deserializeAs(
    ScanningException,
    'scanning_exceptions'
  )
  scanningExceptions: ScanningException[] = undefined;
  @deserializeAs(
    ScanningExceptionZoneAcl,
    'scanning_exceptions_zones_acl'
  )
  scanningExceptionsZonesAcl: ScanningExceptionZoneAcl[] = undefined;
  @deserializeAs(Schedule)
  schedules: Schedule[] = undefined;
  @deserializeAs(
    ScheduleSegment,
    'schedules_segments'
  )
  schedulesSegments: ScheduleSegment[] = undefined;
  @deserializeAs(Zone)
  zones: Zone[] = undefined;
  @deserializeAs(
    ZoneAcl,
    'zones_acl'
  )
  zonesAcl: ZoneAcl[] = undefined;
  @deserializeAs(
    ZoneAclPass,
    'zones_acl_passes'
  )
  zonesAclPasses: ZoneAclPass[] = undefined;
  @deserializeAs(
    ZoneScanningPoint,
    'zones_scanning_points'
  )
  zonesScanningPoints: ZoneScanningPoint[] = undefined;

  /**
   * Extract report id and report type values info of each Report item
   * @param {Report[]} reports - an array of Report
   * @returns {any[]}
   */
  getReports(reports: Report[]): any[] {
    let res: any[] = [];

    reports.map(report => {
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

    reports.map(report => {
      report.content.zones.map(zone => {
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
