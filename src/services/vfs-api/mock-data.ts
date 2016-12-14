/**
 * Created by francesco on 14/12/2016.
 */

// Mock for manifest api response
export const MOCK_MANIFEST = {
  "event": {
    "event_id": "testEventID",
    "event_name": "Sweetwater 420 Festival 2015",
    "event_description": null,
    "date_start": "2015-04-17 04:00:00",
    "date_end": "2015-04-19 04:00:00",
    "timezone": "US/Eastern"
  },
  "credential_types": [
    {
      "credential_type_id": "credential ID",
      "modified": "2015-03-18 00:04:06",
      "is_deleted": 0,
      "deleted": null,
      "credential_type": "Credential",
      "credential_name": "NSSD",
      "credential_desc": null,
      "validation_type": "RFID",
      "tokens_granted": 0,
      "is_active": 1,
      "is_one_day": 0,
      "is_any_uid": 0
    }
  ],
  "manifest": [
    {
      "manifest_id": "manifest-1",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-2",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-3",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-4",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-5",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-6",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    },
    {
      "manifest_id": "manifest-7",
      "modified": "2015-04-18 09:04:14",
      "is_deleted": 0,
      "scan_code": "04FFB932A04080",
      "is_activated": 1,
      "activated": "2015-03-30 00:57:47",
      "is_deactivated": 0,
      "deactivated": null,
      "deactivation_reason": null,
      "credential_type_id": "frbf-ceioceow-33nj-434ijin3m",
      "scan_status": 0,
      "validation_type": "RFID"
    }
  ],
  "registrants": [
    {
      "registrant_id": "abcd",
      "name_last": "Polomsky",
      "name_first": "Ryan"
    }
  ],
  "scanning_exceptions": [
    {
      "exception_id": "exception-1245",
      "exception_name": "Big Fish",
      "exception_desc": null,
      "modified": "2015-04-19 00:38:33",
      "is_deleted": 0,
      "is_active": 1
    }
  ],
  "scanning_exceptions_zones_acl": [
    {
      "exception_zone_id": "exception-zone-6578",
      "exception_id": "exception-89",
      "zone_acl_id": "zone-acl-78",
      "modified": "2015-04-19 16:42:15",
      "is_deleted": 0,
      "is_active": 1
    }
  ],
  "schedules": [
    {
      "scanning_schedule_id": "scanning-schedule-0967",
      "modified": "2015-04-18 01:37:26",
      "is_deleted": 0,
      "schedule_name": "Friday",
      "is_active": 1
    }
  ],
  "schedules_segments": [
    {
      "scanning_schedule_segment_id": "scanning-schedule-segment-7895",
      "scanning_schedule_id": "scanning-schedule-8967",
      "modified": "2015-04-18 01:36:45",
      "segment_start": "2015-04-17 14:45:00",
      "segment_end": "2015-04-18 02:00:00",
      "is_deleted": 0,
      "is_active": 1
    }
  ],
  "zones": [
    {
      "zone_id": "zone-7645",
      "zone_name": "General Admission",
      "modified": "2015-03-31 10:50:08",
      "is_deleted": 0,
      "is_active": 1,
      "is_multipeer": 0
    }
  ],
  "zones_acl": [
    {
      "zone_acl_id": "zone-acl-8945",
      "zone_id": "zone-4761",
      "modified": "2015-04-17 21:24:30",
      "is_tokens_acl": 0,
      "is_deleted": 0
    }
  ],
  "zones_acl_passes": [
    {
      "zone_acl_pass_id": "zone-acl-pass-89",
      "zone_acl_id": "zone-acl-1256",
      "modified": "2015-04-18 04:02:17",
      "credential_type_id": "credential-type-89",
      "scan_type": "VALIDATION",
      "is_scheduled": 0,
      "scanning_schedule_id": null,
      "is_deleted": 0,
      "is_active": 1
    }
  ],
  "zones_scanning_points": [
    {
      "scanning_point_id": "scanning-point-9643",
      "zone_id": "zone-2354",
      "zone_acl_id": "zone-acl-YJKL",
      "modified": "2015-04-18 07:30:44",
      "scanpoint_name": "West Gate - LANE 1",
      "scan_direction": "IN",
      "is_deleted": 0,
      "is_active": 1
    }
  ],
  "reports": []
};

// Mock for tickets api response
export const MOCK_TICKETS = {
  "orders": [
    {
      "order_id": "order-8967",
      "barcode_id": "%SF22674561",
      "deleted": null,
      "is_deleted": 0,
      "modified": "2015-04-03 22:19:59"
    },
    {
      "order_id": "order-9967",
      "barcode_id": "%SF22674561",
      "deleted": null,
      "is_deleted": 0,
      "modified": "2015-04-03 22:19:59"
    }
  ],
  "orders_transactions": [
    {
      "order_id": "order-8967",
      "transaction_id": "transaction-8967",
      "barcode_id": "%STGRP5GKZS",
      "modified": "2015-03-20 22:42:30",
      "is_deleted": 0,
      "deleted": null,
      "transaction_type": "TICKET",
      "identifier": "AB567kl",
      "credential_type_id": "credential-type-5689",
      "voided": null,
      "activated": "2015-03-30 00:54:43",
      "deactivated": null,
      "deactivation_reason": null,
      "scan_status": 0,
      "one_day": null,
      "registrant_id": null,
      "manifest_id": "manifest-5679",
      "last_scan_mode": null,
      "tokens_granted": -1,
      "tokens_used": 0
    },
    {
      "order_id": "order-9967",
      "transaction_id": "transaction-9967",
      "barcode_id": "%STGRP5GKZS",
      "modified": "2015-03-20 22:42:30",
      "is_deleted": 0,
      "deleted": null,
      "transaction_type": "TICKET",
      "identifier": "AB567kl",
      "credential_type_id": "credential-type-5689",
      "voided": null,
      "activated": "2015-03-30 00:54:43",
      "deactivated": null,
      "deactivation_reason": null,
      "scan_status": 0,
      "one_day": null,
      "registrant_id": null,
      "manifest_id": "manifest-5679",
      "last_scan_mode": null,
      "tokens_granted": -1,
      "tokens_used": 0
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 4,
    "per_page": 20000,
    "total": 80000
  }
};
