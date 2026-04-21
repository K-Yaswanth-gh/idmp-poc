import { useApiClient } from "../../../hooks/useApiClient";
import {
  UserPreference,
  UpdateLanguageRequest,
  UpdateMcpServersRequest,
} from "../types";

export function useUpdateLanguage() {
  const { useMutation } = useApiClient();
  const { mutateAsync, status, error } = useMutation<
    UserPreference,
    UpdateLanguageRequest
  >("put", "/user/preference/language");

  return {
    updateLanguage: mutateAsync,
    status,
    error,
  };
}

export function useUpdateMcpServers() {
  const { useMutation } = useApiClient();
  const { mutateAsync, status, error } = useMutation<
    UserPreference,
    UpdateMcpServersRequest
  >("put", "/user/preference/mcp-servers");

  return {
    updateMcpServers: mutateAsync,
    status,
    error,
  };
}
