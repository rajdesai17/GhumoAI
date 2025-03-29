export function getGoogleMapsDirectionsUrl(destination: [number, number], destinationName: string): string {
  // Encode the destination name for the URL
  const encodedDestination = encodeURIComponent(destinationName);
  
  // Create the Google Maps directions URL
  // origin=current+location will prompt Google Maps to use the user's current location
  return `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${destination[0]},${destination[1]}&destination_name=${encodedDestination}&travelmode=driving`;
}

export function openGoogleMapsDirections(destination: [number, number], destinationName: string) {
  const url = getGoogleMapsDirectionsUrl(destination, destinationName);
  window.open(url, '_blank');
} 