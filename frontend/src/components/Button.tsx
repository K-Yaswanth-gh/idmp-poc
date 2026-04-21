import React, { ReactNode, ButtonHTMLAttributes } from "react";
import { Link, LinkProps } from "react-router-dom";

// ボタンのバリエーション
export type ButtonVariant = "primary" | "secondary" | "danger" | "text";

// ボタンのサイズ
export type ButtonSize = "sm" | "md" | "lg";

// 共通のプロパティ
export interface BaseButtonProps {
  variant?: ButtonVariant;
  outline?: boolean;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  className?: string;
}

// 通常のボタンのプロパティ
export interface ButtonProps extends BaseButtonProps {
  children: ReactNode;
  to?: never;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  [key: string]: any;
}

// リンクボタンのプロパティ
export interface LinkButtonProps extends BaseButtonProps {
  children: ReactNode;
  to: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  [key: string]: any;
}

// プロパティの型を判定
export type CombinedButtonProps = ButtonProps | LinkButtonProps;

// リンクかどうかを判定する関数
const isLinkButton = (props: CombinedButtonProps): props is LinkButtonProps => {
  return "to" in props && typeof props.to === "string";
};

/**
 * 共通のボタンコンポーネント
 *
 * @example
 * // 通常のボタン
 * <Button variant="primary" onClick={handleClick}>クリック</Button>
 *
 * // リンクボタン
 * <Button variant="primary" to="/path">リンク</Button>
 *
 * // アイコン付きボタン
 * <Button variant="primary" icon={<PlusIcon />}>新規作成</Button>
 */
export const Button = (props: CombinedButtonProps) => {
  const {
    variant = "primary",
    outline = false,
    size = "md",
    icon,
    iconPosition = "left",
    fullWidth = false,
    children,
    className = "",
    ...rest
  } = props;

  const getButtonStyle = () => {
    if (outline) {
      const hoverStyle = "hover:bg-light-gray hover:shadow-sm";

      switch (variant) {
        case "primary":
          return `bg-transparent border border-aws-sea-blue-light text-aws-sea-blue-light ${hoverStyle} dark:border-aws-sea-blue-dark dark:text-aws-font-color-dark`;
        case "secondary":
          return `bg-transparent border border-aws-aqua text-aws-aqua ${hoverStyle}`;
        case "danger":
          return `bg-transparent border border-red text-red ${hoverStyle}`;
        case "text":
        default:
          return `bg-transparent border border-gray-400 text-gray-600 ${hoverStyle}`;
      }
    }

    switch (variant) {
      case "primary":
        return "bg-aws-sea-blue-light hover:bg-aws-sea-blue-hover-light dark:bg-aws-sea-blue-dark dark:hover:bg-aws-sea-blue-hover-dark text-aws-font-color-white-light";
      case "secondary":
        return "bg-aws-aqua hover:bg-aws-sea-blue-light text-aws-font-color-white-light";
      case "danger":
        return "bg-red hover:bg-red/90 text-aws-font-color-white-light";
      case "text":
        return "bg-transparent hover:bg-aws-paper-light text-aws-font-color-blue";
      default:
        return "bg-aws-sea-blue-light hover:bg-aws-sea-blue-hover-light text-aws-font-color-white-light";
    }
  };

  // サイズに応じたスタイルを定義
  const sizeStyles = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // 共通のスタイル
  const baseStyles =
    "rounded-md flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";

  // 幅のスタイル
  const widthStyle = fullWidth ? "w-full" : "";

  // 最終的なクラス名
  const buttonClasses = `${baseStyles} ${getButtonStyle()} ${sizeStyles[size]} ${widthStyle} ${className}`;

  // アイコンの配置
  const renderContent = () => {
    if (!icon) return children;

    return (
      <>
        {iconPosition === "left" && <span className="mr-1">{icon}</span>}
        {children}
        {iconPosition === "right" && <span className="ml-1">{icon}</span>}
      </>
    );
  };

  // リンクボタンかどうかで出力を分ける
  if (isLinkButton(props)) {
    const {
      to,
      icon,
      iconPosition,
      variant,
      outline,
      size,
      fullWidth,
      ...linkRest
    } = props;
    return (
      <Link to={to} className={buttonClasses} {...linkRest}>
        {renderContent()}
      </Link>
    );
  }

  // 不要なpropsをrestから除外
  const {
    icon: _,
    iconPosition: __,
    variant: ___,
    outline: ____,
    size: _____,
    fullWidth: ______,
    ...buttonRest
  } = rest;

  // TypeScriptが型を正しく理解できるようにする
  return (
    <button
      className={buttonClasses}
      {...(buttonRest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {renderContent()}
    </button>
  );
};

export default Button;
