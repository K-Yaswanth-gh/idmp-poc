import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { HiTranslate } from 'react-icons/hi';

const LanguageSwitcher: React.FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLang = language === 'ja' ? 'en' : 'ja';
    changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center w-full px-4 py-2 text-sm rounded-md hover:bg-aws-sea-blue-hover-light transition-colors"
    >
      <HiTranslate className="h-4 w-4 mr-2" />
      {language === 'ja' ? t('language.en') : t('language.ja')}
    </button>
  );
};

export default LanguageSwitcher;
