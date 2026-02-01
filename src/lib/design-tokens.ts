/**
 * Design System Tokens
 * Consultant-Controlled Governance Workspace
 */

// Typography Scale
export const typography = {
    heading: {
        h1: {
            size: '32px',
            lineHeight: '40px',
            weight: '900',
            letterSpacing: '-0.02em',
        },
        h2: {
            size: '24px',
            lineHeight: '32px',
            weight: '800',
            letterSpacing: '-0.01em',
        },
        h3: {
            size: '18px',
            lineHeight: '28px',
            weight: '700',
            letterSpacing: '0',
        },
        h4: {
            size: '16px',
            lineHeight: '24px',
            weight: '700',
            letterSpacing: '0',
        },
        h5: {
            size: '14px',
            lineHeight: '20px',
            weight: '700',
            letterSpacing: '0.01em',
        },
    },
    body: {
        large: {
            size: '16px',
            lineHeight: '28px',
            weight: '400',
        },
        default: {
            size: '14px',
            lineHeight: '24px',
            weight: '400',
        },
        small: {
            size: '13px',
            lineHeight: '20px',
            weight: '400',
        },
    },
    functional: {
        caption: {
            size: '12px',
            lineHeight: '16px',
            weight: '500',
        },
        metadata: {
            size: '11px',
            lineHeight: '16px',
            weight: '600',
            letterSpacing: '0.05em',
            transform: 'uppercase' as const,
        },
    },
} as const;

// Spacing System (4px base grid)
export const spacing = {
    micro: {
        xs: '4px',
        sm: '8px',
        md: '12px',
    },
    component: {
        sm: '16px',
        md: '24px',
        lg: '32px',
    },
    section: {
        sm: '48px',
        md: '64px',
        lg: '80px',
    },
    page: {
        mobile: '16px',
        tablet: '24px',
        desktop: '48px',
    },
} as const;

// Color System
export const colors = {
    primary: {
        950: '#0a0f1a',
        900: '#0f172a',
        800: '#1e293b',
    },
    neutral: {
        700: '#334155',
        500: '#64748b',
        400: '#94a3b8',
        300: '#cbd5e1',
        200: '#e2e8f0',
        100: '#f1f5f9',
        50: '#f8fafc',
    },
    semantic: {
        blue: {
            600: '#2563eb',
            100: '#dbeafe',
            50: '#eff6ff',
        },
        amber: {
            600: '#d97706',
            100: '#fef3c7',
        },
        emerald: {
            600: '#059669',
            100: '#d1fae5',
        },
    },
    functional: {
        border: {
            default: '#e2e8f0',
            subtle: '#f1f5f9',
        },
        background: {
            elevated: '#ffffff',
            base: '#f8fafc',
        },
    },
} as const;

// Breakpoints
export const breakpoints = {
    mobile: '0px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1920px',
} as const;

// Layout Dimensions
export const layout = {
    sidebar: {
        desktop: '288px',
        tablet: '64px',
    },
    aiPanel: {
        desktop: '420px',
    },
    maxWidth: '1920px',
} as const;

// Shadow System
export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
} as const;

// Border Radius
export const borderRadius = {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
} as const;

// Z-Index Scale
export const zIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    overlay: 30,
    modal: 40,
    toast: 50,
} as const;
