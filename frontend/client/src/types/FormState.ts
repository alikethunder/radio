export type FormState = {
  state?: 'read' | 'edit' | 'saving';
  edit?: (() => void) | null;
  submit?: (() => void) | null;
  reset?: (() => void) | null
}