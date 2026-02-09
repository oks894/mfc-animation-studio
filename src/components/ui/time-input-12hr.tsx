import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeInput12hrProps {
  value: string; // 24hr format "HH:mm"
  onChange: (value: string) => void;
  id?: string;
}

// Convert 24hr to 12hr format
const to12Hour = (time24: string): { hour: string; minute: string; period: 'AM' | 'PM' } => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return {
    hour: hour12.toString().padStart(2, '0'),
    minute: (minutes || 0).toString().padStart(2, '0'),
    period,
  };
};

// Convert 12hr to 24hr format
const to24Hour = (hour: string, minute: string, period: 'AM' | 'PM'): string => {
  let hours = parseInt(hour);
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

export const TimeInput12hr: React.FC<TimeInput12hrProps> = ({ value, onChange, id }) => {
  const { hour, minute, period } = to12Hour(value || '09:00');

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let h = parseInt(e.target.value) || 1;
    if (h > 12) h = 12;
    if (h < 1) h = 1;
    onChange(to24Hour(h.toString(), minute, period));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let m = parseInt(e.target.value) || 0;
    if (m > 59) m = 59;
    if (m < 0) m = 0;
    onChange(to24Hour(hour, m.toString().padStart(2, '0'), period));
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    onChange(to24Hour(hour, minute, newPeriod));
  };

  return (
    <div className="flex items-center gap-1" id={id}>
      <Input
        type="number"
        min={1}
        max={12}
        value={parseInt(hour)}
        onChange={handleHourChange}
        className="w-16 text-center"
      />
      <span className="text-muted-foreground">:</span>
      <Input
        type="number"
        min={0}
        max={59}
        value={parseInt(minute)}
        onChange={handleMinuteChange}
        className="w-16 text-center"
      />
      <Select value={period} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeInput12hr;
