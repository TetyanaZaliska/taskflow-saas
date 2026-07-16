import { cookies } from "next/headers";
import { API_URL } from "../constants/api";
import { getErrorMessage } from "./errors";
import { getRouteName } from "./get-route-name";

const getHeaders = async () => ({
  Cookie: (await cookies()).toString(),
});

const safeParseJson = async (res: Response) => {
  const textRes = await res.text();
  const parseRes = textRes ? JSON.parse(textRes) : {};

  return parseRes;
};

export const post = async (path: string, formData: FormData) => {
  const pathName = getRouteName(path);

  const res = await fetch(`${API_URL}/${pathName}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getHeaders()),
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  //const parseRes = await res.json();
  const parseRes = await safeParseJson(res);
  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }
  return { error: "" };
};

export const get = async (path: string, tags?: string[]) => {
  const pathName = getRouteName(path);

  const res = await fetch(`${API_URL}/${pathName}`, {
    headers: { ...(await getHeaders()) },
    next: { tags },
  });

  //const parseRes = await res.json();
  const parseRes = await safeParseJson(res);

  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }

  return parseRes;

  //return res.json() as T;
};

export const remove = async (path: string) => {
  const pathName = getRouteName(path);

  const res = await fetch(`${API_URL}/${pathName}`, {
    method: "DELETE",
    headers: { ...(await getHeaders()) },
  });

  //const parseRes = await res.json();
  const parseRes = await safeParseJson(res);

  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }
  return { error: "" };
};

export const update = async (path: string, formData: FormData) => {
  const pathName = getRouteName(path);

  const res = await fetch(`${API_URL}/${pathName}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await getHeaders()),
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  //const parseRes = await res.json();
  const parseRes = await safeParseJson(res);

  if (!res.ok) {
    return { error: getErrorMessage(parseRes) };
  }
  return { error: "" };
};
