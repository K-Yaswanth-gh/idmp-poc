/**
 * アプリケーションのバージョン情報を取得する
 * @returns バージョン文字列、環境変数が設定されていない場合は'unknown ver'
 */
export const getVersion = (): string => {
  return import.meta.env.VITE_APP_VERSION || "unknown ver";
};
