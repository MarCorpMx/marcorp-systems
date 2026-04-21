
export const ONBOARDING_ROUTES_MAP: Record<string, string> = {
    email_pending: '/onboarding/email',
    business_setup: '/onboarding/business',
    //branch_setup: '/onboarding/branch',
    //staff_confirmed: '/onboarding/staff', 
    service_created: '/onboarding/service',
    availability_set: '/onboarding/availability',
    completed: '/onboarding/completed',
};

//email_expired: '/onboarding/email-expired',


export type OnboardingStep =
    | 'email_pending'
    | 'business_setup'
    | 'service_created'
    | 'availability_set'
    | 'completed';

export const ONBOARDING_STEPS_ORDER: OnboardingStep[] = [
    'email_pending',
    'business_setup',
    'service_created',
    'availability_set',
    'completed',
];

export const ONBOARDING_STEPS_LABEL: Record<OnboardingStep, string> = {
    email_pending: 'Email',
    business_setup: 'Negocio',
    service_created: 'Servicios',
    availability_set: 'Horarios',
    completed: 'Finalizado'
};

export const ROUTE_TO_STEP_MAP: Record<string, OnboardingStep> =
    Object.fromEntries(
        Object.entries(ONBOARDING_ROUTES_MAP).map(([step, route]) => [route, step])
    ) as Record<string, OnboardingStep>;
