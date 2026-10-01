import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let cachedClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  try {
    cachedClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Intelligent pet care fallback advisor for when offline or no API key is provided
 */
export function generateFallbackPetCareAdvice(message: string, petContext?: any): string {
  const petName = petContext?.name || 'your pet';
  const petType = petContext?.animalType?.toLowerCase() || 'pet';
  const query = message.toLowerCase();

  if (
    query.includes('emergency') || 
    query.includes('poison') || 
    query.includes('vomit blood') || 
    query.includes('choking') || 
    query.includes('collapse') || 
    query.includes('seizure')
  ) {
    return `⚠️ URGENT CARE NOTICE for ${petName}:
If ${petName} is showing acute distress, persistent vomiting, difficulty breathing, sudden collapse, or suspected poisoning, please contact an emergency veterinary hospital immediately. Do not delay or attempt home remedies.

Emergency Protocol:
1. Keep ${petName} warm, quiet, and calm.
2. Transport carefully without restricting breathing.
3. Bring any packaging of suspected ingested toxins.`;
  }

  if (query.includes('feed') || query.includes('diet') || query.includes('food') || query.includes('eat')) {
    return `Nutrition guidance for ${petName} (${petContext?.breed || petType}, ${petContext?.weight ? petContext.weight + 'kg' : 'standard weight'}):

• Feeding Schedule: Consistent meal timings (e.g., morning and evening for adult ${petType}s) help regulate metabolism and digestion.
• Portioning: Base portions on life stage, target body condition score, and activity level (${petContext?.activityLevel || 'moderate'}). Avoid free-feeding dry kibble if managing weight.
• Safe Treats: Plain boiled chicken breast, pumpkin puree, fresh blueberries, and carrots in moderation (<10% of daily calories).
• Toxic Foods to Avoid: Chocolate, grapes/raisins, onions, garlic, xylitol/birch bark sweeteners, and cooked bones.

*Disclaimer: For exact caloric prescriptions, medical elimination diets, or allergies, consult your veterinarian.*`;
  }

  if (query.includes('water') || query.includes('hydrat')) {
    return `Hydration tips for ${petName}:
Fresh, cool water must always be accessible. On average, healthy pets require approximately 50–60 ml of water per kilogram of body weight each day.
• For cats and reluctant drinkers, try wide ceramic bowls or stainless steel pet water fountains, as moving water encourages hydration.
• Wet food significantly increases dietary moisture intake, especially beneficial for urinary and kidney health.`;
  }

  if (query.includes('summer') || query.includes('heat') || query.includes('hot')) {
    return `Summer care checklist for ${petName}:
• Heatstroke Prevention: Walk early in the morning or late evening. Asphalt can reach 55°C+ on sunny days and burn paw pads (test with the back of your hand for 7 seconds).
• Hydration: Keep fresh water in multiple shaded spots. Add pet-safe ice cubes or frozen broth treats.
• Ventilation: Never leave ${petName} in a parked vehicle, even for 2 minutes with cracked windows.`;
  }

  if (query.includes('monsoon') || query.includes('rain') || query.includes('wet')) {
    return `Monsoon & rainy season care for ${petName}:
• Paw Hygiene: Thoroughly dry paws and between paw pads after every walk to prevent interdigital dermatitis and fungal yeast infections.
• Ear Health: Moisture traps bacteria in floppy ears. Use a vet-approved drying ear cleanser weekly.
• Tick & Flea Prevention: Parasite activity surges in humid weather. Verify that topical or oral parasite protection is up to date.`;
  }

  if (query.includes('winter') || query.includes('cold')) {
    return `Winter wellness guidelines for ${petName}:
• Warm Bedding: Provide elevated beds away from cold drafts and floor tiles.
• Hydration: Pets drink less in cold weather; ensure water bowls are room temperature and not freezing cold.
• Outdoor Exposure: Shorten outdoor walks during extreme chill, and wipe salt/grit from paws immediately after returning indoors.`;
  }

  return `Hello! As PawCare AI, I'm here to support everyday wellness for ${petName} (${petContext?.breed || petType}, ${petContext?.age ? petContext.age + ' yrs' : ''}).

Here is helpful guidance regarding your query:
• Consistent daily routines for feeding, physical enrichment, and rest create a secure environment for ${petName}.
• Regular grooming and checking ears, eyes, teeth, and coat help catch subtle changes early.
• Always keep preventive vaccinations and parasite controls up to date with your local veterinary clinic.

Is there a specific detail regarding ${petName}'s routine, seasonal transition, or behavior you'd like to explore?

*Disclaimer: PawCare AI provides general pet-care education and is not a substitute for professional clinical veterinary diagnosis or treatment.*`;
}

export function generateFallbackPhotoObservation(petContext?: any): string {
  const petName = petContext?.name || 'your pet';
  return `Visual Observation Note for ${petName}:
• Visible Traits: The pet exhibits an attentive posture, bright expressive eyes, and a well-kept coat appearance.
• Demeanor: Appears calm and engaged with the surroundings.

*Important Veterinary Notice: I can describe what is visible in this photo, but an image alone cannot reliably diagnose a medical condition. Please schedule a physical visit with your veterinarian for clinical evaluations.*`;
}

export async function processChatRequest(message: string, petContext?: any): Promise<{ reply: string; source: string }> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
      reply: generateFallbackPetCareAdvice(message, petContext),
      source: 'fallback_advisor',
    };
  }

  const systemInstruction = `You are PawCare AI, an empathetic, highly knowledgeable pet care assistant.
Current pet context:
- Name: ${petContext?.name || 'Pet'}
- Species: ${petContext?.animalType || 'Dog'}
- Breed: ${petContext?.breed || 'Unknown'}
- Age: ${petContext?.age || 'Adult'}
- Weight: ${petContext?.weight ? petContext.weight + ' kg' : 'Unknown'}
- Activity Level: ${petContext?.activityLevel || 'Moderate'}
- Allergies: ${petContext?.allergies || 'None recorded'}
- Dietary Restrictions: ${petContext?.dietaryRestrictions || 'None'}
- Indoor/Outdoor: ${petContext?.indoorOutdoor || 'Indoor'}

Core Guidelines:
1. Personalize answers directly using the pet profile context (${petContext?.name || 'the pet'}).
2. Provide concise, warm, actionable everyday care tips.
3. Clearly distinguish general informational guidance from clinical veterinary advice.
4. SAFETY MANDATE: Never diagnose diseases, never prescribe drugs, and never provide medication dosages.
5. If the user mentions potential medical emergencies (e.g. poisoning, bloat, seizures, bleeding, breathing difficulty, severe trauma), immediately advise contacting an emergency veterinarian or animal hospital.
6. Include the short disclaimer at the bottom: "PawCare AI provides general pet-care information and is not a substitute for professional veterinary care."`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return {
      reply: response.text || generateFallbackPetCareAdvice(message, petContext),
      source: 'gemini-2.5-flash',
    };
  } catch (err: any) {
    console.error('Gemini chat execution error:', err?.message || err);
    return {
      reply: generateFallbackPetCareAdvice(message, petContext),
      source: 'fallback_advisor',
    };
  }
}

