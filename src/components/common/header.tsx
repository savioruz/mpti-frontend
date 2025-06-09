import {useState, useEffect} from 'react'
import {Link} from '@tanstack/react-router'
import {publicNavLink} from "@/lib/nav.ts"
import {ModeToggle} from "@/components/ui/mode-toggle.tsx"
import {Button} from "@/components/ui/button.tsx"
import {LogIn, Menu} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx"
import {publicLinks} from "@/lib/link.ts";

export default function Header() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()

        window.addEventListener('resize', checkIfMobile)

        return () => window.removeEventListener('resize', checkIfMobile)
    }, [])

    return (
        <header
            className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto flex h-14 items-center justify-between px-4 md:px-8">
                <div className="flex items-center">
                    <Link to="/" className="text-lg font-bold">Alkidi</Link>
                </div>

                {!isMobile && (
                    <div className="flex flex-1 items-center justify-center gap-6">
                        {publicNavLink.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-2 md:gap-4">
                    <Link to={publicLinks.login.to}>
                        <Button size="icon" variant="outline">
                            <LogIn size={20}/>
                        </Button>
                    </Link>

                    <ModeToggle/>

                    {isMobile && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="md:hidden"
                                >
                                    <Menu size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                {publicNavLink.map(link => (
                                    <DropdownMenuItem key={link.to} asChild>
                                        <Link
                                            to={link.to}
                                            className="w-full cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </nav>
        </header>
    )
}
