import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, LinkButtonProps } from '../../../components/Button';
import { HiPlus } from 'react-icons/hi';

/**
 * チェックリスト新規作成ボタンコンポーネント
 * 共通のButtonコンポーネントを継承し、チェックリスト新規作成用のスタイルと機能を提供します
 */
export interface CreateChecklistButtonProps extends Omit<LinkButtonProps, 'children'> {
  children?: React.ReactNode;
}

export const CreateChecklistButton: React.FC<CreateChecklistButtonProps> = ({
  variant = 'primary',
  size = 'md',
  to = '/checklist/new',
  children,
  ...rest
}) => {
  const { t } = useTranslation();
  
  return (
    <Button
      variant={variant}
      size={size}
      to={to}
      icon={<HiPlus className="h-5 w-5" />}
      iconPosition="left"
      {...rest}
    >
      {children || t('checklist.create')}
    </Button>
  );
};

export default CreateChecklistButton;
