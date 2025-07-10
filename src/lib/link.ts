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
    location: { to: '/location' },
    about: { to: '/about' },
    contact: { to: '/contact' },
    tos: { to: '/tos' },
    privacyPolicy: { to: '/privacy-policy' },
    login: { to: '/auth/login' },
    register: { to: '/auth/register' },
    forgotPassword: { to: '/forgot-password' },
}