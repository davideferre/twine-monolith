import _axios, { AxiosRequestConfig, AxiosError } from "axios";
import qs from "qs";
import { AsyncStorage } from "react-native";
import getEnvVars from "../../environment"; // eslint-disable-line
import { StorageValuesEnum } from "../authentication/types";
import { Api } from "../../../api/src/api/v1/types/api";
import { VolunteerLog } from "../../../api/src/models";

/*
 * Types
 */
export type IdAndName = { id: number; name: string };

/*
 * Axios
 */
// TODO: change version to v1.1 when server changes have been updated
const baseURL = `${getEnvVars().apiBaseUrl}/v1`;

const axios = _axios.create({
  baseURL,
  paramsSerializer: (params) => qs.stringify(params, { encode: false }),
  transformResponse: (r) => {
    const res = JSON.parse(r);

    return res.error ? res : res.result;
  },
});

const makeRequest = async <T = any>(params: AxiosRequestConfig) => {
  let headers;
  try {
    const token = await AsyncStorage.getItem(StorageValuesEnum.USER_TOKEN);
    headers = { Authorization: token };
  } catch (error) {
    headers = {};
  }
  return axios.request<T>({ headers, ...params });
};

/*
 * Requests
 */
const Authentication = {
  login: async ({ email, password }): Promise<any> => (axios.post("/users/login", {
    email,
    password,
    restrict: ['VOLUNTEER', 'VOLUNTEER_ADMIN', 'CB_ADMIN'],
    type: "body",
  })),
  logOut: () => makeRequest({ method: "GET", url: "users/logouts" }),
  roles: () => makeRequest({ method: "GET", url: "/users/me/roles" }),
  userData: () => makeRequest({ method: "GET", url: "/users/me" }),
  update: (changes) => makeRequest({ method: "PUT", url: "/users/me", data: changes }),
};

const Volunteers = {
  get: () =>
    makeRequest<Api.CommunityBusinesses.Id.Volunteers.GET.Result>({
      method: "GET",
      url: "/community-businesses/me/volunteers",
    }),
  add: (volunteer) =>
    makeRequest<Api.Users.Register.Volunteers.POST.Result>({
      method: "POST",
      url: "/users/register/volunteers",
      data: { ...volunteer },
    },
    ),
  update: ({ id, ...changeset }) => makeRequest<Api.Users.Volunteers.Id.PUT.Result>(
    { method: 'PUT', url: `/users/volunteers/${id}`, data: changeset },
  ),
  delete: (id: number) => makeRequest<Api.Users.Volunteers.Id.DELETE.Result>(
    { method: 'DELETE', url: `/users/volunteers/${id}` },
  ),
};

const VolunteerLogs = {
  get: (since?: Date, until?: Date) =>
    makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.GET.Result>({
      //eslint-disable-line
      method: "GET",
      url: "/community-businesses/me/volunteer-logs",
      params: { since, until },
    },
    ),
  getVolunteerActivities: () => axios.get('/volunteer-activities'),
  add: (values: Partial<VolunteerLog>) => makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.POST.Result>( //eslint-disable-line
    {
      method: 'POST',
      url: `/community-businesses/me/volunteer-logs`,
      data: values,
    }),

  update: (id, LogId, values: Partial<VolunteerLog>) => makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.POST.Result>({ //eslint-disable-line
    method: "PUT",
    url: `/community-businesses/me/volunteer-logs/${id}/${LogId}`,
    data: values,
  }),

  delete: (LogId) => makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.DELETE.Result>({ //eslint-disable-line
    method: "DELETE",
    url: `/community-businesses/me/volunteer-logs/${LogId}`,
  }),
};

const CommunityBusiness = {
  get: async (): Promise<any> => axios.get('/community-businesses'),
  register: (data) => { console.log(data) }
}

const Projects = {

  get: () => makeRequest<Api.CommunityBusinesses.Me.Volunteers.Projects.GET.Result>( //eslint-disable-line
    {
      method: 'GET',
      url: '/community-businesses/me/volunteers/projects',
    },
  ),
  delete: (id: number) => makeRequest<Api.CommunityBusinesses.Me.Volunteers.Projects.Id.DELETE.Result>( //eslint-disable-line
    { method: 'DELETE', url: `/community-businesses/me/volunteers/projects/${id}` },
  ),
  restore: (id: number) => makeRequest<Api.CommunityBusinesses.Me.Volunteers.Projects.Id.Restore.PATCH.Result>( //eslint-disable-line
    { method: 'PATCH', url: `/community-businesses/me/volunteers/projects/${id}/restore` },
  ),
  update: (id: number, name: string) => makeRequest<Api.CommunityBusinesses.Me.Volunteers.Projects.Id.PUT.Result>( //eslint-disable-line
    {
      method: 'PUT',
      url: `/community-businesses/me/volunteers/projects/${id}`,
      data: { name },
    },
  ),
  add: (name: string) => makeRequest<Api.CommunityBusinesses.Me.Volunteers.Projects.POST.Result>( //eslint-disable-line
    {
      method: 'POST',
      url: '/community-businesses/me/volunteers/projects',
      data: { name },
    }),
};

const Invite = {
  byEmail: (email) => {
    makeRequest({
      method: "POST",
      url: "/invite/email",
      data: { email }
    })
  }
}

const Users = {
  getPush: (orgId: number, ProjectId: number) =>
    makeRequest({
      method: 'GET',
      url: `/community-businesses/${orgId}/push/${ProjectId}`
    })
  ,
  pushtoken: (id: number, token: string) => {
    console.log('updating push token....');
    makeRequest({
      method: "PUT",
      url: `/users/insertpushtoken/${id}`,
      data: { "pushtoken": token }
    })
  }
}

const Notes = {
  set: (note, logID, activity, project, startedAt) => {
    makeRequest({
      method: "PUT",
      url: "community-businesses/me/volunteer-logs-notes/" + logID,
      data: {
        activity: activity,
        startedAt: startedAt,
        notes: note,
        project: project
      }
    })
  },
  get: (logID) =>
    makeRequest<Api.CommunityBusinesses.Me.VolunteerLogs.Note.GET.Result>({
      method: "GET",
      url: "community-businesses/me/get-volunteer-logs/" + logID
    })
      .then(res => { return res.data })
}

const Constants = {
  activities: () =>
    makeRequest<IdAndName>({
      method: "GET",
      url: "/volunteer-activities",
    }),
};

const API = {
  Authentication,
  Volunteers,
  VolunteerLogs,
  CommunityBusiness,
  Projects,
  Constants,
  Invite,
  Users,
  Notes
};

export default API;

export const getErrorResponse = (res: AxiosError) => {
  try {
    return res.response.data.error;
  } catch (error) {
    console.log(error);
    return res;
  }
};
