import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { API_URL, auth } from "@/config/firebase";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// tremor utils

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

// Tremor focusInput [v0.0.2]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-bcgw-yellow-light dark:focus:ring-bcgw-yellow-dark",
  // border color
  "focus:border-bcgw-yellow-dark dark:focus:border-bcgw-yellow-dark",
];

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-bcgw-yellow-dark dark:outline-bcgw-yellow-dark",
];

// Tremor Raw hasErrorInput [v0.0.1]

export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

export const axiosClient = async () => {
  return axios.create({
    baseURL: API_URL,
    headers: auth.currentUser
      ? {
          Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
        }
      : {},
  });
};

export const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
