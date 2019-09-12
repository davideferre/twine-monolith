/* tslint:disable */

/**
 * AUTO-GENERATED FILE @ 2019-09-08 22:29:45 - DO NOT EDIT!
 *
 * This file was automatically generated by schemats v.3.0.3
 * $ schemats generate -c postgres://username:password@localhost:5432/twine-api-clone -t access_role -t access_role_permission -t api_token -t cls_survey_benchmark_data -t community_business -t community_business_region -t community_business_sector -t confirm_add_role -t data_sync_log -t disability -t ethnicity -t frontline_account -t frontline_survey_answer -t frontline_survey_question -t funding_body -t funding_programme -t funding_programme_community_business -t gender -t geography_columns -t geometry_columns -t knex_migrations -t knex_migrations_lock -t login_event -t nps_survey_benchmark_data -t organisation -t outreach_campaign -t outreach_campaign_target -t outreach_campaign_target_type -t outreach_meeting -t outreach_meeting_type -t outreach_type -t permission -t raster_columns -t raster_overviews -t single_use_token -t spatial_ref_sys -t subscription -t subscription_type -t training_session -t training_session_organisation -t user_account -t user_account_access_role -t user_account_active_day -t user_secret_reset -t visit_activity -t visit_activity_category -t visit_feedback -t visit_log -t volunteer_activity -t volunteer_admin_code -t volunteer_hours_log -t volunteer_project -s public
 *
 */

export type enum_access_type = 'delete' | 'read' | 'write';
export type enum_invitation_status = 'accepted' | 're-sent' | 'revoked' | 'sent';
export type enum_permission_level = 'all' | 'child' | 'own' | 'parent' | 'sibling';
export type enum_subscription_status = 'active' | 'closed' | 'frozen' | 'trial';
export type enum_turnover_band = '<£100k' | '>£10m' | '£100k-£250k' | '£1m-£5m' | '£250k-£500k' | '£500k-£750k' | '£5m-£10m' | '£750k-£1m';

