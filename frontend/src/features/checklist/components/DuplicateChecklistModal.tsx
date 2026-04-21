import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";

interface DuplicateChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, description: string) => Promise<void>;
  initialName: string;
  initialDescription: string;
  isLoading: boolean;
}

/**
 * チェックリスト複製用モーダルコンポーネント
 */
export default function DuplicateChecklistModal({
  isOpen,
  onClose,
  onConfirm,
  initialName,
  initialDescription,
  isLoading,
}: DuplicateChecklistModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  const handleConfirm = async () => {
    await onConfirm(name, description);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("checklist.duplicateTitle")}
      size="md">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-medium text-aws-squid-ink-light">
            {t("checklist.name")} <span className="text-red">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-light-gray px-4 py-2 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light"
            placeholder={t("checklist.namePlaceholder")}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block font-medium text-aws-squid-ink-light">
            {t("checklist.description")}
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-light-gray px-4 py-2 focus:outline-none focus:ring-2 focus:ring-aws-sea-blue-light"
            placeholder={t("checklist.descriptionPlaceholder")}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <Button outline onClick={onClose} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || !name.trim()}>
            {isLoading ? t("common.processing") : t("common.duplicate")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
