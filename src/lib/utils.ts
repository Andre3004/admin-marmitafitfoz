export type ClassValue =
    | string
    | number
    | boolean
    | undefined
    | null
    | { [key: string]: any }
    | ClassValue[]

export function cn(...inputs: ClassValue[]): string
{
    return inputs
        .filter(Boolean)
        .map(input =>
        {
            if (typeof input === 'string') return input
            if (typeof input === 'object' && input !== null && !Array.isArray(input))
            {
                return Object.entries(input)
                    .filter(([, value]) => Boolean(value))
                    .map(([key]) => key)
                    .join(' ')
            }
            if (Array.isArray(input))
            {
                return cn(...input)
            }
            return ''
        })
        .join(' ')
        .trim()
}