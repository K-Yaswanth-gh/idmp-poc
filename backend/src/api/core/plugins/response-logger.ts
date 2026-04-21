import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

interface ResponseLoggerOptions {
  logLevel?: string;
}

const responseLogger: FastifyPluginAsync<ResponseLoggerOptions> = async (
  fastify,
  options
) => {
  const logLevel = options.logLevel || "info";

  fastify.addHook("onSend", async (request, reply, payload) => {
    // payloadがBufferまたは文字列の場合のサイズ計算
    let size = 0;
    if (payload) {
      if (Buffer.isBuffer(payload)) {
        size = payload.length;
      } else if (typeof payload === "string") {
        size = Buffer.byteLength(payload);
      }
    }

    // MBに変換
    const sizeInMB = size / (1024 * 1024);

    // リクエスト情報とレスポンスサイズをログ出力
    // NOTE: API Gatewayのレスポンスサイズは6MBまで
    const logData = {
      url: request.url,
      method: request.method,
      statusCode: reply.statusCode,
      responseSize: {
        bytes: size,
        megabytes: sizeInMB.toFixed(4),
      },
      responseTime: reply.elapsedTime,
    };

    // 型安全にログレベルを指定
    if (logLevel === "info") {
      request.log.info(logData, "response completed");
    } else if (logLevel === "debug") {
      request.log.debug(logData, "response completed");
    } else if (logLevel === "warn") {
      request.log.warn(logData, "response completed");
    } else if (logLevel === "error") {
      request.log.error(logData, "response completed");
    } else {
      request.log.info(logData, "response completed");
    }

    return payload;
  });
};

export default fp(responseLogger, {
  name: "response-logger",
  fastify: "5.x",
});
