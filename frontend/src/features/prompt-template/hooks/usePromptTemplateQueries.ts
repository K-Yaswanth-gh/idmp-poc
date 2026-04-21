import { useApiClient } from "../../../hooks/useApiClient";
import {
  GetPromptTemplatesResponse,
  GetPromptTemplateResponse,
  PromptTemplateType,
} from "../types";

export const getPromptTemplatesKey = (type: PromptTemplateType) =>
  `/prompt-templates/${type}`;

export const getPromptTemplateKey = (id: string | null) =>
  id ? `/prompt-templates/id/${id}` : null;

export function usePromptTemplates(type: PromptTemplateType) {
  const url = getPromptTemplatesKey(type);
  const { data, isLoading, error, refetch } =
    useApiClient().useQuery<GetPromptTemplatesResponse>(url);

  return {
    templates: data?.templates || [],
    isLoading,
    error,
    refetch,
  };
}

export function usePromptTemplate(id: string | null) {
  const url = getPromptTemplateKey(id);
  const { data, isLoading, error } =
    useApiClient().useQuery<GetPromptTemplateResponse>(url);

  return {
    template: data?.template,
    isLoading,
    isError: !!error,
  };
}
