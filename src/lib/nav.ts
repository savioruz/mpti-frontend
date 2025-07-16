import {publicLinks} from "@/lib/link.ts";

type NavLink = {
    to: string
    label: string
}

export const publicNavLink: NavLink[] = [
    { to: publicLinks.fields.to, label: 'Book Fields' },
    { to: publicLinks.about.to, label: 'About Us' },
    { to: publicLinks.contact.to, label: 'Contact' },
    { to: publicLinks.location.to, label: 'Location' },
]
