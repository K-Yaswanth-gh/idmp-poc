/**
 * データベース接続管理
 */
import { PrismaClient } from "../../../prisma/client";
import { getDatabaseUrl } from "../../utils/database";
import { isLocalDevelopment } from "./utils/stage-aware-auth";

// Prisma Client の型をエクスポート
export * from "../../../prisma/client";

// PrismaClientのシングルトンインスタンス
let prismaClient: PrismaClient | null = null;

/**
 * PrismaClientを取得する
 * @returns PrismaClientインスタンス
 */
export async function getPrismaClient(): Promise<PrismaClient> {
  if (!prismaClient) {
    // 環境変数に設定（PrismaClientの初期化前に必要）
    process.env.DATABASE_URL = await getDatabaseUrl();

    prismaClient = new PrismaClient({
      log: isLocalDevelopment() ? ["query", "error", "warn"] : ["error"],
    });
  }
  return prismaClient;
}

/**
 * PrismaClientをリセットする（主にテスト用）
 */
export async function resetPrismaClient(): Promise<void> {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}
