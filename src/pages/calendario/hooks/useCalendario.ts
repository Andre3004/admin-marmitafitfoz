import { useEffect, useCallback } from 'react';
import { useCalendarioStore } from '../store/useCalendarioStore';
import type { CalendarDay } from '../types/calendario';

export const useCalendario = () => {
  const {
    calendarData,
    isLoading,
    error,
    fetchCalendarData,
    moveToNextStatus,
    moveToPreviousStatus,
    markAsPaid,
    markAsPartiallyPaid,
    clearError,
  } = useCalendarioStore();

  useEffect(() => {
    fetchCalendarData();
  }, [fetchCalendarData]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getDayData = useCallback((date: Date | null): CalendarDay | null => {
    if (!date) {
      return null;
    }
    return (
      calendarData.find(
        day => day.date.toDateString() === date.toDateString()
      ) || null
    );
  }, [calendarData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return 'bg-green-100 text-green-800';
      case 'PRONTO':
        return 'bg-blue-100 text-blue-800';
      case 'EM_PREPARO':
        return 'bg-orange-100 text-orange-800';
      case 'NA_FILA':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ENTREGUE':
        return 'Entregue';
      case 'PRONTO':
        return 'Pronto';
      case 'EM_PREPARO':
        return 'Em Preparo';
      case 'NA_FILA':
        return 'Na Fila';
      default:
        return status;
    }
  };

  const canMoveToPrevious = (status: string) => {
    const statusOrder = ['NA_FILA', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    return statusOrder.indexOf(status) > 0;
  };

  const canMoveToNext = (status: string) => {
    const statusOrder = ['NA_FILA', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    return statusOrder.indexOf(status) < statusOrder.length - 1;
  };

  const getNextPaymentStatus = (currentStatus: 'SIM' | 'NAO' | 'METADE') => {
    const paymentOrder: Array<'NAO' | 'METADE' | 'SIM'> = [
      'NAO',
      'METADE',
      'SIM',
    ];
    const currentIndex = paymentOrder.indexOf(currentStatus);
    return currentIndex < paymentOrder.length - 1
      ? paymentOrder[currentIndex + 1]
      : null;
  };

  const getPaymentButtonText = (currentStatus: 'SIM' | 'NAO' | 'METADE') => {
    const nextStatus = getNextPaymentStatus(currentStatus);
    switch (nextStatus) {
      case 'METADE':
        return 'Parcial';
      case 'SIM':
        return 'Pago';
      default:
        return null;
    }
  };

  const refetch = () => {
    fetchCalendarData();
  };

  return {
    calendarData,
    isLoading,
    error,
    getDaysInMonth,
    getDayData,
    formatCurrency,
    getStatusColor,
    getStatusLabel,
    canMoveToPrevious,
    canMoveToNext,
    getPaymentButtonText,
    moveToNextStatus,
    moveToPreviousStatus,
    markAsPaid,
    markAsPartiallyPaid,
    clearError,
    refetch,
  };
};
