import { cn } from '../../utils/helpers.js';

const Panel = ({ className, children }) => {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/88 p-6 shadow-soft backdrop-blur xl:p-7',
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Panel;
