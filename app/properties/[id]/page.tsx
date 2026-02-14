import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    MapPin,
    Bed,
    Bath,
    Ruler,
    Car,
    Share2,
    Heart,
    Check,
    User
} from "lucide-react"
import { NeighborhoodMap } from "@/components/NeighborhoodMap"
import { FloorplanViewer } from "@/components/FloorplanViewer"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
    // Mock data based on ID - in a real app this would be a fetch
    const id = params.id

    return (
        <div className="flex min-h-screen flex-col pt-20">
            <main className="flex-1 pb-12">
                {/* Gallery Section - Simplified for MVP */}
                <div className="grid h-[400px] w-full gap-2 md:h-[600px] md:grid-cols-4 md:grid-rows-2">
                    <div className="relative col-span-2 row-span-2 bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Imagen Principal
                        </div>
                    </div>
                    <div className="relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Imagen 2
                        </div>
                    </div>
                    <div className="relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Imagen 3
                        </div>
                    </div>
                    <div className="relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Imagen 4
                        </div>
                    </div>
                    <div className="relative bg-muted">
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                            Ver más fotos
                        </div>
                    </div>
                </div>

                <div className="container mx-auto mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
                    {/* Main Content */}
                    <div className="space-y-8">
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Badge variant="default" className="text-sm">En Venta</Badge>
                                    <Badge variant="secondary" className="text-sm">Apartamento</Badge>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Heart className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Apartamento de Lujo en Pocitos con Vista al Mar</h1>
                            <div className="mt-2 flex items-center text-muted-foreground">
                                <MapPin className="mr-2 h-4 w-4" />
                                <span>Rambla República del Perú, Pocitos, Montevideo</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 rounded-xl border p-6 sm:grid-cols-4">
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                <Bed className="h-6 w-6 text-primary" />
                                <span className="font-bold">3</span>
                                <span className="text-xs text-muted-foreground">Dormitorios</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                <Bath className="h-6 w-6 text-primary" />
                                <span className="font-bold">2</span>
                                <span className="text-xs text-muted-foreground">Baños</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                <Ruler className="h-6 w-6 text-primary" />
                                <span className="font-bold">120 m²</span>
                                <span className="text-xs text-muted-foreground">Totales</span>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 text-center">
                                <Car className="h-6 w-6 text-primary" />
                                <span className="font-bold">1</span>
                                <span className="text-xs text-muted-foreground">Garage</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">Descripción</h2>
                            <p className="leading-relaxed text-muted-foreground">
                                Espectacular apartamento sobre la Rambla de Pocitos. Cuenta con amplio living comedor con salida a gran terraza con vista despejada al mar.
                                Tres dormitorios definidos, principal en suite con vestidor. Cocina definida con office y terraza lavadero.
                                Calefacción por losa radiante. Vigilancia 24hs.
                                <br /><br />
                                El edificio cuenta con amenities de primer nivel: barbacoa, gimnasio y piscina.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold">Características</h2>
                            <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
                                {["Vista al Mar", "Terraza", "Seguridad 24hs", "Gimnasio", "Piscina", "Barbacoa", "Garage", "Losa Radiante"].map((item) => (
                                    <div key={item} className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-6 pt-6">
                            <FloorplanViewer imageUrl="https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?q=80&w=1974&auto=format&fit=crop" />
                            <NeighborhoodMap location="Pocitos, Montevideo" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="sticky top-24 overflow-hidden border-2 border-primary/10 shadow-lg">
                            <CardContent className="p-6">
                                <div className="mb-6">
                                    <span className="text-sm text-muted-foreground">Precio de Venta</span>
                                    <div className="text-3xl font-bold text-primary">U$S 450,000</div>
                                    <Separator className="my-4" />
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <User className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">María Rodríguez</p>
                                            <p className="text-xs text-muted-foreground">Agente Inmobiliario</p>
                                        </div>
                                    </div>
                                </div>

                                <form className="space-y-4">
                                    <Input placeholder="Nombre completo" />
                                    <Input placeholder="Email" type="email" />
                                    <Input placeholder="Teléfono" type="tel" />
                                    <Textarea placeholder="Hola, me interesa esta propiedad..." className="min-h-[100px]" />
                                    <Button className="w-full text-base font-semibold">Contactar Agente</Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
