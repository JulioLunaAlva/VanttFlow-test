import { Moon, Sun, Heart, Gamepad2, Monitor, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/ThemeProvider"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle({ id }) {
    const { theme, setTheme } = useTheme()

    const themeIcons = {
        light: <Sun className="h-4 w-4" />,
        dark: <Moon className="h-4 w-4" />,
        system: <Monitor className="h-4 w-4" />
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button id={id} variant="outline" size="icon" className="relative h-10 w-10 rounded-xl bg-background/50 backdrop-blur-sm border-border/30 overflow-hidden group">
                    <div className="flex transition-transform duration-500 ease-in-out group-hover:scale-110">
                        {themeIcons[theme] || themeIcons.system}
                    </div>
                    <span className="sr-only">Cambiar Tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/30 p-1 rounded-xl">
                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 rounded-lg cursor-pointer">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span>Claro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 rounded-lg cursor-pointer">
                    <Moon className="h-4 w-4 text-blue-400" />
                    <span>Oscuro</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 rounded-lg cursor-pointer">
                    <Monitor className="h-4 w-4 opacity-50" />
                    <span>Sistema</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
