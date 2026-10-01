/**
 * PawCare WhatsApp Appointment Booking Utilities
 * 
 * Future-ready architecture:
 * To replace the demo veterinarian WhatsApp number with an actual clinic's official WhatsApp Business number:
 * 1. Update the `whatsAppPhone` field in `src/data/mockData.ts` with the clinic's international number
 *    (e.g., '919876543210' - country code followed by digits without '+' or dashes).
 * 2. When integrating with WhatsApp Business API / Cloud API later, use `createWhatsAppAppointmentMessage`
 *    as the payload generator for the outbound webhook or template message.
 */

export interface WhatsAppAppointmentData {
  vetName: string;
  clinic: string;
  phone: string;
  petName: string;
  petBreed?: string;
  petAge?: string | number;
  petSpecies?: string;
  date: string;
  time: string;
  reason: string;
  additionalInfo?: string;
  consultationType?: string;
  consultationFee?: number;
  currency?: string;
  userName?: string;
}

/**
 * Creates the formatted, professional pre-filled WhatsApp appointment request text.
 */
export function createWhatsAppAppointmentMessage(data: WhatsAppAppointmentData): string {
  const additionalText = data.additionalInfo && data.additionalInfo.trim()
    ? data.additionalInfo.trim()
    : 'No additional information provided.';

  const petAgeStr = data.petAge !== undefined && data.petAge !== null
    ? (typeof data.petAge === 'number' ? `${data.petAge} years` : `${data.petAge}`)
    : '2 years';

  const speciesEmoji = data.petSpecies?.toLowerCase() === 'cat'
    ? '🐱'
    : data.petSpecies?.toLowerCase() === 'rabbit'
    ? '🐰'
    : data.petSpecies?.toLowerCase() === 'bird'
    ? '🦜'
    : '🐶';

  return `🐾 PAWCARE APPOINTMENT REQUEST

Hello ${data.vetName},

I would like to request a veterinary appointment through PawCare.

Pet Details:
${speciesEmoji} Name: ${data.petName}
Breed: ${data.petBreed || 'Companion'}
Age: ${petAgeStr}

Appointment:
📅 Date: ${data.date}
🕐 Time: ${data.time}

Reason:
${data.reason}

Additional information:
${additionalText}

Clinic:
${data.clinic}

Please confirm the appointment and let me know if the selected time is available.

Thank you,
${data.userName || 'PawCare User'}`;
}

/**
 * Generates the WhatsApp click-to-chat URL with properly encoded message parameters.
 * Format: https://wa.me/<country_code><number>?text=<encoded_text>
 */
export function generateWhatsAppBookingUrl(phone: string, message: string): string {
  // Strip non-digit characters (+, spaces, hyphens)
  let cleanPhone = phone.replace(/[^0-9]/g, '');
  // If a 10-digit mobile number is provided (e.g. 9503066958), prepend country code 91 for WhatsApp wa.me
  if (cleanPhone.length === 10) {
    cleanPhone = `91${cleanPhone}`;
  }
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

/**
 * Opens WhatsApp in a new browser tab/app safely with fallback handling.
 */
export function openWhatsAppChat(phone: string, message: string): string {
  const url = generateWhatsAppBookingUrl(phone, message);
  try {
    // Attempt standard new window open
    window.open(url, '_blank', 'noopener,noreferrer');
  } catch (err) {
    console.warn('Direct window.open blocked by environment, fallback to link navigation', err);
  }
  return url;
}
