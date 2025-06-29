import {publicLinks} from "@/lib/link.ts";

type NavLink = {
    to: string
    label: string
}

export const publicNavLink: NavLink[] = [
    { to: publicLinks.fields.to, label: 'Jadwal Lapangan' },
    { to: publicLinks.about.to, label: 'Tentang Kami' },
    { to: publicLinks.contact.to, label: 'Kontak Kami' },
]
