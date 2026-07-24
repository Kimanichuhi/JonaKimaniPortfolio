import { useInView } from '../hooks/useAnimations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const { ref, isInView } = useInView(0.1);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease-out ${delay}s, transform 0.5s ease-out ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}
