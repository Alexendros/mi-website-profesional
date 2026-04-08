import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Input } from "@repo/ui/components/input";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Alexendros Design System
          </h1>
          <p className="text-muted-foreground">
            Verificacion de tokens oklch, Tailwind v4 y shadcn/ui en dark mode.
          </p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Componentes Base</CardTitle>
            <CardDescription>
              15 componentes shadcn/ui con tokens oklch dark-first
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>

            <Input placeholder="Input de prueba" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contraste WCAG AA</CardTitle>
            <CardDescription>
              foreground (L=0.95) sobre background (L=0.09) = ratio mayor a 15:1
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">
              Este texto debe ser claramente legible.
            </p>
            <p className="text-muted-foreground">
              Texto muted tambien debe cumplir 4.5:1.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
