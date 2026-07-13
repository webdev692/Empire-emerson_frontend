import { createContext, useContext } from "react";

export interface FormModalContextValue {
  openForm: (url: string, title?: string, subtitle?: string) => void;
}

export const FormModalContext = createContext<FormModalContextValue>({
  openForm: () => {},
});

export const useFormModal = () => useContext(FormModalContext);
