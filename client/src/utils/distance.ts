/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param coords1 [longitude, latitude]
 * @param coords2 [longitude, latitude]
 * @returns Distance in kilometers
 */
export const calculateDistance = (coords1: [number, number], coords2: [number, number]): number => {
    const [lon1, lat1] = coords1
    const [lon2, lat2] = coords2

    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    return distance
}

/**
 * Convert degrees to radians
 * @param deg Degrees
 * @returns Radians
 */
const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
}

/**
 * Filter users within a specific radius
 * @param users Array of users with location
 * @param centerCoords Center coordinates [longitude, latitude]
 * @param radiusKm Radius in kilometers
 * @returns Filtered users within the radius
 */
export const filterUsersWithinRadius = <T extends { location: { coordinates: [number, number] } }>(
    users: T[],
    centerCoords: [number, number],
    radiusKm = 10,
): T[] => {
    return users.filter((user) => {
        const distance = calculateDistance(centerCoords, user.location.coordinates)
        return distance <= radiusKm
    })
}
