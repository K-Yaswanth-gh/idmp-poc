import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HiCheck, HiX, HiExclamation, HiInformationCircle } from "react-icons/hi";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: (id: string) => void;
}

/**
 * トースト通知コンポーネント
 * フェードイン・フェードアウトアニメーションを備えた通知を表示します
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  duration = 1500,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { t } = useTranslation();

  // トーストのスタイル - 白背景に左側のカラーバー
  const toastStyles = {
    success: "bg-white text-aws-squid-ink-light border-l-4 border-aws-lab",
    error: "bg-white text-red border-l-4 border-red",
    warning: "bg-white text-yellow border-l-4 border-yellow",
    info: "bg-white text-aws-sea-blue-light border-l-4 border-aws-sea-blue-light",
  };

  // アイコンの色
  const iconColors = {
    success: "text-aws-lab",
    error: "text-red",
    warning: "text-yellow",
    info: "text-aws-sea-blue-light",
  };

  // アイコン
  const icons = {
    success: <HiCheck className="h-6 w-6" />,
    error: <HiX className="h-6 w-6" />,
    warning: <HiExclamation className="h-6 w-6" />,
    info: <HiInformationCircle className="h-6 w-6" />,
  };

  // マウント時にフェードイン
  useEffect(() => {
    setIsVisible(true);

    // 指定時間後に閉じる
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // 閉じる処理
  const handleClose = () => {
    setIsLeaving(true);
    // アニメーション完了後に実際に削除
    setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 300); // CSSアニメーションの時間と合わせる
  };

  return (
    <div
      className={`
        flex items-center p-3 mb-3 rounded-md shadow-md max-w-sm w-80
        transform transition-all duration-300 ease-in-out
        ${toastStyles[type]}
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
        ${isLeaving ? "translate-y-2 opacity-0" : ""}
      `}
      role="alert"
    >
      <div className={`mr-3 flex-shrink-0 ${iconColors[type]}`}>{icons[type]}</div>
      <div className="text-sm font-medium text-aws-squid-ink-light">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-light-gray/50 focus:outline-none"
        onClick={handleClose}
        aria-label={t('common.close')}
      >
        <HiX className="w-4 h-4 text-gray" />
      </button>
    </div>
  );
};

export default Toast;
