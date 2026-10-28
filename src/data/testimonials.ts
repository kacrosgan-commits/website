export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Only verified quotes are rendered. */
  verified: boolean;
}

/**
 * Add a testimonial only after the quote, name, and permission to publish are confirmed.
 * An empty list hides the testimonial section.
 */
export const testimonials: Testimonial[] = [];

export const verifiedTestimonials = testimonials.filter((item) => item.verified && item.quote && item.name);
