import { useApiClient } from "../../../hooks/useApiClient";
import { GetUserPreferenceResponse } from "../types";

export const getUserPreferenceKey = () => `/user/preference`;

export function useUserPreference() {
  const url = getUserPreferenceKey();
  const { data, isLoading, error, refetch } =
    useApiClient().useQuery<GetUserPreferenceResponse>(url);

  return {
    preference: data,
    isLoading,
    error,
    refetch,
  };
}
