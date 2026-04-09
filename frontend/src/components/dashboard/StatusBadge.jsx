import { cn, getStatusColor } from '../../utils/helpers.js';

const StatusBadge = ({ status }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize',
        getStatusColor(status),
      )}
    >
      {status || 'unknown'}
    </span>
  );
};

export default StatusBadge;
