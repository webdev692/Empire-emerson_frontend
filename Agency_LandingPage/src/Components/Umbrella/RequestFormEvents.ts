export const OPEN_REQUEST_FORM_EVENT = 'open-request-form'

export function openRequestForm() {
  window.dispatchEvent(new CustomEvent(OPEN_REQUEST_FORM_EVENT))
}
