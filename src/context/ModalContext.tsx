import { createContext, useContext, useState, ReactNode } from "react";

// Keep your exact types so your logic doesn't break
export type ModalType =
  | "signin"
  | "about"
  | "installPwa"
  | "logout"
  | "postPopup"
  | "deleteConfirm"
  | "confirmPost"
  | "listen"
  | "joinTeam"
  | "followUs"
  | null;

interface ModalInstance {
  type: ModalType;
  payload: any;
}

interface ModalContextType {
  modalStack: ModalInstance[];
  activeModal: ModalType;
  modalPayload: any;
  openModal: (type: ModalType, payload?: any) => void;
  closeModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalStack, setModalStack] = useState<ModalInstance[]>([]);

  const openModal = (type: ModalType, payload: any = null) => {
    if (!type) return;
    setModalStack((prev) => [...prev, { type, payload }]);
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const closeAllModals = () => {
    setModalStack([]);
  };

  const topInstance = modalStack[modalStack.length - 1];
  const activeModal = topInstance?.type || null;
  const modalPayload = topInstance?.payload || null;

  return (
    <ModalContext.Provider
      value={{
        modalStack,
        activeModal,
        modalPayload,
        openModal,
        closeModal,
        closeAllModals,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
