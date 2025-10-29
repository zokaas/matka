import { getFetchClient } from '@strapi/strapi/admin';

const { get, post, put, del } = getFetchClient();

export const fetchQuestions = async (locale: string = 'se') => {
  const { data } = await get(`/kyc-question-builder/questions?locale=${locale}`);
  return data;
};

export const fetchQuestion = async (id: string, locale: string = 'se') => {
  const { data } = await get(`/kyc-question-builder/questions/${id}?locale=${locale}`);
  return data;
};

export const createQuestion = async (questionData: any, locale: string = 'se') => {
  const { data } = await post(`/kyc-question-builder/questions?locale=${locale}`, questionData);
  return data;
};

export const updateQuestion = async (id: string, questionData: any, locale: string = 'se') => {
  const { data } = await put(`/kyc-question-builder/questions/${id}?locale=${locale}`, questionData);
  return data;
};

export const deleteQuestion = async (id: string, locale: string = 'se') => {
  const { data } = await del(`/kyc-question-builder/questions/${id}?locale=${locale}`);
  return data;
};

export const fetchTemplates = async () => {
  const { data } = await get('/kyc-question-builder/templates');
  return data;
};

export const fetchErrorMessages = async () => {
  const { data } = await get('/kyc-question-builder/error-messages');
  return data;
};