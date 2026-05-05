'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
    checkIn: string;
    checkOut: string;
    onCheckInChange: (date: string) => void;
    onCheckOutChange: (date: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    checkIn,
    checkOut,
    onCheckInChange,
    onCheckOutChange
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectingCheckOut, setSelectingCheckOut] = useState(false);
    const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate calendar position when opened
    useEffect(() => {
        if (isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setCalendarPosition({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    }, [isOpen]);

    const formatDisplayDate = (dateStr: string) => {
        if (!dateStr) return 'Seleccionar';
        const date = new Date(dateStr);
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
        return new Intl.DateTimeFormat('es-GT', {
            day: 'numeric',
            month: 'short'
        }).format(adjustedDate);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days: (Date | null)[] = [];

        // Add empty slots for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        return days;
    };

    const handleDateClick = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0];

        if (!checkIn || selectingCheckOut) {
            if (!checkIn) {
                onCheckInChange(dateStr);
                setSelectingCheckOut(true);
            } else {
                if (new Date(dateStr) > new Date(checkIn)) {
                    onCheckOutChange(dateStr);
                    setIsOpen(false);
                    setSelectingCheckOut(false);
                } else {
                    // If selected date is before check-in, reset and start over
                    onCheckInChange(dateStr);
                    onCheckOutChange('');
                }
            }
        } else {
            // Reset selection
            onCheckInChange(dateStr);
            onCheckOutChange('');
            setSelectingCheckOut(true);
        }
    };

    const isDateInRange = (date: Date) => {
        if (!checkIn || !checkOut) return false;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        return date >= checkInDate && date <= checkOutDate;
    };

    const isDateDisabled = (date: Date) => {
        return date < today;
    };

    const isCheckInDate = (date: Date) => {
        if (!checkIn) return false;
        return date.toISOString().split('T')[0] === checkIn;
    };

    const isCheckOutDate = (date: Date) => {
        if (!checkOut) return false;
        return date.toISOString().split('T')[0] === checkOut;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const monthName = new Intl.DateTimeFormat('es-GT', { month: 'long', year: 'numeric' }).format(currentMonth);
    const days = getDaysInMonth(currentMonth);

    return (
        <div ref={containerRef} className="relative">
            {/* Date Display Buttons */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setSelectingCheckOut(false);
                    }}
                    className="group/input relative rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-left text-sm text-foreground transition-all hover:bg-muted"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground transition-colors group-hover/input:text-purple-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className={checkIn ? 'text-foreground' : 'text-muted-foreground'}>
                        {formatDisplayDate(checkIn)}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        if (checkIn) {
                            setIsOpen(!isOpen);
                            setSelectingCheckOut(true);
                        }
                    }}
                    disabled={!checkIn}
                    className="group/input relative rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-left text-sm text-foreground transition-all hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground transition-colors group-hover/input:text-purple-500">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className={checkOut ? 'text-foreground' : 'text-muted-foreground'}>
                        {formatDisplayDate(checkOut)}
                    </span>
                </button>
            </div>

            {/* Calendar Popover - Fixed Position */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => {
                            setIsOpen(false);
                            setSelectingCheckOut(false);
                        }}
                    />

                    {/* Calendar */}
                    <div
                        className="fixed z-[70] w-80 overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-2xl shadow-purple-500/10 animate-in fade-in slide-in-from-top-2 duration-200 dark:border-white/10 dark:shadow-purple-500/20"
                        style={{
                            top: `${calendarPosition.top}px`,
                            left: `${calendarPosition.left}px`,
                            maxHeight: 'calc(100vh - 100px)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                            >
                                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <h3 className="text-xs font-bold capitalize text-foreground">{monthName}</h3>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="rounded-lg p-1.5 transition-colors hover:bg-muted"
                            >
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1.5">
                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                                <div key={i} className="py-0.5 text-center text-[10px] font-bold text-muted-foreground">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, index) => {
                                if (!date) {
                                    return <div key={`empty-${index}`} className="aspect-square" />;
                                }

                                const disabled = isDateDisabled(date);
                                const inRange = isDateInRange(date);
                                const isCheckIn = isCheckInDate(date);
                                const isCheckOut = isCheckOutDate(date);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => !disabled && handleDateClick(date)}
                                        disabled={disabled}
                                        className={`
                                            aspect-square rounded-lg text-xs font-medium transition-all
                                            ${disabled ? 'text-muted-foreground/35 cursor-not-allowed' : 'text-foreground hover:bg-muted'}
                                            ${inRange && !isCheckIn && !isCheckOut ? 'bg-purple-500/20' : ''}
                                            ${isCheckIn || isCheckOut ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.5)]' : ''}
                                        `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer Hint */}
                        <div className="mt-3 border-t border-border pt-2 text-center text-[10px] text-muted-foreground">
                            {!checkIn && 'Selecciona fecha de entrada'}
                            {checkIn && !checkOut && 'Ahora selecciona fecha de salida'}
                            {checkIn && checkOut && 'Rango seleccionado ✓'}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DateRangePicker;
