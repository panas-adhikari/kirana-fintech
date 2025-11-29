import './Card.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({ children, className = '', padding = 'md' }: CardProps) {
    const classes = `card card-padding-${padding} ${className}`.trim();

    return (
        <div className={classes}>
            {children}
        </div>
    );
}
