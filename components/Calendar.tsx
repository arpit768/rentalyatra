import { useState, ReactElement } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onDateSelect: (date: Date) => void;
  blockedDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

export default function Calendar({
  selectedStart,
  selectedEnd,
  onDateSelect,
  blockedDates = [],
  minDate = new Date(),
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateBlocked = (date: Date) => {
    return blockedDates.some(
      (blocked) =>
        blocked.getDate() === date.getDate() &&
        blocked.getMonth() === date.getMonth() &&
        blocked.getFullYear() === date.getFullYear()
    );
  };

  const isDateInRange = (date: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return date >= selectedStart && date <= selectedEnd;
  };

  const isDateSelected = (date: Date) => {
    const isSameAsStart =
      selectedStart &&
      date.getDate() === selectedStart.getDate() &&
      date.getMonth() === selectedStart.getMonth() &&
      date.getFullYear() === selectedStart.getFullYear();

    const isSameAsEnd =
      selectedEnd &&
      date.getDate() === selectedEnd.getDate() &&
      date.getMonth() === selectedEnd.getMonth() &&
      date.getFullYear() === selectedEnd.getFullYear();

    return isSameAsStart || isSameAsEnd;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (isDateBlocked(date)) return true;
    return false;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: ReactElement[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const disabled = isDateDisabled(date);
      const selected = isDateSelected(date);
      const inRange = isDateInRange(date);

      days.push(
        <button
          key={day}
          onClick={() => !disabled && onDateSelect(date)}
          disabled={disabled}
          className={`h-12 flex items-center justify-center rounded-lg font-medium transition-all ${
            disabled
              ? 'text-gray-300 cursor-not-allowed'
              : selected
              ? 'bg-blue-600 text-white'
              : inRange
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={previousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-600 rounded" />
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 rounded" />
          <span className="text-gray-600">In Range</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded" />
          <span className="text-gray-600">Blocked</span>
        </div>
      </div>
    </div>
  );
}

// Date Range Picker Component
interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  blockedDates?: Date[];
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  blockedDates,
}: DateRangePickerProps) {
  const [selectingEnd, setSelectingEnd] = useState(false);

  const handleDateSelect = (date: Date) => {
    if (!startDate || (startDate && endDate) || selectingEnd) {
      // Set end date
      if (startDate && date >= startDate) {
        onEndDateChange(date);
        setSelectingEnd(false);
      } else if (!startDate) {
        onStartDateChange(date);
      }
    } else {
      // Set start date
      onStartDateChange(date);
      setSelectingEnd(true);
    }
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diff = endDate.getTime() - startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-4">
      {/* Date Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
          <p className="text-lg font-semibold text-gray-900">
            {startDate ? startDate.toLocaleDateString() : 'Select date'}
          </p>
        </div>
        <div className="p-4 border border-gray-300 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
          <p className="text-lg font-semibold text-gray-900">
            {endDate ? endDate.toLocaleDateString() : 'Select date'}
          </p>
        </div>
      </div>

      {startDate && endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">{calculateNights()} night(s)</span> selected
          </p>
        </div>
      )}

      {/* Calendar */}
      <Calendar
        selectedStart={startDate}
        selectedEnd={endDate}
        onDateSelect={handleDateSelect}
        blockedDates={blockedDates}
      />
    </div>
  );
}
