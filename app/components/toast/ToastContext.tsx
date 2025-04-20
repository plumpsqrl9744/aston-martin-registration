"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: number) => void;
};

// 디바운스 시간 (밀리초 단위) - 3초
const TOAST_COOLDOWN = 3000;

interface LastToastInfo {
  message: string;
  type: ToastType;
  timestamp: number;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const lastToastRef = useRef<LastToastInfo | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    const now = Date.now();

    // 이전 토스트와 동일한 메시지/타입이고, 쿨다운 시간이 지나지 않았다면 무시
    if (
      lastToastRef.current &&
      lastToastRef.current.message === message &&
      lastToastRef.current.type === type &&
      now - lastToastRef.current.timestamp < TOAST_COOLDOWN
    ) {
      // 쿨다운 중이므로 중복 토스트 표시하지 않음
      return;
    }

    // 새 토스트 정보 저장
    lastToastRef.current = {
      message,
      type,
      timestamp: now,
    };

    // 새 토스트 추가
    const id = now;
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3초 후에 자동으로 제거
    setTimeout(() => {
      hideToast(id);
    }, 3000);
  };

  const hideToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = {
    toasts,
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
};
