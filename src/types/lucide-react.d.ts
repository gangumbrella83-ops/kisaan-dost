declare module 'lucide-react' {
    import { FC, SVGProps } from 'react';
    export interface IconProps extends SVGProps<SVGSVGElement> {
        size?: string | number;
        strokeWidth?: string | number;
    }
    export type Icon = FC<IconProps>;
    
    // Add any specific icons you're using as named exports
    // For example:
    export const Activity: Icon;
    export const Alert: Icon;
    export const AlertCircle: Icon;
    // ... add other icons as needed
}