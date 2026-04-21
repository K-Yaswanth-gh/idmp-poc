import { FastifyInstance } from "fastify";
import {
  getPromptTemplatesHandler,
  getPromptTemplateByIdHandler,
  createPromptTemplateHandler,
  updatePromptTemplateHandler,
  deletePromptTemplateHandler,
} from "./handlers";

export function registerPromptTemplateRoutes(fastify: FastifyInstance): void {
  fastify.get("/prompt-templates/:type", {
    handler: getPromptTemplatesHandler,
  });

  fastify.get("/prompt-templates/id/:id", {
    handler: getPromptTemplateByIdHandler,
  });

  fastify.post("/prompt-templates", {
    handler: createPromptTemplateHandler,
  });

  fastify.put("/prompt-templates/id/:id", {
    handler: updatePromptTemplateHandler,
  });

  fastify.delete("/prompt-templates/id/:id", {
    handler: deletePromptTemplateHandler,
  });
}
