import React, { useState } from "react";
import AlertModal, { AlertType } from "../components/AlertModal";

interface AlertConfig {
  title?: string;
  message: string;
  type?: AlertType;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface AlertOptions {
  title?: string;
  confirmButtonText?: string;
}

interface ConfirmOptions extends AlertOptions {
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface UseAlertReturn {
  AlertModal: React.FC;
  showAlert: (message: string, options?: AlertOptions) => void;
  showSuccess: (message: string, options?: AlertOptions) => void;
  showError: (message: string, options?: AlertOptions) => void;
  showWarning: (message: string, options?: AlertOptions) => void;
  showConfirm: (message: string, options: ConfirmOptions) => void;
}

/**
 * アラート表示のためのカスタムフック
 * モーダルベースのアラートダイアログを表示する機能を提供します
 */
export function useAlert(): UseAlertReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    message: "",
  });

  // モーダルを閉じる
  const closeAlert = () => {
    setIsOpen(false);
  };

  // 基本的なアラート表示
  const showAlert = (message: string, options: AlertOptions = {}) => {
    setConfig({
      title: options.title,
      message,
      type: "info",
      confirmButtonText: options.confirmButtonText,
    });
    setIsOpen(true);
  };

  // 成功アラート表示
  const showSuccess = (message: string, options: AlertOptions = {}) => {
    setConfig({
      title: options.title,
      message,
      type: "success",
      confirmButtonText: options.confirmButtonText,
    });
    setIsOpen(true);
  };

  // エラーアラート表示
  const showError = (message: string, options: AlertOptions = {}) => {
    setConfig({
      title: options.title,
      message,
      type: "error",
      confirmButtonText: options.confirmButtonText,
    });
    setIsOpen(true);
  };

  // 警告アラート表示
  const showWarning = (message: string, options: AlertOptions = {}) => {
    setConfig({
      title: options.title,
      message,
      type: "warning",
      confirmButtonText: options.confirmButtonText,
    });
    setIsOpen(true);
  };

  // 確認ダイアログ表示
  const showConfirm = (message: string, options: ConfirmOptions) => {
    setConfig({
      title: options.title,
      message,
      type: "confirm",
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      onConfirm: options.onConfirm,
      onCancel: options.onCancel || closeAlert,
    });
    setIsOpen(true);
  };

  // JSXを使わずにReact要素を作成する関数コンポーネント
  const AlertModalComponent: React.FC = () => {
    return React.createElement(AlertModal, {
      isOpen,
      onClose: closeAlert,
      title: config.title,
      message: config.message,
      type: config.type,
      confirmButtonText: config.confirmButtonText,
      cancelButtonText: config.cancelButtonText,
      onConfirm: config.onConfirm,
      onCancel: config.onCancel,
    });
  };

  return {
    AlertModal: AlertModalComponent,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
}
