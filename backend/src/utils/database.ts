import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { isLocalDevelopment } from "../api/core/utils/stage-aware-auth";

export async function getDatabaseUrl(): Promise<string> {
  if (isLocalDevelopment()) {
    return process.env.DATABASE_URL!;
  }

  const secretsManager = new SecretsManagerClient({});
  const secretValue = await secretsManager.send(
    new GetSecretValueCommand({
      SecretId: process.env.DATABASE_SECRET_ARN!,
    })
  );

  const {
    engine,
    username: user,
    password,
    host,
    port,
    dbname: name,
  } = JSON.parse(secretValue.SecretString!);

  return `${engine}://${user}:${password}@${host}:${port}/${name}${
    process.env.DATABASE_OPTION || ""
  }`;
}
