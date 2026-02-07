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
                    className="relative group/input bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white hover:bg-white/10 transition-all text-left"
                >
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover/input:text-purple-400 transition-colors">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className={checkIn ? 'text-white' : 'text-gray-500'}>
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
                    className="relative group/input bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white hover:bg-white/10 transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-500 group-hover/input:text-purple-400 transition-colors">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <span className={checkOut ? 'text-white' : 'text-gray-500'}>
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
                        className="fixed z-[70] w-80 bg-gray-900 border border-white/10 rounded-xl p-3 shadow-2xl shadow-purple-500/20 animate-in fade-in slide-in-from-top-2 duration-200 overflow-y-auto"
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
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-400" />
                            </button>
                            <h3 className="text-xs font-bold text-white capitalize">{monthName}</h3>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1.5">
                            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                                <div key={i} className="text-center text-[10px] font-bold text-gray-500 py-0.5">
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
                                            ${disabled ? 'text-gray-700 cursor-not-allowed' : 'text-white hover:bg-white/10'}
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
                        <div className="mt-3 pt-2 border-t border-white/10 text-center text-[10px] text-gray-500">
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
