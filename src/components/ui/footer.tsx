import { publicLinks } from "@/lib/link"
import { publicNavLink } from "@/lib/nav"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="w-full border-t bg-background p-4 text-center">
      <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} MPTI. All rights reserved.</p>
    </footer>
  )
} 