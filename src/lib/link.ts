type Link = {
    to: string
}

/*
    * @example
    * publicLinks.home.to // '/'
    * publicLinks.fields.to // '/fields'
    * publicLinks.locations.to // '/locations'
    * publicLinks.about.to // '/about'
    * publicLinks.contact.to // '/contact'
    * publicLinks.login.to // '/auth/login'
    * publicLinks.register.to // '/auth/register'
    * publicLinks.forgotPassword.to // '/forgot-password'
 */
export const publicLinks: Record<string, Link> = {
    home: { to: '/' },
    fields: { to: '/fields' },
    locations: { to: '/locations' },
    about: { to: '/about' },
    contact: { to: '/contact' },
    tos: { to: '/tos' },
    privacyPolicy: { to: '/privacy-policy' },
    login: { to: '/auth/login' },
    register: { to: '/auth/register' },
    forgotPassword: { to: '/forgot-password' },
}

export const adminLinks: Record<string, Link> = {
    dashboard: { to: '/admin/dashboard' },
    locations: { to: '/admin/locations' },
    locationCreate: { to: '/admin/locations/create' },
    locationEdit: { to: '/admin/locations/edit' }, // untuk masa depan
    locationList: { to: '/admin/locations/list' }, // untuk masa depan
    users: { to: '/admin/users' },
    analytics: { to: '/admin/analytics' },
}