export namespace access_roleFields {
    export type access_role_id = number;
    export type access_role_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface access_role {
    access_role_id: access_roleFields.access_role_id;
    access_role_name: access_roleFields.access_role_name;
    created_at: access_roleFields.created_at;
    modified_at: access_roleFields.modified_at;
    deleted_at: access_roleFields.deleted_at;

}

export namespace access_role_permissionFields {
    export type access_role_id = number;
    export type permission_id = number;

}

export interface access_role_permission {
    access_role_id: access_role_permissionFields.access_role_id;
    permission_id: access_role_permissionFields.permission_id;

}

export namespace api_tokenFields {
    export type api_token_id = number;
    export type api_token_name = string;
    export type api_token_access = string;
    export type api_token = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface api_token {
    api_token_id: api_tokenFields.api_token_id;
    api_token_name: api_tokenFields.api_token_name;
    api_token_access: api_tokenFields.api_token_access;
    api_token: api_tokenFields.api_token;
    created_at: api_tokenFields.created_at;
    modified_at: api_tokenFields.modified_at;
    deleted_at: api_tokenFields.deleted_at;

}

export namespace community_businessFields {
    export type organisation_id = number;
    export type community_business_region_id = number;
    export type community_business_sector_id = number;
    export type address_1 = string | null;
    export type address_2 = string | null;
    export type town_city = string | null;
    export type post_code = string | null;
    export type coordinates = any | null;
    export type logo_url = string | null;
    export type turnover_band = enum_turnover_band | null;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface community_business {
    organisation_id: community_businessFields.organisation_id;
    community_business_region_id: community_businessFields.community_business_region_id;
    community_business_sector_id: community_businessFields.community_business_sector_id;
    address_1: community_businessFields.address_1;
    address_2: community_businessFields.address_2;
    town_city: community_businessFields.town_city;
    post_code: community_businessFields.post_code;
    coordinates: community_businessFields.coordinates;
    logo_url: community_businessFields.logo_url;
    turnover_band: community_businessFields.turnover_band;
    created_at: community_businessFields.created_at;
    modified_at: community_businessFields.modified_at;
    deleted_at: community_businessFields.deleted_at;

}

export namespace community_business_regionFields {
    export type community_business_region_id = number;
    export type region_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface community_business_region {
    community_business_region_id: community_business_regionFields.community_business_region_id;
    region_name: community_business_regionFields.region_name;
    created_at: community_business_regionFields.created_at;
    modified_at: community_business_regionFields.modified_at;
    deleted_at: community_business_regionFields.deleted_at;

}

export namespace community_business_sectorFields {
    export type community_business_sector_id = number;
    export type sector_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface community_business_sector {
    community_business_sector_id: community_business_sectorFields.community_business_sector_id;
    sector_name: community_business_sectorFields.sector_name;
    created_at: community_business_sectorFields.created_at;
    modified_at: community_business_sectorFields.modified_at;
    deleted_at: community_business_sectorFields.deleted_at;

}

export namespace confirm_add_roleFields {
    export type confirm_add_role_id = number;
    export type user_account_id = number;
    export type single_use_token_id = number;

}

export interface confirm_add_role {
    confirm_add_role_id: confirm_add_roleFields.confirm_add_role_id;
    user_account_id: confirm_add_roleFields.user_account_id;
    single_use_token_id: confirm_add_roleFields.single_use_token_id;

}

export namespace disabilityFields {
    export type disability_id = number;
    export type disability_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface disability {
    disability_id: disabilityFields.disability_id;
    disability_name: disabilityFields.disability_name;
    created_at: disabilityFields.created_at;
    modified_at: disabilityFields.modified_at;
    deleted_at: disabilityFields.deleted_at;

}

export namespace ethnicityFields {
    export type ethnicity_id = number;
    export type ethnicity_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface ethnicity {
    ethnicity_id: ethnicityFields.ethnicity_id;
    ethnicity_name: ethnicityFields.ethnicity_name;
    created_at: ethnicityFields.created_at;
    modified_at: ethnicityFields.modified_at;
    deleted_at: ethnicityFields.deleted_at;

}

export namespace genderFields {
    export type gender_id = number;
    export type gender_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface gender {
    gender_id: genderFields.gender_id;
    gender_name: genderFields.gender_name;
    created_at: genderFields.created_at;
    modified_at: genderFields.modified_at;
    deleted_at: genderFields.deleted_at;

}

export namespace login_eventFields {
    export type login_event_id = number;
    export type user_account_id = number;
    export type created_at = Date;
    export type deleted_at = Date | null;

}

export interface login_event {
    login_event_id: login_eventFields.login_event_id;
    user_account_id: login_eventFields.user_account_id;
    created_at: login_eventFields.created_at;
    deleted_at: login_eventFields.deleted_at;

}

export namespace organisationFields {
    export type organisation_id = number;
    export type organisation_name = string;
    export type _360_giving_id = string | null;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;
    export type is_temp = boolean | null;

}

export interface organisation {
    organisation_id: organisationFields.organisation_id;
    organisation_name: organisationFields.organisation_name;
    _360_giving_id: organisationFields._360_giving_id;
    created_at: organisationFields.created_at;
    modified_at: organisationFields.modified_at;
    deleted_at: organisationFields.deleted_at;
    is_temp: organisationFields.is_temp;

}

export namespace permissionFields {
    export type permission_id = number;
    export type permission_entity = string;
    export type permission_level = enum_permission_level;
    export type access_type = enum_access_type;

}

export interface permission {
    permission_id: permissionFields.permission_id;
    permission_entity: permissionFields.permission_entity;
    permission_level: permissionFields.permission_level;
    access_type: permissionFields.access_type;

}

export namespace single_use_tokenFields {
    export type single_use_token_id = number;
    export type token = string;
    export type created_at = Date;
    export type expires_at = Date;
    export type used_at = Date | null;
    export type deleted_at = Date | null;

}

export interface single_use_token {
    single_use_token_id: single_use_tokenFields.single_use_token_id;
    token: single_use_tokenFields.token;
    created_at: single_use_tokenFields.created_at;
    expires_at: single_use_tokenFields.expires_at;
    used_at: single_use_tokenFields.used_at;
    deleted_at: single_use_tokenFields.deleted_at;

}

export namespace user_accountFields {
    export type user_account_id = number;
    export type user_name = string;
    export type user_password = string | null;
    export type qr_code = string | null;
    export type gender_id = number;
    export type disability_id = number;
    export type ethnicity_id = number;
    export type email = string | null;
    export type phone_number = string | null;
    export type post_code = string | null;
    export type birth_year = number | null;
    export type is_email_confirmed = boolean;
    export type is_phone_number_confirmed = boolean;
    export type is_email_contact_consent_granted = boolean;
    export type is_sms_contact_consent_granted = boolean;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;
    export type is_temp = boolean | null;

}

export interface user_account {
    user_account_id: user_accountFields.user_account_id;
    user_name: user_accountFields.user_name;
    user_password: user_accountFields.user_password;
    qr_code: user_accountFields.qr_code;
    gender_id: user_accountFields.gender_id;
    disability_id: user_accountFields.disability_id;
    ethnicity_id: user_accountFields.ethnicity_id;
    email: user_accountFields.email;
    phone_number: user_accountFields.phone_number;
    post_code: user_accountFields.post_code;
    birth_year: user_accountFields.birth_year;
    is_email_confirmed: user_accountFields.is_email_confirmed;
    is_phone_number_confirmed: user_accountFields.is_phone_number_confirmed;
    is_email_contact_consent_granted: user_accountFields.is_email_contact_consent_granted;
    is_sms_contact_consent_granted: user_accountFields.is_sms_contact_consent_granted;
    created_at: user_accountFields.created_at;
    modified_at: user_accountFields.modified_at;
    deleted_at: user_accountFields.deleted_at;
    is_temp: user_accountFields.is_temp;

}

export namespace user_account_access_roleFields {
    export type user_account_access_role_id = number;
    export type user_account_id = number;
    export type access_role_id = number;
    export type organisation_id = number;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface user_account_access_role {
    user_account_access_role_id: user_account_access_roleFields.user_account_access_role_id;
    user_account_id: user_account_access_roleFields.user_account_id;
    access_role_id: user_account_access_roleFields.access_role_id;
    organisation_id: user_account_access_roleFields.organisation_id;
    created_at: user_account_access_roleFields.created_at;
    modified_at: user_account_access_roleFields.modified_at;
    deleted_at: user_account_access_roleFields.deleted_at;

}

export namespace user_account_active_dayFields {
    export type user_account_active_day_id = number;
    export type user_account_id = number;
    export type origin = string;
    export type created_at = Date;
    export type deleted_at = Date | null;

}

export interface user_account_active_day {
    user_account_active_day_id: user_account_active_dayFields.user_account_active_day_id;
    user_account_id: user_account_active_dayFields.user_account_id;
    origin: user_account_active_dayFields.origin;
    created_at: user_account_active_dayFields.created_at;
    deleted_at: user_account_active_dayFields.deleted_at;

}

export namespace user_secret_resetFields {
    export type user_secret_reset_id = number;
    export type user_account_id = number;
    export type single_use_token_id = number;

}

export interface user_secret_reset {
    user_secret_reset_id: user_secret_resetFields.user_secret_reset_id;
    user_account_id: user_secret_resetFields.user_account_id;
    single_use_token_id: user_secret_resetFields.single_use_token_id;

}

export namespace visit_activityFields {
    export type visit_activity_id = number;
    export type organisation_id = number;
    export type visit_activity_category_id = number | null;
    export type visit_activity_name = string;
    export type monday = boolean;
    export type tuesday = boolean;
    export type wednesday = boolean;
    export type thursday = boolean;
    export type friday = boolean;
    export type saturday = boolean;
    export type sunday = boolean;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface visit_activity {
    visit_activity_id: visit_activityFields.visit_activity_id;
    organisation_id: visit_activityFields.organisation_id;
    visit_activity_category_id: visit_activityFields.visit_activity_category_id;
    visit_activity_name: visit_activityFields.visit_activity_name;
    monday: visit_activityFields.monday;
    tuesday: visit_activityFields.tuesday;
    wednesday: visit_activityFields.wednesday;
    thursday: visit_activityFields.thursday;
    friday: visit_activityFields.friday;
    saturday: visit_activityFields.saturday;
    sunday: visit_activityFields.sunday;
    created_at: visit_activityFields.created_at;
    modified_at: visit_activityFields.modified_at;
    deleted_at: visit_activityFields.deleted_at;

}

export namespace visit_activity_categoryFields {
    export type visit_activity_category_id = number;
    export type visit_activity_category_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface visit_activity_category {
    visit_activity_category_id: visit_activity_categoryFields.visit_activity_category_id;
    visit_activity_category_name: visit_activity_categoryFields.visit_activity_category_name;
    created_at: visit_activity_categoryFields.created_at;
    modified_at: visit_activity_categoryFields.modified_at;
    deleted_at: visit_activity_categoryFields.deleted_at;

}

export namespace visit_feedbackFields {
    export type visit_feedback_id = number;
    export type organisation_id = number;
    export type score = number;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface visit_feedback {
    visit_feedback_id: visit_feedbackFields.visit_feedback_id;
    organisation_id: visit_feedbackFields.organisation_id;
    score: visit_feedbackFields.score;
    created_at: visit_feedbackFields.created_at;
    modified_at: visit_feedbackFields.modified_at;
    deleted_at: visit_feedbackFields.deleted_at;

}

export namespace visit_logFields {
    export type visit_log_id = number;
    export type user_account_id = number;
    export type visit_activity_id = number;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface visit_log {
    visit_log_id: visit_logFields.visit_log_id;
    user_account_id: visit_logFields.user_account_id;
    visit_activity_id: visit_logFields.visit_activity_id;
    created_at: visit_logFields.created_at;
    modified_at: visit_logFields.modified_at;
    deleted_at: visit_logFields.deleted_at;

}

export namespace volunteer_activityFields {
    export type volunteer_activity_id = number;
    export type volunteer_activity_name = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface volunteer_activity {
    volunteer_activity_id: volunteer_activityFields.volunteer_activity_id;
    volunteer_activity_name: volunteer_activityFields.volunteer_activity_name;
    created_at: volunteer_activityFields.created_at;
    modified_at: volunteer_activityFields.modified_at;
    deleted_at: volunteer_activityFields.deleted_at;

}

export namespace volunteer_admin_codeFields {
    export type volunteer_admin_code_id = number;
    export type organisation_id = number;
    export type code = string;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface volunteer_admin_code {
    volunteer_admin_code_id: volunteer_admin_codeFields.volunteer_admin_code_id;
    organisation_id: volunteer_admin_codeFields.organisation_id;
    code: volunteer_admin_codeFields.code;
    created_at: volunteer_admin_codeFields.created_at;
    modified_at: volunteer_admin_codeFields.modified_at;
    deleted_at: volunteer_admin_codeFields.deleted_at;

}

export namespace volunteer_hours_logFields {
    export type volunteer_hours_log_id = number;
    export type volunteer_activity_id = number;
    export type volunteer_project_id = number | null;
    export type user_account_id = number;
    export type organisation_id = number;
    export type duration = string;
    export type started_at = Date;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;
    export type created_by = number | null;

}

export interface volunteer_hours_log {
    volunteer_hours_log_id: volunteer_hours_logFields.volunteer_hours_log_id;
    volunteer_activity_id: volunteer_hours_logFields.volunteer_activity_id;
    volunteer_project_id: volunteer_hours_logFields.volunteer_project_id;
    user_account_id: volunteer_hours_logFields.user_account_id;
    organisation_id: volunteer_hours_logFields.organisation_id;
    duration: volunteer_hours_logFields.duration;
    started_at: volunteer_hours_logFields.started_at;
    created_at: volunteer_hours_logFields.created_at;
    modified_at: volunteer_hours_logFields.modified_at;
    deleted_at: volunteer_hours_logFields.deleted_at;
    created_by: volunteer_hours_logFields.created_by;

}

export namespace volunteer_projectFields {
    export type volunteer_project_id = number;
    export type volunteer_project_name = string;
    export type organisation_id = number;
    export type created_at = Date;
    export type modified_at = Date | null;
    export type deleted_at = Date | null;

}

export interface volunteer_project {
    volunteer_project_id: volunteer_projectFields.volunteer_project_id;
    volunteer_project_name: volunteer_projectFields.volunteer_project_name;
    organisation_id: volunteer_projectFields.organisation_id;
    created_at: volunteer_projectFields.created_at;
    modified_at: volunteer_projectFields.modified_at;
    deleted_at: volunteer_projectFields.deleted_at;

}