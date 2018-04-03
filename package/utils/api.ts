import axios from 'axios';
import cookie from 'cookie';

import { getCSRFMiddlewareToken, getVacancyList } from './parser';
import { IDOUTokens, IDOUParams, IDOUXHRResponse } from '../interfaces';

const { SOURCE_URL, XHR_URL } = process.env;

const getTokens = () =>
  axios.get<string>(SOURCE_URL).then<IDOUTokens>(response => {
    const { csrftoken } = cookie.parse(response.headers['set-cookie'][0]);
    const csrfmiddlewaretoken = getCSRFMiddlewareToken(response.data);

    return { csrftoken, csrfmiddlewaretoken };
  });

const getVacanciesTemplate = (params: IDOUParams) => (tokens: IDOUTokens) =>
  axios.post<IDOUXHRResponse>(
    XHR_URL,
    `csrfmiddlewaretoken=${tokens.csrfmiddlewaretoken}`,
    {
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Referer: SOURCE_URL,
        Cookie: cookie.serialize('csrftoken', tokens.csrftoken),
      },
    },
  );

export const getVacancies = (params: IDOUParams) =>
  getTokens()
    .then(getVacanciesTemplate(params))
    .then(response => response.data.html)
    .then(getVacancyList);
