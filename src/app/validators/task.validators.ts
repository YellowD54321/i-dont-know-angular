import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * 自定義最小長度驗證器
 * 檢查輸入值長度是否至少為指定字數
 *
 * @param min 最小長度
 * @returns ValidatorFn
 */
export function minLengthValidator(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    // 如果沒有值，讓 required 驗證器處理
    if (!value) {
      return null;
    }

    const isValid = value.trim().length >= min;
    return isValid ? null : { customMinLength: { requiredLength: min, actualLength: value.trim().length } };
  };
}

/**
 * 禁止關鍵字驗證器
 * 檢查輸入值是否包含禁止的關鍵字
 *
 * 預設禁止詞：spam, test, 廣告
 */
export function forbiddenKeywordsValidator(): ValidatorFn {
  const forbiddenKeywords = ['spam', 'test', '廣告'];

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    if (!value) {
      return null;
    }

    const lowerValue = value.toLowerCase();
    const foundKeyword = forbiddenKeywords.find((keyword) => lowerValue.includes(keyword.toLowerCase()));

    return foundKeyword ? { forbiddenKeyword: { keyword: foundKeyword, value: control.value } } : null;
  };
}

/**
 * 必填內容驗證器
 * 專門用於子任務的 content 欄位，檢查內容不可為空
 */
export function requiredContentValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    const isEmpty = !value || value.trim().length === 0;
    return isEmpty ? { requiredContent: true } : null;
  };
}

