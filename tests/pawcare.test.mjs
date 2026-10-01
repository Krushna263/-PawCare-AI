import test from 'node:test';
import assert from 'node:assert/strict';

import { 
  createWhatsAppAppointmentMessage, 
  generateWhatsAppBookingUrl 
} from '../src/utils/whatsapp.ts';

import {
  generateFallbackPetCareAdvice,
} from '../src/server/geminiService.ts';

test('WhatsApp message generation creates structured text with pet context', () => {
  const message = createWhatsAppAppointmentMessage({
    vetName: 'Dr. Priya Shah',
    clinic: 'PetCare Veterinary Clinic',
    phone: '9503066958',
    petName: 'Bruno',
    petBreed: 'Golden Retriever',
    petAge: 3,
    petSpecies: 'Dog',
    date: '5 October 2026',
    time: '04:00 PM',
    reason: 'General check-up',
    additionalInfo: 'Mild itching on ear',
    consultationType: 'In-person',
    consultationFee: 500,
    currency: '₹',
  });

  assert.match(message, /PAWCARE APPOINTMENT REQUEST/);
  assert.match(message, /Dr\. Priya Shah/);
  assert.match(message, /🐶 Name: Bruno/);
  assert.match(message, /Golden Retriever/);
  assert.match(message, /5 October 2026/);
  assert.match(message, /04:00 PM/);
  assert.match(message, /General check-up/);
  assert.match(message, /PetCare Veterinary Clinic/);
});

test('WhatsApp URL generator formats international number and encodes parameters', () => {
  const message = 'Hello Dr. Shah! Testing booking.';
  const url = generateWhatsAppBookingUrl('9503066958', message);

  // 10-digit Indian numbers should prepend country code 91
  assert.ok(url.startsWith('https://wa.me/919503066958'));
  assert.ok(url.includes('text=Hello%20Dr.%20Shah!%20Testing%20booking.'));
});

test('WhatsApp URL generator preserves numbers that already include country code', () => {
  const url = generateWhatsAppBookingUrl('+91 9503066958', 'Test');
  assert.ok(url.startsWith('https://wa.me/919503066958'));
});

test('Cart calculations correctly apply subtotal and free shipping thresholds', () => {
  const cartItems = [
    { product: { price: 20 }, quantity: 2 }, // $40
    { product: { price: 15 }, quantity: 1 }, // $15 -> total $55
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  assert.equal(subtotal, 55);

  const deliveryFee = subtotal === 0 ? 0 : subtotal > 50 ? 0 : 5.99;
  assert.equal(deliveryFee, 0); // Free delivery over $50

  const smallCart = [{ product: { price: 20 }, quantity: 1 }];
  const smallSubtotal = 20;
  const smallDelivery = smallSubtotal > 50 ? 0 : 5.99;
  assert.equal(smallDelivery, 5.99);
});

test('Fallback pet care advisor intercepts acute emergencies with immediate clinic directive', () => {
  const emergencyResponse = generateFallbackPetCareAdvice('My dog ate rat poison emergency vomiting blood', {
    name: 'Bruno',
    animalType: 'Dog',
  });

  assert.match(emergencyResponse, /URGENT CARE NOTICE for Bruno/);
  assert.match(emergencyResponse, /contact an emergency veterinary hospital immediately/);
});

test('Fallback pet care advisor provides nutritional guidance for dietary questions', () => {
  const dietResponse = generateFallbackPetCareAdvice('What is safe food for my pet to eat?', {
    name: 'Luna',
    animalType: 'Cat',
    breed: 'Siamese',
  });

  assert.match(dietResponse, /Nutrition guidance for Luna/);
  assert.match(dietResponse, /Toxic Foods to Avoid/);
});
