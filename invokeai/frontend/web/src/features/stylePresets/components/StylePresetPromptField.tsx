import { Flex, FormControl, FormLabel, IconButton, Textarea } from '@invoke-ai/ui-library';
import { PRESET_PLACEHOLDER } from 'features/stylePresets/hooks/usePresetModifiedPrompts';
import type { ChangeEventHandler } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import type { UseControllerProps } from 'react-hook-form';
import { useController } from 'react-hook-form';
import { PiBracketsCurlyBold } from 'react-icons/pi';

import type { StylePresetFormData } from './StylePresetForm';
import { useTranslation } from 'react-i18next';

interface Props extends UseControllerProps<StylePresetFormData> {
  label: string;
}

export const StylePresetPromptField = (props: Props) => {
  const { field } = useController(props);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const onChange = useCallback<ChangeEventHandler<HTMLTextAreaElement>>(
    (v) => {
      field.onChange(v.target.value);
    },
    [field]
  );

  const value = useMemo(() => {
    return field.value as string;
  }, [field.value]);

  const insertPromptPlaceholder = useCallback(() => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPos);
      const textAfterCursor = value.slice(cursorPos);
      const newValue = textBeforeCursor + PRESET_PLACEHOLDER + textAfterCursor;

      field.onChange(newValue);
    } else {
      field.onChange(value + PRESET_PLACEHOLDER);
    }
  }, [value, field, textareaRef]);

  const isPromptPresent = useMemo(() => value?.includes(PRESET_PLACEHOLDER), [value]);

  return (
    <FormControl orientation="vertical">
      <Flex alignItems="center" gap="1">
        <FormLabel>{props.label}</FormLabel>
        <IconButton
          onClick={insertPromptPlaceholder}
          size="sm"
          icon={<PiBracketsCurlyBold />}
          aria-label={t('stylePresets.insertPlaceholder')}
          isDisabled={isPromptPresent}
        />
      </Flex>

      <Textarea size="sm" ref={textareaRef} value={value} onChange={onChange} />
    </FormControl>
  );
};
