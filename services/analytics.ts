// Analytics Service
// Google Analytics 4 Integration

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

class AnalyticsService {
  private initialized = false;
  private trackingId: string;

  constructor() {
    this.trackingId = import.meta.env.VITE_GA_TRACKING_ID || '';
  }

  /**
   * Initialize Google Analytics
   */
  init() {
    if (this.initialized || !this.trackingId) {
      if (!this.trackingId) {
        console.warn('GA Tracking ID not configured. Analytics disabled.');
      }
      return;
    }

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', this.trackingId, {
      send_page_view: false, // We'll send manually
    });

    this.initialized = true;
    console.log('✅ Analytics initialized');
  }

  /**
   * Track page view
   */
  trackPageView(path: string, title?: string) {
    if (!this.initialized) {
      console.log('[Analytics] Page view:', path, title);
      return;
    }

    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  /**
   * Track custom event
   */
  trackEvent(event: AnalyticsEvent) {
    if (!this.initialized) {
      console.log('[Analytics] Event:', event);
      return;
    }

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
    });
  }

  /**
   * Track vehicle view
   */
  trackVehicleView(vehicleId: string, vehicleName: string) {
    this.trackEvent({
      action: 'view_vehicle',
      category: 'Vehicle',
      label: vehicleName,
      value: 1,
    });
  }

  /**
   * Track booking creation
   */
  trackBookingCreated(bookingId: string, amount: number) {
    this.trackEvent({
      action: 'booking_created',
      category: 'Booking',
      label: bookingId,
      value: amount,
    });
  }

  /**
   * Track payment
   */
  trackPayment(method: string, amount: number) {
    this.trackEvent({
      action: 'payment',
      category: 'Ecommerce',
      label: method,
      value: amount,
    });

    // Enhanced ecommerce tracking
    if (this.initialized) {
      window.gtag('event', 'purchase', {
        transaction_id: `TXN_${Date.now()}`,
        value: amount,
        currency: 'NPR',
        payment_type: method,
      });
    }
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string) {
    this.trackEvent({
      action: 'search',
      category: 'Search',
      label: searchTerm,
    });
  }

  /**
   * Track user signup
   */
  trackSignup(method: string) {
    this.trackEvent({
      action: 'sign_up',
      category: 'User',
      label: method,
    });
  }

  /**
   * Track error
   */
  trackError(errorMessage: string, fatal: boolean = false) {
    this.trackEvent({
      action: 'exception',
      category: 'Error',
      label: errorMessage,
      value: fatal ? 1 : 0,
    });
  }
}

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
