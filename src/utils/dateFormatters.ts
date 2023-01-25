export function formatDate(date: string, locale?: string) {
    const dateString = new Date(date).toLocaleDateString(locale ?? 'nb-NO', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
    })

    return (
        dateString.charAt(0).toUpperCase() + // Capitalise weekday
        dateString.slice(1, dateString.length - 1) // Remove trailing dot "."
    )
}

export function formatTime(date: string, locale?: string) {
    return new Date(date).toLocaleTimeString(locale ?? 'nb-NO', {
        hour: '2-digit',
        minute: '2-digit',
    })
}
