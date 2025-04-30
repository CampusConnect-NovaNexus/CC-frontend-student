import React from 'react';
import { Text } from 'react-native';

interface TimeAgoProps {
  date: string | Date;
  className?: string;
  style?: any;
}

const TimeAgo: React.FC<TimeAgoProps> = ({ date, className, style }) => {
  const getTimeAgo = (dateString: string | Date): string => {
    if (!dateString || !(typeof dateString === 'string' || dateString instanceof Date)) {
      console.error("Invalid date provided")
    }
    // Convert input to Date object if it's a string
    const utcDate = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (!(utcDate instanceof Date && !isNaN(utcDate.valueOf()))) {
      return "Invalid date";
    }

    // Convert UTC to Indian Standard Time (+5:30)
    const indianTimeOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours and 30 minutes in milliseconds
    const indianDate = new Date(utcDate.getTime() + indianTimeOffsetMs);
    
    const now = new Date();
    // current time is already in IST no convert needed
    const indianNow = new Date(now.getTime());
    
    // Check if the date is today in IST
    const isToday = 
      indianDate.getDate() === indianNow.getDate() &&
      indianDate.getMonth() === indianNow.getMonth() &&
      indianDate.getFullYear() === indianNow.getFullYear();

    if (isToday) {
      const diffMs = indianNow.getTime() - indianDate.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHrs = Math.floor(diffMin / 60);

      if (diffSec < 60) return 'just now';
      if (diffMin < 60) return `${diffMin}m ago`;
      return `${diffHrs}h ago`;
    }

    // Check if the date is yesterday in IST
    const yesterday = new Date(indianNow);
    yesterday.setDate(indianNow.getDate() - 1);
    const isYesterday = 
      indianDate.getDate() === yesterday.getDate() &&
      indianDate.getMonth() === yesterday.getMonth() &&
      indianDate.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'yesterday';

    // For older dates
    const dateCopy = new Date(indianDate);
    dateCopy.setHours(0, 0, 0, 0);
    const nowCopy = new Date(indianNow);
    nowCopy.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((nowCopy.getTime() - dateCopy.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 7) return `${daysDiff}d ago`;
    
    // For dates older than a week, show the date in a readable format
    return indianDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Text className={className} style={style}>
      {getTimeAgo(date)}
    </Text>
  );
};

export default TimeAgo;