export async function processPhotoObserveRequest(
  imageBase64: string,
  mimeType?: string,
  petContext?: any,
  prompt?: string
): Promise<{ observation: string; source: string }> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
      observation: generateFallbackPhotoObservation(petContext),
      source: 'fallback_vision',
    };
  }

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+]+;base64,/, '');
  const userPrompt = prompt || `Describe the visible visual features (breed characteristics, coat condition, posture, and general expression) for ${petContext?.name || 'this pet'}.
Remember the strict safety rule: do NOT attempt to diagnose any disease, skin condition, or illness. Clearly advise that photos cannot substitute for a physical veterinary exam.`;

  const systemInstruction = `You are the PawCare AI visual observation assistant.
Analyze the pet photo strictly for non-diagnostic visual description (such as coat appearance, color markings, ear posture, alertness, and demeanor).
Mandatory rules:
1. Always state clearly: "I can describe what is visible in this photo, but an image alone cannot reliably diagnose a medical condition."
2. NEVER diagnose skin infections, lesions, tumors, parasites, or eye diseases.
3. Keep the tone warm, observant, and reassuring.
4. Recommend consulting a licensed veterinarian for health evaluations.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType || 'image/jpeg',
            },
          },
          { text: userPrompt },
        ],
      },
      config: {
        systemInstruction,
      },
    });

    return {
      observation: response.text || generateFallbackPhotoObservation(petContext),
      source: 'gemini-2.5-flash',
    };
  } catch (err: any) {
    console.error('Photo observe execution error:', err?.message || err);
    return {
      observation: generateFallbackPhotoObservation(petContext),
      source: 'fallback_vision',
    };
  }
}
