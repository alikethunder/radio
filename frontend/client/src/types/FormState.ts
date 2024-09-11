export type FormState = {
  state?: 'read' | 'edit' | 'saving';
  edit?: (() => void);
  submit?: (() => void);
  reset?: (() => void);
  form?: HTMLFormElement;
}