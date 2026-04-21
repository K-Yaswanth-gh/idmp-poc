import { useApiClient } from "../../../hooks/useApiClient";
import {
  CreatePromptTemplateRequest,
  UpdatePromptTemplateRequest,
  PromptTemplate,
} from "../types";

export function useCreatePromptTemplate() {
  const { mutateAsync, status, error } = useApiClient().useMutation<
    PromptTemplate,
    CreatePromptTemplateRequest
  >("post", "/prompt-templates");

  return { createTemplate: mutateAsync, status, error };
}

export function useUpdatePromptTemplate() {
  const { mutateAsync, status, error } = useApiClient().useMutation<
    PromptTemplate,
    UpdatePromptTemplateRequest
  >("put", "/prompt-templates");

  function updateTemplate(id: string, template: UpdatePromptTemplateRequest) {
    return mutateAsync(template, `/prompt-templates/id/${id}`);
  }

  return { updateTemplate, status, error };
}

export function useDeletePromptTemplate() {
  const { mutateAsync, status, error } = useApiClient().useMutation<{}, {}>(
    "delete",
    "/prompt-templates"
  );

  function deleteTemplate(id: string) {
    return mutateAsync({}, `/prompt-templates/id/${id}`);
  }

  return { deleteTemplate, status, error };
}
