import { useState, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import {
  MdCalendarToday,
  MdChevronLeft,
  MdChevronRight,
  MdRefresh,
  MdExpandMore,
  MdExpandLess,
  MdPayment,
} from 'react-icons/md';
import { useCalendario } from '../hooks/useCalendario';
import type { CalendarDay } from '../types/calendario';
import Loading from '../../shared/components/Loading';

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export default function CalendarioContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const selectedDayDateRef = useRef<Date | null>(null);

  const {
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
    refetch,
    calendarData,
  } = useCalendario();

  // Update selected day when calendar data changes
  useEffect(() => {
    if (selectedDayDateRef.current) {
      const updatedDayData = getDayData(selectedDayDateRef.current);
      setSelectedDay(updatedDayData);
    }
  }, [calendarData, getDayData]);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date | null) => {
    if (!date) {
      return;
    }
    selectedDayDateRef.current = date;
    const dayData = getDayData(date);
    setSelectedDay(dayData);
    setExpandedOrder(null);
  };

  const handlePaymentClick = (order: {
    id: string;
    paymentStatus: 'SIM' | 'NAO' | 'METADE';
  }) => {
    const nextStatus = getPaymentButtonText(order.paymentStatus);
    if (nextStatus === 'Parcial') {
      markAsPartiallyPaid(order.id);
    } else if (nextStatus === 'Pago') {
      markAsPaid(order.id);
    }
  };

  const days = getDaysInMonth(currentDate);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendário de Marmitas</h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <MdChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex min-w-[200px] items-center justify-center gap-2">
            <MdCalendarToday className="text-gray-500 h-4 w-4" />
            <span className="font-medium">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
          </div>

          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <MdChevronRight className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
          >
            {isLoading ? (
              <MdRefresh className="h-4 w-4 animate-spin" />
            ) : (
              <MdRefresh className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 grid grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(day => (
                  <div
                    key={day}
                    className="text-gray-500 p-2 text-center text-sm font-medium"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {days.map((date, _index) => {
                  const dayData = getDayData(date);
                  const isToday =
                    date && date.toDateString() === new Date().toDateString();
                  const hasOrders = (dayData?.totalOrders || 0) > 0;

                  return (
                    <div
                      key={date?.toISOString()}
                      className={`relative h-20 cursor-pointer rounded-md  border-gray-200 p-2 transition-colors ${
                        !date ? 'invisible' : ''
                      } ${
                        isToday
                          ? 'border-blue-200 bg-blue-50'
                          : 'hover:bg-gray-50'
                      } ${
                        hasOrders
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleDayClick(date)}
                    >
                      {date && (
                        <>
                          <div className="text-sm font-medium">
                            {date.getDate()}
                          </div>
                          {dayData?.totalOrders && (
                            <div className="mt-1">
                              <div className="text-xs font-medium text-green-700">
                                {dayData?.totalOrders || 0} marmita(s)
                              </div>
                              <div className="text-xs text-green-600">
                                {formatCurrency(dayData?.totalValue || 0)}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card key={selectedDay ? `${selectedDay.date.toISOString()}-${calendarData.length}` : 'no-selection'}>
            <CardHeader>
              <CardTitle>Detalhes do Dia</CardTitle>
              <CardDescription>
                {selectedDay
                  ? `${selectedDay.date.getDate()}/${selectedDay.date.getMonth() + 1}/${selectedDay.date.getFullYear()}`
                  : 'Selecione um dia no calendário'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDay ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                      Total de Pedidos:
                    </span>
                    <Badge variant="secondary">{selectedDay.totalOrders}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">Valor Total:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedDay.totalValue)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Pedidos:</h4>
                    {selectedDay.orders.map(order => (
                      <div
                        key={order.id}
                        className="space-y-2 rounded-md border border-gray-200 p-3"
                      >
                        <div
                          className="flex cursor-pointer items-start justify-between"
                          onClick={() =>
                            setExpandedOrder(
                              expandedOrder === order.id ? null : order.id
                            )
                          }
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {order.customer}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {order.quantity} marmita(s) -{' '}
                              {formatCurrency(order.value)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={getStatusColor(order.status)}
                              variant="secondary"
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              {expandedOrder === order.id ? (
                                <MdExpandLess />
                              ) : (
                                <MdExpandMore />
                              )}
                            </Button>
                          </div>
                        </div>

                        {expandedOrder === order.id && (
                          <div className="space-y-3 border-t pt-3">
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between">
                                <span>Pagamento:</span>
                                <span>{order.paymentMethod}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Status Pagamento:</span>
                                <span>
                                  {order.paymentStatus === 'SIM'
                                    ? 'Pago'
                                    : order.paymentStatus === 'METADE'
                                      ? 'Parcialmente Pago'
                                      : 'Não Pago'}
                                </span>
                              </div>
                            </div>

                            <div>
                              <p className="mb-2 text-xs font-medium">
                                Detalhes do Pedido:
                              </p>
                              <div className="text-gray-500 rounded bg-gray-50 p-2 text-xs whitespace-pre-wrap">
                                {order.pedido}
                              </div>
                            </div>

                            <div>
                              <p className="mb-1 text-xs font-medium">
                                Endereço:
                              </p>
                              <p className="text-gray-500 text-xs">
                                {order.address}
                              </p>
                            </div>

                            <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex justify-between gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={e => {
                                    e.stopPropagation();
                                    moveToPreviousStatus(order.id);
                                  }}
                                  disabled={
                                    !canMoveToPrevious(order.status) ||
                                    isLoading
                                  }
                                  className="flex items-center gap-1 text-xs"
                                >
                                  <MdChevronLeft size={16} />
                                  Anterior
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={e => {
                                    e.stopPropagation();
                                    moveToNextStatus(order.id);
                                  }}
                                  disabled={
                                    !canMoveToNext(order.status) || isLoading
                                  }
                                  className="flex items-center gap-1 text-xs"
                                >
                                  Próximo
                                  <MdChevronRight size={16} />
                                </Button>
                              </div>

                              {getPaymentButtonText(order.paymentStatus) && (
                                <div className="flex justify-center">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={e => {
                                      e.stopPropagation();
                                      handlePaymentClick(order);
                                    }}
                                    disabled={isLoading}
                                    className="flex items-center gap-1 text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  >
                                    <MdPayment size={16} />
                                    Marcar como{' '}
                                    {getPaymentButtonText(order.paymentStatus)}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Clique em um dia do calendário para ver os detalhes dos
                  pedidos.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
